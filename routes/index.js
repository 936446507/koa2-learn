const router = require('koa-router')()
const {
  Pet
} = require('../handleModel')

router.get('/create', async (ctx, next) => {
  const {
    request
  } = ctx;
  const data = await Pet.create({
    name: 'name',
    gender: 1,
    version: 0,
  })

  ctx.error_code = 0;
  ctx.body = {
    ...data.dataValues,
    ...request.body,
  }
})

router.get('/find', async (ctx, next) => {
  const data = await Pet.findAll({
    where: {},
    attributes: ['id', 'name']
  })

  ctx.error_code = 0;
  ctx.body = data;
})

module.exports = router