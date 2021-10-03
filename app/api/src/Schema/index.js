const { schema: CountryCodes } = require('./CountryCodes');
const { schema: Modules } = require('./Modules');
const { schema: LanguageCodes } = require('./LanguageCodes');
const { schema: LogLevels } = require('./LogLevels');
const { schema: UserActions } = require('./UserActions');
const { schema: UserRoles } = require('./UserRoles');
const { schema: UserStatus } = require('./UserStatus');
const { schema: ProjectStatus } = require('./ProjectStatus');
const { schema: DomainStatus } = require('./DomainStatus');
const { schema: ProjectDomainList } = require('./ProjectDomainList');

module.exports = [
  CountryCodes,
  Modules,
  LanguageCodes,
  LogLevels,
  UserActions,
  UserRoles,
  UserStatus,
  ProjectStatus,
  DomainStatus,
  ProjectDomainList,
];
