const UserUpdatePassword = require('./User/UserUpdatePassword');
const OtpGenerate = require('./User/OtpGenerate');
const UserCreate = require('./User/UserCreate');
const UserUpdate = require('./User/UserUpdate');
const UserDelete = require('./User/UserDelete');
const ProjectCreate = require('./Project/ProjectCreate');
const ProjectUpdate = require('./Project/ProjectUpdate');
const ProjectDelete = require('./Project/ProjectDelete');
const ProjectUpdateUserRules = require('./Project/ProjectUpdateUserRules');
const PrivateTokenRegenerate = require('./Project/PrivateTokenRegenerate');
const DomainCreate = require('./Domain/DomainCreate');
const DomainUpdate = require('./Domain/DomainUpdate');
const DomainDelete = require('./Domain/DomainDelete');
const UptimeCreate = require('./Uptime/UptimeCreate');
const UptimeDelete = require('./Uptime/UptimeDelete');
const UptimeUpdate = require('./Uptime/UptimeUpdate');
const PerformanceCreate = require('./Performance/PerformanceCreate');
const PerformanceDelete = require('./Performance/PerformanceDelete');
const PerformanceUpdate = require('./Performance/PerformanceUpdate');

module.exports = {
  UserCreate,
  UserUpdate,
  UserDelete,
  OtpGenerate,
  UserUpdatePassword,
  ProjectCreate,
  ProjectUpdate,
  ProjectUpdateUserRules,
  ProjectDelete,
  PrivateTokenRegenerate,
  DomainCreate,
  DomainUpdate,
  DomainDelete,
  UptimeCreate,
  UptimeDelete,
  UptimeUpdate,
  PerformanceCreate,
  PerformanceDelete,
  PerformanceUpdate,
};
