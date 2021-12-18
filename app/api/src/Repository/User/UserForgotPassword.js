const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { ErrorWithProps } = require('mercurius').default;
const { constants: UserOption } = require('../../Schema/UserOption');
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

// For GraphQL Interface
class UserForgotPassword {
  constructor({ sequelize, Config, Redis }) {
    this.Redis = Redis;
    this.Config = Config;
    this.sequelize = sequelize;
  }

  async sendForgotPasswordCode(email) {
    if (!email) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const smtpUri = this.Config.ASM_SMTP_URI;
    const sender = this.Config.ASM_SMTP_SENDER;

    const { User } = this.sequelize.models;

    const user = await User.findOne({
      where: {
        email,
        [Op.not]: {
          options: {
            [Op.contains]: [UserOption.DELETED],
          },
        },
        options: { [Op.contains]: [UserOption.ACTIVE] },
      },
    });

    let success = '0';
    const hashToken = crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/[^a-z0-9]/gi, '')
      .substr(0, 16);

    if (user) {
      const { id } = user.dataValues;

      const redis = await this.Redis.getRedis();
      await redis.set(`forget_password:${hashToken}`, id, 'EX', 300);
      const messageOption = {
        from: `${sender}`,
        to: `${email}`,
        subject: 'Forget password code',
        text: `Your code is: ${hashToken}`,
        html: `<p>Your code is: <code>${hashToken}</code></p>`,
      };

      return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport(`${smtpUri}`);
        transport.sendMail(messageOption, (err) => {
          if (err) {
            success = '0';
            transport.close();
            reject(
              new ErrorWithProps(errorConstMerge.SMTP_ERROR, {
                statusCode: 500,
              }),
            );
          } else {
            success = '1';
            resolve(this.Config.ASM_PUBLIC_APP_TEST ? hashToken : success);
            transport.close();
          }
        });
      });
    }
    return success;
  }
}

module.exports = UserForgotPassword;
