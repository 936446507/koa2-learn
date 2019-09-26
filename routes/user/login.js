const process = require('process');
const router = require('koa-router')();
const User = require(__rootpath + '/db/User');
const config = require(__rootpath +  '/public/javascripts/config');

const user = new User();

router.prefix('/user');

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const data = await user.login({ username, password });
  const session = ctx.session;

  if (data.error_code === config.SUCCESS) {
    const info = data.body
    session.user = {
      id: info.id,
      name: info.name,
      is_login: true
    }
  }
  Object.assign(ctx, data);
})

module.exports = router;