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
const ClientScript = require('./Project/ClientScript');

const DomainList = require('./Domain/DomainList');
const DomainProfile = require('./Domain/DomainProfile');
const UptimeList = require('./Uptime/UptimeList');
const UptimeProfile = require('./Uptime/UptimeProfile');
const PerformanceList = require('./Performance/PerformanceList');
const PerformanceProfile = require('./Performance/PerformanceProfile');

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
  ClientScript,
  DomainList,
  DomainProfile,
  UptimeList,
  UptimeProfile,
  PerformanceList,
  PerformanceProfile,
};
