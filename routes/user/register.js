const router = require('koa-router')();
const User = require(__rootpath + '/db/User');
const config = require(__rootpath +  '/public/javascripts/config');
// const Validator = require('../public/javascripts/Validator');

const user = new User();

router.prefix('/user');

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