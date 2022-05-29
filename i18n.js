const NextI18Next = require('next-i18next').default;
// const { localeSubpaths } = require('next/config').default().publicRuntimeConfig;
const path = require('path');

let loadPath = 'public/static/locales/{{lng}}/{{ns}}.json';
if (typeof window !== 'undefined') {
  loadPath = '/static/locales/{{lng}}/{{ns}}.json';
  if (process.env.S3_URL && process.env.BUILD_ID) {
    loadPath = process.env.S3_URL + '/public/static/locales/{{lng}}/{{ns}}.json'; // s3upload.js에서 업로드된 locale 파일 사용
  }
}

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'ko',
  fallbackLng: 'ko',
  // localePath: path.resolve('./public/static/locales'),
  localePath: typeof window === 'undefined' ? 'public/static/locales' : 'static/locales',
  backend: {
    crossDomain: true,
    loadPath,
  },
  defaultNS: 'common',
  debug: false,
});

module.exports = NextI18NextInstance;

const { appWithTranslation, withTranslation, useTranslation, Trans, i18n } = NextI18NextInstance;

module.exports.appWithTranslation = appWithTranslation;
module.exports.withTranslation = withTranslation;
module.exports.useTranslation = useTranslation;
module.exports.Trans = Trans;
module.exports.i18n = i18n;
