const router = require('koa-router')();
const { User } = require(__rootPath + '/handleModel');
const config = require(__rootPath + '/static/js/config');

router.prefix('/user');

router.get('/info.json', async (ctx, next) => {
  const { id } = ctx.session.user;

  const info = await User.findOne({
    where: { id },
    attributes: ['username']
  });

  if (info) {
    Object.assign(ctx, {
      error_code: config.SUCCESS,
      body: info
    });
  } else {
    Object.assign(ctx, {
      error_code: config.SQL_QUERY_ERROR,
      error_message: '查询错误'
    });
  }
});

module.exports = router;
