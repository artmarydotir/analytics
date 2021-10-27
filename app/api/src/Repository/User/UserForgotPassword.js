const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const { ErrorWithProps } = require('mercurius').default;
const { constants: UserOption } = require('../../Schema/UserOption');
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class UserForgotPassword {
  constructor({ sequelize, Config, Redis }) {
    this.Redis = Redis;
    this.Config = Config;
    this.sequelize = sequelize;
  }

  async sendForgotPasswordCode(email) {
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

    let success = false;

    if (user) {
      const { id } = user.dataValues;
      const token = Math.floor(1000 + Math.random() * 9000);
      const redis = await this.Redis.getRedis();
      await redis.set(`forget_password:${token}`, id, 'EX', 300);
      const messageOption = {
        from: `${sender}`,
        to: `${email}`,
        subject: 'Forget password code',
        text: `Your code is: ${token}`,
        html: `<p>Your code is: <code>${token}</code></p>`,
      };

      return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport(`${smtpUri}`);
        transport.sendMail(messageOption, (err) => {
          if (err) {
            success = false;
            transport.close();
            reject(
              new ErrorWithProps(errorConstMerge.SMTP_ERROR, {
                statusCode: 500,
              }),
            );
          } else {
            success = true;
            resolve(true);
            transport.close();
          }
        });
      });
    }
    return success;
  }
}

module.exports = UserForgotPassword;
