const router = require('koa-router')();
const config = require(__rootPath +  '/public/javascripts/config');

router.prefix('/user');

router.post('/exit', async (ctx, next) => {
  ctx.session.user = {};
  Object.assign(ctx, {
    error_code: config.SUCCESS
  })
})

module.exports = router;