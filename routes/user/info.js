const router = require('koa-router')();
const { User } = require(__rootPath + '/handleModel');
const config = require(__rootPath +  '/public/javascripts/config');

router.prefix('/user');

router.get('/info', async (ctx, next) => {
  const { username } = ctx.session.user;
  const info = await User.findOne({
    where: { username },
    attributes: ['username']
  })

  if (info) {
    Object.assign(ctx, {
      error_code: config.SUCCESS,
      body: info
    })
  } else {
    Object.assign(ctx, {
      error_code: config.SQL_QUERY_ERROR,
      error_message: '查询错误'
    })
  }
})

module.exports = router;