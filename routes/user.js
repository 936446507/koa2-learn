const router = require('koa-router')()
const User = require('../db/User');

const user = new User();

router.prefix('/user')

router.post('/login', async (ctx, next) => {
  const { name, password } = ctx.request.body;
  const data = await user.login({ name, password });
  Object.assign(ctx, data);
})

router.post('/register', async (ctx, next) => {
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