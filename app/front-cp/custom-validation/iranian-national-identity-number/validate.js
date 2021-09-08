/**
 * Iranian National Identity Number
 *
 * @param {String|Number} value
 * @returns {Boolean}
 */
export default function IranianNationalIdentityNumber(input) {
  if (typeof input === 'undefined' || !input) {
    return false;
  }
  let value = input;
  if (typeof input === 'number') {
    value = input.toString();
  }
  const check = parseInt(value[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += parseInt(value[i], 10) * (10 - i);
  }
  sum %= 11;
  const result = (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
  return result;
}
