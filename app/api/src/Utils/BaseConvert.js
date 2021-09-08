const base62 = {
  c: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  b: BigInt(62),
};

const base58 = {
  c: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  b: BigInt(58),
};

class BaseConvert {
  /**
   * @param {'62'|'58'} mode
   */
  static getMode(mode) {
    let chars = base62.c;
    let bigInt = base62.b;
    if (mode === '58') {
      chars = base58.c;
      bigInt = base58.b;
    }
    return { chars, bigInt };
  }

  /**
   * @param {Buffer} buf
   * @param {'62'|'58'} mode
   * @return {String}
   */
  static bufferEncode(buf, mode = '62') {
    const { chars, bigInt } = BaseConvert.getMode(mode);

    let x = BigInt(`0x${buf.toString('hex')}`);
    let result = '';
    while (x > 0) {
      result = chars.charAt(Number(x % bigInt)) + result;
      x /= bigInt;
    }
    return result;
  }

  /**
   * @param {String} str
   * @param {'62'|'58'} mode
   * @return {Buffer}
   */
  static bufferDecode(str, mode = '62') {
    const { chars, bigInt } = BaseConvert.getMode(mode);
    let result = BigInt(0);

    for (let i = 0; i < str.length; i += 1) {
      result = result * bigInt + BigInt(chars.indexOf(str.charAt(i)));
    }

    return Buffer.from(result.toString(16), 'hex');
  }

  /**
   * @param {String} str
   * @param {'62'|'58'} mode
   * @return {String}
   */
  static stringEncode(str, mode = '62') {
    return BaseConvert.bufferDecode(Buffer.from(str, 'utf8'), mode);
  }

  /**
   * @param {String} str
   * @param {'62'|'58'} mode
   * @return {String}
   */
  static stringDecode(str, mode = '62') {
    return BaseConvert.bufferDecode(str, mode).toString('utf8');
  }

  /**
   * @param {Number} num
   * @param {'62'|'58'} mode
   * @return {String}
   */
  static intEncode(num, mode = '62') {
    return BaseConvert.bufferDecode(
      Buffer.from(num.toString('hex'), 'hex'),
      mode,
    );
  }

  /**
   * @param {String} str
   * @param {'62'|'58'} mode
   * @return {Number}
   */
  static numDecode(str, mode = '62') {
    return parseInt(BaseConvert.bufferDecode(str, mode).toString('hex'), 16);
  }
}

module.exports = BaseConvert;
