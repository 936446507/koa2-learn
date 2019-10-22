var Sequelize = require('sequelize');
const defineModel = require('../db/defineModel');

const User = defineModel('user', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  username: Sequelize.STRING(100),
  email: Sequelize.STRING(100),
  password: Sequelize.STRING(100),
  gender: Sequelize.BOOLEAN,
  // 连续签到次数
  cnt_sign: {
    type: Sequelize.BIGINT(11),
    defaultValue: 0
  }
});

module.exports = User;