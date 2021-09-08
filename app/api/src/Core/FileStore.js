const crypto = require('crypto');
const util = require('util');
const path = require('path');
const fsp = require('fs').promises;
// eslint-disable-next-line security/detect-child-process
const { exec } = require('child_process');

const mime = require('mime-types');

const execPromise = util.promisify(exec);

class FileStore {
  constructor({ Redis, Config }) {
    /** @type {import('../Connections/Redis')} */
    this.Redis = Redis;
  }

  // async safeURL(url) {}

  /**
   * @param {String} hash
   * @throws {Error}
   * @returns {String}
   */
  static getFilePath(hash) {
    let p1;
    let p2;
    const hashArchive = hash.match(/^([0-9]{6})_([a-z0-9]{17})$/i);
    if (hashArchive) {
      [p1] = hashArchive;
      p2 = hashArchive[2].substr(-1);
      return `/storage/files/a/${p1}/${p2}/${hash}`;
    }

    const hashUnique = hash.match(/^h_([a-z0-9]{22})$/i);
    if (hashUnique) {
      p1 = hashArchive[2].substr(-1);
      p2 = hashArchive[2].substr(-3, 2);
      return `/storage/files/h/${p1}/${p2}/${hash}`;
    }

    const hashStatic = hash.match(/^[a-z0-9]{12,24}$/i);
    if (hashStatic) {
      p1 = hash.substr(-1);
      p2 = hash.substr(-3, 2);
      return `/storage/files/u/${p1}/${p2}/${hash}`;
    }

    throw new Error('Hash is not valid');
  }

  /**
   * @returns {Promise<String>}
   */
  static async generateHashArchive() {
    // xxxxxxxxxxxxxxxxx
    const random = await new Promise((resolve) => {
      crypto.randomBytes(24, (_, buf) => {
        resolve(
          buf
            .toString('base64')
            .replace(/[^a-z0-9]/gi, '')
            .substr(0, 17),
        );
      });
    });

    // yyyyMM
    const time = new Date().toISOString().slice(0, 8).replace(/-/g, '');

    // yyyyMM_xxxxxxxxxxxxxxxxx
    return `${time}_${random}`;
  }

  /**
   * @param {String} unique
   */
  static generateHashUnique(unique) {
    const hash = crypto.createHash('sha512');
    hash.update(unique);
    const base62 = hash
      .digest('base64')
      .replace(/[^a-z0-9]/gi, '')
      .substr(0, 22);

    // h_xxxxxxxxxxxxxxxxxxxxxx
    return `h_${base62}`;
  }

  /**
   * @param {String} unique
   * @throws {Error}
   */
  static generateUnique(unique) {
    if (unique.match(/^[a-z0-9]{12,24}$/i)) {
      // xxxxxxxxxxxxxx -> xxxxxxxxxxxxxxxxxxxxxxxxxxxx
      return unique;
    }

    throw new Error('Unique is not valid');
  }

  static async saveFile(hash, sourcePath, name) {
    const destinationDir = FileStore.getFilePath(hash);
    const inputExtension = path.extname(name).replace(/^./, '').toLowerCase();

    const mimetype = (
      await execPromise(`file -b --mime-type ${sourcePath}`, {
        encoding: 'utf8',
      })
    ).stdout.trim();

    let extension = mime.extension(mimetype);
    const possibleExtensions = mime.extensions[`${mimetype}`];
    if (possibleExtensions.includes(inputExtension)) {
      extension = inputExtension;
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stat = await fsp.stat(sourcePath);
  }
}

module.exports = FileStore;
