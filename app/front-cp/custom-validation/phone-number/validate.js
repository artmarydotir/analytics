import parsePhoneNumber from 'libphonenumber-js';

/**
 * @param {String} value
 * @param {String} countryCode
 * @param {[]String} types
 * @return  {Boolean}
 */
export default function (value, countryCode, types = []) {
  if (!value || value.length === 0) {
    return false;
  }
  const phoneNumber = parsePhoneNumber(value, countryCode);
  if (
    phoneNumber &&
    phoneNumber.getType() &&
    types.includes(phoneNumber.getType())
  ) {
    return true;
  }

  return false;
}
