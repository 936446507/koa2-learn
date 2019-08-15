const router = require('koa-router')()
const config = require('../config');

router.all('*', async (ctx, next) => {
  ctx.error_code = config.ERROR_REQUEST;
  ctx.error_message = '请求方式或路径错误'
})

module.exports = router;