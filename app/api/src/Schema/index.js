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
const { schema: UserAuthType } = require('./UserAuthType');
const { schema: UserSignIn } = require('./UserSignIn');
const { schema: Captcha } = require('./Captcha');
const { schema: UserResetPassword } = require('./UserResetPassword');
const { schema: PvPageview } = require('./PvPageview');

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
  UserAuthType,
  UserSignIn,
  Captcha,
  UserResetPassword,
  PvPageview,
];
