// const { writeFile } = require('fs').promises;
// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
// const { ErrorWithProps } = require('mercurius').default;
// const {
//   constantsMerge: errorConstMerge,
// } = require('../../Schema/ErrorMessage');

class CollectionProcess {
  constructor({ sequelize, Config }) {
    this.sequelize = sequelize;
    this.Config = Config;
  }

  // eslint-disable-next-line class-methods-use-this
  async getBackup() {
    // const { Project, UserProject, Domain, Uptime, Performance } =
    //   this.sequelize.models;
    // // 1. Get all collections
    // const projects = await Project.findAll();
    // const users = await UserProject.findAll();
    // const domains = await Domain.findAll();
    // const uptimes = await Uptime.findAll();
    // const performances = await Performance.findAll();
    // const info = [
    //   {
    //     tableName: 'Project',
    //     data: projects,
    //   },
    //   {
    //     tableName: 'UserProject',
    //     data: users,
    //   },
    //   {
    //     tableName: 'Domain',
    //     data: domains,
    //   },
    //   {
    //     tableName: 'Uptime',
    //     data: uptimes,
    //   },
    //   {
    //     tableName: 'Performance',
    //     data: performances,
    //   },
    // ];
    // const { stderr } = await exec(`cd /tmp/ && rm -rf backup && mkdir backup`);
    // if (stderr) {
    //   throw new Error(`${stderr}`);
    // }
    // // 2. Write all collections to file
    // const filePromise = [];
    // info.forEach((item) => {
    //   const { tableName, data } = item;
    //   const fileName = `${tableName}.json`;
    //   const filePath = `/tmp/backup/${fileName}`;
    //   filePromise.push(writeFile(filePath, JSON.stringify(data)));
    // });
    // await Promise.all(filePromise);
    // // 3. Zip backup directory
    // await this.zipBackup();
    // // return result;
  }

  // async zipBackup() {
  //   const date = new Date().toISOString();
  //   const time = date.replace(/[^0-9]+/g, '_');
  //   const fileName = `backup_${time}.zip`;
  //   const zipPassword = this.Config.ASM_ZIP_PASSWORD;

  //   const { stderr } = await exec(
  //     `cd /tmp/ && 7z a  -t7z -m0=lzma2 -mx=9 -mfb=64   -md=32m -ms=on -mhe=on -p'${zipPassword}' ${fileName}.7z backup`,
  //   );

  //   if (stderr) {
  //     throw new Error(`${stderr}`);
  //   }
  //   return fileName;
  // }

  // async restoreBackup(fileName) {
  //   // 2. Destroy all models
  //   const promiseModel = [];
  //   const all = ['Project', 'UserProject', 'Domain', 'Uptime', 'Performance'];
  //   all.forEach((model) => {
  //     promiseModel.push(
  //       this.sequelize.models[`${model}`].destroy({
  //         where: {},
  //         truncate: true,
  //         cascade: true,
  //         restartIdentity: true,
  //       }),
  //     );
  //   });
  //   await Promise.all(promiseModel);

  //   // 3. Insert backup file to collections
  //   // const { stdout } = await exec(`cat /tmp/backup/Project.json`);
  //   // console.log(stdout);

  //   // bulk insert stdout to table
  //   // const bulk = await Project.bulkCreate(JSON.parse(stdout));
  // }
}

module.exports = CollectionProcess;
