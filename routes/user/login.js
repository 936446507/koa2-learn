const router = require('koa-router')();
const User = require(__rootPath + '/static/js/User');
const config = require(__rootPath + '/static/js/config');

const user = new User();

router.prefix('/user');

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body;

  const data = await user.login({ username, password });
  const session = ctx.session;

  if (data.error_code === config.SUCCESS) {
    const { id, username } = data.body;
    session.user = { id, username };

    Object.assign(ctx, {
      error_code: data.error_code,
      body: { username }
    });
  } else {
    Object.assign(ctx, data);
  }
});

module.exports = router;
