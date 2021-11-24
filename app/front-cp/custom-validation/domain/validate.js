import { PhoneNumberUtil } from 'google-libphonenumber';

export default function (value, code) {
  if (!value || value.length === 0) {
    return;
  }
  const phoneUtil = PhoneNumberUtil.getInstance();

  const number = phoneUtil.parse(value, code);
  if (phoneUtil.isValidNumber(number, code)) {
    return true;
  } else {
    return false;
  }
}
