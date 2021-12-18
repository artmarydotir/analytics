const Organization = require('@aasaam/information/logo/service/htm/info-en');

module.exports = {
  aasaam: Organization,
  copyright: 'Copyright {name}',
  dir: 'ltr',
  // projectName: Organization.name,
  // projectShortName: Organization.name,
  // projectDescription: Organization.description,
  projectFooter: 'ANALYTIC | Powered By aasaam',
  loading: 'Loading...',
  contactSupport: 'Contact {name} support',
  telSupport: 'Tel {name}',
  pageNotFound: 'page    dddNotFound',
  // ## Login
  email: 'Email',
  password: 'Password',
  otpCode: 'OTP Code',
  login: 'Login',
  forgotPassword: 'Forgot Password ?',
  forgot_password: 'Forgot Password',
  captcha: 'Captcha',
  required: 'Field is required',
  emailorusername: 'Email or username',
  sendMeCode: 'Send Code',
  resetPassword: 'Reset Password',
  recoverPassword: 'Recover Password',
  code: 'Code',
  newPassword: 'New password',
  repeatPassword: 'Repeat password',
  changePassword: 'Change Password',

  // ## MENU
  dashboard: 'Dashboard',
  domainManagement: 'Manage Domains',
  domainAdd: 'Add Domain',
  domainList: 'Domain List',
  projectManagement: 'Manage Projects',
  projectAdd: 'Add Project',
  projectList: 'Project List',
  userManagement: 'Manage Users',
  userAdd: 'Add User',
  userList: 'User List',
  showProfile: 'Show Profile',
  logOut: 'Logout',
  client: 'Client',

  // ## Profile
  welcome: 'Welcome',
  mobile: 'Mobile',
  role: 'Role',
  viewer: 'Viewer',
  superAdmin: 'Super Admin',
  admin: 'Admin',
  deleteUser: 'Delete User',
  // ## DOMAIN
  domain: 'Domain',
  wildcardDomain: 'Wild Card Domain',
  active: 'Active',
  remove: 'Delete',
  description: 'Description',
  selectProject: 'Select Project',
  reset: 'Reset',
  project: 'Project',
  status: 'Status',
  options: 'Options',
  action: 'Action',
  deleted: 'Deleted',
  noResult: 'No Result',
  domainEdit: 'Edit Domain',
  deleteDomain: 'Delete Domain',

  // ## PROJECT
  title: 'Title',
  projectDescription: 'Project Description',
  projectName: 'Project Name',
  areYouSureDelete: 'Are You Sure To Delete Below Item:',
  deleteProject: 'Delete Project',
  nope: 'No',
  publicToken: 'Public Token',
  primaryOwner: 'Primary Owner',
  selectUserSearch: 'Searching Users...',
  selectUser: 'Select User',
  selectRules: 'Select Rules',
  showPrivateToken: 'Show Private Token',
  createdAt: 'Created Date',
  users: 'Users',
  showPrivateTokenQuote:
    'Dear user, In order to see private token, please enter your current password.',
  privateToken: 'Private Token',
  close: 'Close',
  projectEdit: 'Edit Project',
  editProject: 'Edit Project',
  projectNotFound: 'Project Not Found',
  deleteProjectWarning:
    'By deleting this project, all domain that belongs to this will be deactivate too.',
  // ## USERS
  username: 'Username',
  chooseRole: 'Choose Role',
  chooseLang: 'Choose Language',
  selectCountry: 'Choose Country',
  mobileNumber: 'Mobile Number',
  id: 'Id',
  editProfile: 'Edit Profile',
  editData: 'Edit Data',
  editPassword: 'Change Password',

  otherError: 'Other Error',
  errMsg: 'Filed {item} : {rule}',
  loadMore: 'Load More',
  success: {
    WELCOME: 'Welcome',
    CREATED: 'Successfully Created.',
    EDITED: 'Successfully Edited.',
    UPDATED: 'Successfully Updated.',
    DELETED: 'Successfully Deleted.',
    GENERATED_PRIVATE_TOKEN: 'Successfully generated private token.',
  },
  errors: {
    UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
    DUPLICATE_ENTRY: 'Duplicate Entry',
    NOT_ALLOWED: 'Expired.',
    MIN_LENGTH: 'min length is not valid.',
    MAX_LENGTH: 'min length is not valid.',
    INVALID_REGEX: 'does not have valid regex.',
    INVALID_PASSWORD: 'does not have valid password.',
    INVALID_ROLE: 'does not have valid role.',
    INVALID_LANG: 'does not have valid language.',
    INVALID_COUNTRY: 'does not have valid country.',
    INVALID_MOBILE: 'does not have valid mobile.',
    INVALID_DOMAIN: 'does not have valid domain.',
    INVALID_CAPTCHA: 'does not have valid captcha.',
    NOT_EXIST: 'does not exist.',
    OTHER_ERROR: 'other error happened',
    FORBIDDEN: 'forbidden',
    INVALID_PROJECT_RULE: 'does not have valid rule',
    ISREQUIRE_FIELD: 'must be required.',
    UNAUTHORIZED: 'You are not authorized.',
    ISREQUIRE_ID: 'must have id.',
    ISREQUIRE_PASSWORD: 'must have password.',
  },
  // ## validations
  validations: {
    alpha: 'The {_field_} field may only contain alphabetic characters',
    alpha_num: 'The {_field_} field may only contain alpha-numeric characters',
    alpha_dash:
      'The {_field_} field may contain alpha-numeric characters as well as dashes and underscores',
    alpha_spaces:
      'The {_field_} field may only contain alphabetic characters as well as spaces',
    between: 'The {_field_} field must be between 0:{min} and 1:{max}',
    confirmed: 'The {_field_} field confirmation does not match',
    digits:
      'The {_field_} field must be numeric and exactly contain {length} digits',
    dimensions:
      'The {_field_} field must be 0:{width} pixels by 1:{height} pixels',
    email: 'The {_field_} field must be a valid email',
    excluded: 'The {_field_} field is not a valid value',
    ext: 'The {_field_} field is not a valid file',
    image: 'The {_field_} field must be an image',
    integer: 'The {_field_} field must be an integer',
    length: 'The {_field_} field must be 0:{length} long',
    max_value: 'The {_field_} field must be 0:{max} or less',
    max: 'The {_field_} field may not be greater than 0:{length} characters',
    mimes: 'The {_field_} field must have a valid file type',
    min_value: 'The {_field_} field must be 0:{min} or more',
    min: 'The {_field_} field must be at least 0:{length} characters',
    numeric: 'The {_field_} field may only contain numeric characters',
    one_of: 'The {_field_} field is not a valid value',
    regex: 'The {_field_} field format is invalid',
    required_if: 'The {_field_} field is required',
    required: 'The {_field_} field is required',
    size: 'The {_field_} field size must be less than 0:{size}KB',
    url: 'The {_field_} field is not a valid URL',
    passmeter:
      'The password must contain at least 8 characters, contain a-z/A-Z , number , special chars like (=[];/~!@#$%^&*()_+{}|:<>?)',
  },
};
