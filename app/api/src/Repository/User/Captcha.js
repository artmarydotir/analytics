const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class Captcha {
  constructor({ Config, Redis }) {
    this.Config = Config;
    this.Redis = Redis;
  }

  /**
   *
   * @param {*} lang
   * @returns {Promise<object>}
   */
  async generateCaptcha(lang = 'fa') {
    const url = this.Config.ASM_CAPTCHA_URI;
    const params = {
      lang,
      ttl: this.Config.ASM_CAPTCHA_TTL,
      level: this.Config.ASM_CAPTCHA_LEVEL,
    };
    const redis = await this.Redis.getRedis();

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (data) {
      await redis.set(
        `captcha:${data.id}`,
        data.value,
        'EX',
        this.Config.ASM_CAPTCHA_TTL,
      );
    }
    return {
      id: data.id,
      image: data.image,
    };
  }

  /**
   *
   * @param {*} id
   * @param {*} input
   * @returns {Promise<boolean>}
   */
  async solveCaptcha(id, input) {
    if (!input) {
      throw new ErrorWithProps(
        errorConstMerge.ISREQUIRE_FIELD,
        {
          statusCode: 400,
        },
        400,
      );
    }
    const redis = await this.Redis.getRedis();
    let isValidInput = false;

    const currentValue = await redis.get(`captcha:${id}`);
    await redis.del(`captcha:${id}`);
    if (currentValue && Number(currentValue) === Number(input)) {
      isValidInput = true;
    }

    return isValidInput;
  }
}

module.exports = Captcha;
