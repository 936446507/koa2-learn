/**
 * 在app.use(router)之前调用
 */
const responseFormat = async (ctx, next) => {
  //先去执行路由
  await next();
  console.log(ctx.body, ctx.error_code)
  //如果有返回数据，将返回数据添加到data中
  const {error_code, error_message, body: data = {}} = ctx
  const body = {
    error_code
  };
  if (error_code === 0) {
    body.data = data;
  } else {
    data.error_message = error_message || 'error';
  }

  ctx.body = body;
}

module.exports = responseFormat;