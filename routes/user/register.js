const router = require('koa-router')();
const User = require(__rootPath + '/db/User');
const config = require(__rootPath + '/public/js/config');
// const Validator = require('../public/js/Validator');

const user = new User();

router.prefix('/user');

router.post('/register', async (ctx, next) => {
  const {
    username,
    password,
    confirm_password: confirmPassword
  } = ctx.request.body;
  const data = await user.register({
    username,
    password,
    confirmPassword
  })

  Object.assign(ctx, data);
})

module.exports = router