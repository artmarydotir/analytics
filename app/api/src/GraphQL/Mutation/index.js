const UserUpdatePassword = require('./User/UserUpdatePassword');
const OtpGenerate = require('./User/OtpGenerate');
const UserCreate = require('./User/UserCreate');
const UserUpdate = require('./User/UserUpdate');
const UserDelete = require('./User/UserDelete');
const ProjectCreate = require('./Project/ProjectCreate');
const ProjectUpdate = require('./Project/ProjectUpdate');
const ProjectDelete = require('./Project/ProjectDelete');
const DomainCreate = require('./Domain/DomainCreate');

module.exports = {
  UserCreate,
  UserUpdate,
  UserDelete,
  OtpGenerate,
  UserUpdatePassword,
  ProjectCreate,
  ProjectUpdate,
  ProjectDelete,
  DomainCreate,
};
