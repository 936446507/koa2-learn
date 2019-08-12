const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.error_code = 0;
  ctx.body = {
    id: 1,
    message: ''
  }
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
