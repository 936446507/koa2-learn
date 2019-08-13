const Sequelize = require('sequelize');

const config =  {
  database: 'koa2', // 使用哪个数据库
  username: 'root', // 用户名
  password: '', // 口令
  host: 'localhost', // 主机名
  port: 3306 // 端口号，MySQL默认3306
};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql'
});

module.exports = sequelize;