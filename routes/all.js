const router = require('koa-router')();
const config = require('../static/js/config');

router.all('*', async (ctx, next) => {
  ctx.error_code = config.REQUEST_WAY_ERROR;
  ctx.error_message = '请求方式或路径错误';
});

module.exports = router;
