const router = require('koa-router')()
const {
  Pet
} = require('../hanleModel')

router.get('/', async (ctx, next) => {
  const {
    request
  } = ctx
  ctx.error_code = 0;
  ctx.body = {
    query: request.query,
    querystring: request.querystring
  };
})

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
    ...request.body
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

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router