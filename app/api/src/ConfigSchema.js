const { list: LanguageCodes } = require('./Schema/LanguageCodes');

const TEST_MODE = process.env.ASM_PUBLIC_APP_TEST === 'true';

/** @type {import('json-schema').JSONSchema7} */
const ConfigSchema = {
  type: 'object',
  required: [
    // public
    'ASM_PUBLIC_APP_NS',
    'ASM_PUBLIC_APP_READ_ONLY',
    'ASM_PUBLIC_APP_TEST',
    'ASM_PUBLIC_APP_TITLE',
    'ASM_PUBLIC_BASE_URL',
    'ASM_PUBLIC_POST_UPLOADED_SIZE_BYTES',

    // private
    'ASM_PM_ID',
    'ASM_APP_INSTANCE',
    'ASM_APP_PORT',
    'ASM_AUTH_COOKIE',
    'ASM_AUTH_USER_API_KEY',
    'ASM_AUTH_HMAC_SECRET',
    'ASM_AUTH_HMAC_ALG',
    'ASM_LOG_LEVEL',

    // resource
    'ASM_REDIS_URI',
    'ASM_SMTP_URI',
    // 'ASM_POSTGRES_URI',
  ],
  properties: {
    ASM_PM_ID: {
      type: 'number',
      description: 'PM2 process identifier',
      default: 0,
      minimum: 0,
    },

    ASM_DEFAULT_ADMIN_USERNAME: {
      type: 'string',
      description: 'Default administrator username',
      default: 'superadmin',
    },

    ASM_PUBLIC_DOMAIN: {
      type: 'string',
      description: 'Domain of project',
      default: 'localhost',
    },

    ASM_PUBLIC_CDN_SUB_DOMAIN: {
      type: 'string',
      description: 'CDN subdomain of project for content delivery boost',
      default: 'cdn.localhost',
    },

    ASM_PUBLIC_APP_TITLE: {
      type: 'string',
      description: 'Application title',
      default: 'Test Application',
    },

    ASM_CLIENT_APP_SECRET_HEADER: {
      type: 'string',
      description: 'Client application secret header for bypass ratelimit',
      minLength: 32,
      maxLength: 64,
      default: '000000000000000000000000000000000000000000000000',
    },

    ASM_PUBLIC_APP_LANG: {
      type: 'string',
      description: 'Application default language',
      enum: LanguageCodes,
      default: 'fa',
    },

    ASM_PUBLIC_APP_SUPPORTED_LANGS: {
      type: 'string',
      description: 'Application default language',
      // @ts-ignore
      separator: ',',
      default: 'fa',
    },

    ASM_PUBLIC_APP_NS: {
      type: 'string',
      description: 'Application name space. **Do not change after deployment**',
      pattern: '[a-z][a-z\\-][a-z]',
      default: 'analytic-test',
    },

    ASM_PUBLIC_APP_READ_ONLY: {
      type: 'boolean',
      description:
        'Application is readonly mode for maintenance or other reasons',
      default: false,
    },

    ASM_PUBLIC_APP_TEST: {
      type: 'boolean',
      description: 'Application is in testing mode',
      default: false,
    },

    ASM_PUBLIC_BASE_URL: {
      type: 'string',
      description: 'Base URL of application. Example: `/` or `/base-path/`',
      default: '/',
    },

    ASM_PUBLIC_POST_UPLOADED_SIZE_BYTES: {
      type: 'number',
      description: 'Max size of uploaded file bytes in single request',
      default: 4194304,
    },

    ASM_FILE_DOWNLOADER_SOCKS_PROXY: {
      type: 'string',
      description: 'File downloader using socks for security reason',
      default: '',
    },

    ASM_AUTH_COOKIE: {
      type: 'string',
      description: 'Authentication cookie name',
      default: TEST_MODE ? 'AuthToken' : '__Host-AuthToken',
    },

    ASM_AUTH_HMAC_ALG: {
      type: 'string',
      description: 'Application authentication HMAC algorithm',
      default: 'HS256',
      enum: ['HS256', 'HS384', 'HS512'],
    },

    ASM_AUTH_HMAC_SECRET: {
      type: 'string',
      description: 'Application authentication HMAC secret',
      default: TEST_MODE ? '0123456789ABCDEFGHIJKLMNOPQRSTUV' : '',
      minLength: 32,
      maxLength: 512,
    },

    ASM_AUTH_USER_API_KEY: {
      type: 'string',
      description: 'Header that carry the stored user token.',
      default: 'x-user-api-key',
    },

    ASM_APP_PORT: {
      type: 'number',
      description: 'Application HTTP port',
      default: 3001,
      minimum: 1025,
      maximum: 49151,
    },

    ASM_LOG_LEVEL: {
      type: 'number',
      description: 'Log level of application',
      enum: [1, 2, 3, 4, 5],
      default: TEST_MODE ? 2 : 4,
      minimum: 1,
      maximum: 5,
    },

    ASM_LOG_STDOUT_FILTER: {
      type: 'string',
      // @ts-ignore
      separator: ',',
      default: 'def,http,pg',
    },

    ASM_APP_INSTANCE: {
      type: 'number',
      description: 'Application cluster number',
      default: 2,
      minimum: 1,
      maximum: 16,
    },

    ASM_SMTP_URI: {
      type: 'string',
      description: 'Connection URI for SMTP',
      default: 'smtp://username:password@analytic-mail:1025/?pool=true',
    },

    ASM_SMTP_SEND_INTERVAL_SECONDS: {
      type: 'number',
      description:
        'Send email using SMTP interval seconds for prevent spamming',
      default: 30,
    },

    ASM_REDIS_URI: {
      type: 'string',
      description: 'Connection URI for Redis for share data purpose',
      default: 'redis://analytic-redis',
    },

    ASM_POSTGRES_URI: {
      type: 'string',
      description: 'Connection URI for Postgres',
      default: 'postgres://pg-user:pg-password@analytic-postgres:5432/pg-db',
    },
  },
};

module.exports = { ConfigSchema };
