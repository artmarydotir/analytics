const { Organization } = require('@aasaam/information');

module.exports = {
  // do not change these variables
  aasaam: Organization.en,
  copyright: 'Copyright {name}',
  dir: 'ltr',
  projectName: 'Project title',
  projectShortName: 'Title',
  projectDescription: 'Project description could be here',
  loading: 'Loading...',
  contactSupport: 'Contact {name} support',
  telSupport: 'Tel {name}',

  admin: 'Admin',
  validations: {
    mobileNumber: '{_field_} is not correct.',
    min: 'The {field} field must be at least 0:{length} characters',
    numeric: 'The {field} field may only contain numeric characters',
    required: 'The {field} field is required',
    length: 'The {field} field must be 0:{length} long',
  },
};
