const UserUpdatePassword = require('./User/UserUpdatePassword');
const OtpGenerate = require('./User/OtpGenerate');
const UserCreate = require('./User/UserCreate');
const UserUpdate = require('./User/UserUpdate');
const UserDelete = require('./User/UserDelete');
const ProjectCreate = require('./Project/ProjectCreate');
const ProjectUpdate = require('./Project/ProjectUpdate');
const ProjectDelete = require('./Project/ProjectDelete');
const PrivateTokenRegenerate = require('./Project/PrivateTokenRegenerate');
const DomainCreate = require('./Domain/DomainCreate');
const DomainUpdate = require('./Domain/DomainUpdate');
const DomainDelete = require('./Domain/DomainDelete');

module.exports = {
  UserCreate,
  UserUpdate,
  UserDelete,
  OtpGenerate,
  UserUpdatePassword,
  ProjectCreate,
  ProjectUpdate,
  ProjectDelete,
  PrivateTokenRegenerate,
  DomainCreate,
  DomainUpdate,
  DomainDelete,
};
