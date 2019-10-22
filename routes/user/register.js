const router = require('koa-router')();
const User = require(__rootPath + '/static/js/User');
const config = require(__rootPath + '/static/js/config');
// const Validator = require('../static/js/Validator');

const user = new User();

router.prefix('/user');

router.post('/register.json', async (ctx, next) => {
  const {
    username,
    password,
    confirm_password: confirmPassword
  } = ctx.request.body;
  const data = await user.register({
    username,
    password,
    confirmPassword
  });

  Object.assign(ctx, data);
});

module.exports = router;
