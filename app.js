const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa2-cors');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');

// 项目根路径
const process = require('process');
const rootPath = process.cwd();
!global.__rootPath && (global.__rootPath = rootPath);

const { config } = require('./db/connect');
const responseFormat = require('./middlewares/responseFormat');
const interceptors = require('./middlewares/interceptors');
const routes = require('./handleRoutes');
const apiDocs = require('./handleApiDocRoutes');

// 处理跨域的配置
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

// session
const sessionMysqlConfig = {
  user: config.username,
  password: config.password,
  database: config.database,
  host: config.host,
}
app.use(session({
  key: 'USER_SID',
  cookie: {
    domain: 'localhost',
    path: '/',
    maxAge: 1000 * 24 * 60 * 60,
    httpOnly: true,
    overwrite: false
  },
  store: new MysqlStore(sessionMysqlConfig)
}))


// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});
apiDocs.forEach(apiDoc => {
  app.use(...apiDoc);
})
// app.use(apiDocs.routes(), apiDocs.allowedMethods());

app.use(responseFormat);
app.use(interceptors);
// routes
routes.forEach(route => {
  app.use(...route)
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;