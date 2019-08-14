const config = require('../config');

const allowApis = ['/user/login', '/user/register']

const interceptors = async (ctx, next) => {
  await next();
  const url = ctx.originalUrl;
  const isAllow = allowApis.some(api => url.includes(api));
  if (!isAllow) {
    ctx.error_code = config.NO_LOGIN;
    ctx.error_message = 'no login!';
  }
}

module.exports = interceptors;