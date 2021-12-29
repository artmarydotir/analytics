const UserList = require('./User/UserList');
const UserListForAdminClient = require('./User/UserListForAdminClient');
const UserProfile = require('./User/UserProfile');
const Gravatar = require('./User/Gravatar');
const ProjectProfile = require('./Project/ProjectProfile');
const UserForgotPassword = require('./User/UserForgotPassword');
const ProjectList = require('./Project/ProjectList');
const ProjectSimpleList = require('./Project/ProjectSimpleList');
const ClientProjectList = require('./Project/ClientProjectList');
const ProjectShowPrivateToken = require('./Project/ProjectShowPrivateToken');
const DomainList = require('./Domain/DomainList');
const DomainProfile = require('./Domain/DomainProfile');
const UptimeList = require('./Uptime/UptimeList');
const UptimeProfile = require('./Uptime/UptimeProfile');

module.exports = {
  UserList,
  UserListForAdminClient,
  Gravatar,
  UserProfile,
  UserForgotPassword,
  ProjectProfile,
  ProjectList,
  ClientProjectList,
  ProjectSimpleList,
  ProjectShowPrivateToken,
  DomainList,
  DomainProfile,
  UptimeList,
  UptimeProfile,
};
