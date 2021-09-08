const { Organization } = require('@aasaam/information');

module.exports = {
  // do not change these variables
  aasaam: Organization.fa,
  copyright: 'تمامی حقوق متعلق به {name} می‌باشد.',
  dir: 'rtl',
  projectName: 'عنوان پروژه',
  projectShortName: 'عنوان',
  projectDescription: 'توضیحات بیشتر در مورد پروژه',
  loading: 'بارگزاری...',

  // rest of the variables
  admin: 'ادمین',
  validations: {
    mobileNumber: '{_field_} صحیح نمی‌باشد.',
    min: '{_field_} حداقل باید {length} باشد.',
    numeric: '{_field_} باید متشکل از اعداد باشد.',
    required: '{_field_} الزامی است',
    length: '{_field_} باید {length} باشد.',
  },
};
