const router = require('koa-router')()
const config = require('../public/js/config');

router.all('*', async (ctx, next) => {
  ctx.error_code = config.REQUEST_ERROR;
  ctx.error_message = '请求方式或路径错误'
})

module.exports = router;