const router = require('koa-router')();
const config = require(__rootPath + '/static/js/config');

router.prefix('/user');

router.post('/exit.json', async (ctx, next) => {
  ctx.session.user = {};
  Object.assign(ctx, {
    error_code: config.SUCCESS
  });
});

module.exports = router;
