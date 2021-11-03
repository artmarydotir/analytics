const otpData = {
  computed: {
    applications() {
      return [
        {
          name: 'Free OTP',
          items: [
            {
              icon: 'mdi-google-play',
              title: this.$t('googlePlayDownload'),
              link: 'https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp',
            },
            {
              icon: 'mdi-apple',
              title: this.$t('appStoreDownload'),
              link: 'https://apps.apple.com/us/app/freeotp-authenticator/id872559395',
            },
            {
              icon: 'mdi-android',
              title: this.$t('fdroidDownload'),
              link: 'https://f-droid.org/packages/org.fedorahosted.freeotp/',
            },
          ],
        },
        {
          name: 'Google Authenticator',
          items: [
            {
              icon: 'mdi-google-play',
              title: this.$t('googlePlayDownload'),
              link: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en',
            },
            {
              icon: 'mdi-apple',
              title: this.$t('appStoreDownload'),
              link: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
            },
          ],
        },
      ];
    },
  },
};
export default otpData;
