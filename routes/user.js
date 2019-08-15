const router = require('koa-router')()
const User = require('../db/User');
const config = require('../config');

const user = new User({});

router.prefix('/user')

router.get('/login', async (ctx, next) => {
  const { name, password } = ctx.request.body;
  const data = await user.login({ name, password });
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

router.get('/register', async (ctx, next) => {
  const {
    name,
    password,
    email,
    gender
  } = ctx.request.body;
  const data = await user.register({
    name,
    password,
    email,
    gender
  })

  Object.assign(ctx, data);
})

module.exports = router