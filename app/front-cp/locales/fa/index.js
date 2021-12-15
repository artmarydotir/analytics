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
  pageNotFound: 'یافت نشد',
  // ## Login
  login: 'ورود',
  admin: 'ادمین',
  password: 'رمز عبور',
  otp: 'رمز یکبار مصرف',
  email: 'ایمیل',
  captcha: 'کد امنیتی',
  otpCode: 'رمز یکبار مصرف',
  forgotPassword: 'رمز عبور خود را فراموش کرده‌اید؟',
  forgetPassword: 'فراموشی رمز عبور',
  enterEmail: 'لطفا ایمیل خود را جهت ارسال کد وارد کنید',
  sendMeCode: 'ارسال کد',
  back: 'بازگشت',
  enterRecoverCode: 'لطفا کد دریافتی را وارد کنید',
  resendCode: 'ارسال مجدد کد؟',
  code: 'کد',
  newPassword: 'رمزعبور جدید',
  repeatPassword: 'تکرار رمزعبور',
  changePassword: 'تغییر رمزعبور',
  // ## MENU
  dashboard: 'داشبورد',
  domainManagement: 'مدیریت دامنه ها',
  domainAdd: 'افزودن دامنه',
  domainList: 'لیست دامنه',
  projectManagement: 'مدیریت پروژه ها',
  projectAdd: 'افزودن پروژه',
  projectList: 'لیست پروژه',
  userManagement: 'مدیریت کاربران',
  userAdd: 'افزودن کاربر',
  userList: 'لیست کاربر',
  showProfile: 'نمایش پروفایل',
  logOut: 'خروج',
  client: 'کلاینت',
  // ## Profile
  welcome: 'خوش آمدید',
  mobile: 'موبایل',
  role: 'نقش',
  viewer: 'مشاهده کننده',
  superAdmin: 'سوپر ادمین',
  // ## DOMAIN
  domain: 'دامنه',
  wildcardDomain: 'دامنه ی وایلدکارد',
  active: 'فعال',
  remove: 'حذف',
  description: 'توضیحات',
  selectProject: 'انتخاب پروژه',
  reset: 'ازنو',
  project: 'پروژه',
  status: 'وضعیت',
  options: 'گزینه ها',
  action: 'عملیات',
  deleted: 'حذف شده',
  noResult: 'هیچ داده ای یافت نشد.',
  loadMore: 'بیشتر...',
  domainEdit: 'ویرایش دامنه',
  // ## PROJECT
  title: 'عنوان',
  publicToken: 'کد عمومی',
  primaryOwner: 'صاحب اصلی پروژه',
  selectUserSearch: 'کاربر مورد نظر را جستجو کنید',
  selectUser: 'افزودن کاربر',
  selectRules: 'انتخاب قواعد',
  showPrivateToken: 'نمایش کد خصوصی',
  createdAt: 'تاریخ ایجاد',
  users: 'کاربران',
  showPrivateTokenQuote:
    'کاربر گرامی ، جهت مشاهده ی توکن خصوصی این پروژه لطفا رمز عبور خود را وارد نمایید.',
  privateToken: 'کد خصوصی',
  close: 'بستن',
  projectEdit: 'ویرایش پروژه',
  projectNotFound: 'پروژه یافت نشد',
  // ## USERS
  username: 'نام کاربری',
  chooseRole: 'انتخاب نقش',
  chooseLang: 'انتخاب زبان',
  selectCountry: 'انتخاب کشور',
  mobileNumber: 'شماره موبایل',
  id: 'آیدی',
  editProfile: 'ویرایش پروفایل',
  editData: 'ویرایش اطلاعات',
  editPassword: 'ویرایش رمز عبور',
  validations: {
    mobileNumber: '{_field_} صحیح نمی‌باشد.',
    min: '{_field_} حداقل باید {length} باشد.',
    numeric: '{_field_} باید متشکل از اعداد باشد.',
    required: '{_field_} الزامی است',
    length: '{_field_} باید {length} باشد.',
  },
};
