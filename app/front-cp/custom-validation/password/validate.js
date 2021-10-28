/**
 * Iranian identity card validation
 * سنجش قدرت رمزعبور
 *
 * @param {string} value
 * @returns {calculated integer}
 */

export default function passwordStrength(value) {
  let strength = 0;

  if (!value || value.length === 0) {
    return;
  }
  if (value.match(/[a-z]+/)) {
    strength += 25;
  }
  if (value.match(/[A-Z]+/)) {
    strength += 25;
  }
  if (value.match(/\d/)) {
    strength += 25;
  }
  if (value.match(/(?=.*[!@#$%^&*])/)) {
    strength += 25;
  }
  return {
    strength,
  };
}
