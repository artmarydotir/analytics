/**
 * @param {String|Boolean|Number} value
 * @returns {String}
 */
module.exports = (value) => {
  switch (typeof value) {
    case 'number':
      return value.toString();
    case 'string':
      return `'${value.replace(/(?=['\\])/g, '\\')}'`;
    case 'boolean':
      return value ? '1' : '0';
    default:
      throw new Error(`escape(${typeof value}) not implemented`);
  }
};
