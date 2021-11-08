const UserUpdatePassword = require('./User/UserUpdatePassword');
const OtpGenerate = require('./User/OtpGenerate');
const UserCreate = require('./User/UserCreate');
const UserUpdate = require('./User/UserUpdate');
const UserDelete = require('./User/UserDelete');

module.exports = {
  UserCreate,
  UserUpdate,
  UserDelete,
  OtpGenerate,
  UserUpdatePassword,
};
