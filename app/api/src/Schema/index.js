const { schema: CountryCodes } = require('./CountryCodes');
const { schema: Modules } = require('./Modules');
const { schema: LanguageCodes } = require('./LanguageCodes');
const { schema: LogLevels } = require('./LogLevels');
const { schema: UserActions } = require('./UserActions');
const { schema: UserRoles } = require('./UserRoles');
const { schema: UserOption } = require('./UserOption');
const { schema: ProjectOption } = require('./ProjectOption');
const { schema: DomainOption } = require('./DomainOption');
// const { schema: ProjectDomainList } = require('./ProjectDomainList');
const { schema: UserAuthType } = require('./UserAuthType');
const { schema: UserSignIn } = require('./UserSignIn');
const { schema: Captcha } = require('./Captcha');
const { schema: UserResetPassword } = require('./UserResetPassword');
const { schema: PvPageview } = require('./PvPageview');
const { schema: RefererData } = require('./RefererData');
const { schema: TopUrls } = require('./TopUrls');
const { schema: PageViewCursor } = require('./PageViewCursor');
const { schema: HistogramPageView } = require('./HistogramPageView');
const { schema: ActionCount } = require('./ActionCount');
const { schema: CategoryCount } = require('./CategoryCount');
const { schema: IdentCount } = require('./IdentCount');
const { schema: IdentHistogram } = require('./IdentHistogram');

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
  // ProjectDomainList,
  UserAuthType,
  UserSignIn,
  Captcha,
  UserResetPassword,
  PvPageview,
  RefererData,
  TopUrls,
  PageViewCursor,
  HistogramPageView,
  ActionCount,
  CategoryCount,
  IdentCount,
  IdentHistogram,
];
