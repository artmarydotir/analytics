const { schema: CountryCodes } = require('./CountryCodes');
const { schema: Modules } = require('./Modules');
const { schema: LanguageCodes } = require('./LanguageCodes');
const { schema: LogLevels } = require('./LogLevels');
const { schema: UserActions } = require('./UserActions');
const { schema: UserRoles } = require('./UserRoles');
const { schema: UserOption } = require('./UserOption');
const { schema: ProjectOption } = require('./ProjectOption');
const { schema: DomainOption } = require('./DomainOption');
const { schema: ProjectDomainList } = require('./ProjectDomainList');

module.exports = [
  CountryCodes,
  Modules,
  LanguageCodes,
  LogLevels,
  UserActions,
  UserRoles,
  UserOption,
  ProjectOption,
  DomainOption,
  ProjectDomainList,
];
