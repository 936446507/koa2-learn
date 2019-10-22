var Sequelize = require('sequelize');
const defineModel = require('../db/defineModel');

const Bill = defineModel('bill', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  uid: {
    type: Sequelize.BIGINT(11),
    allowNull: false
  },
  // 0: 支出 1：收入
  type: {
    type: Sequelize.BIGINT(11),
    allowNull: false
  },
  // 账单子类别
  sub_type: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  money: {
    type: Sequelize.BIGINT(11),
    allowNull: false
  },
  bill_at: {
    type: Sequelize.BIGINT(11),
    allowNull: false,
    default: Date.now()
  },
  remark: {
    type: Sequelize.STRING(100),
    allowNull: false
  }
});

module.exports = Bill;
