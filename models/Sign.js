var Sequelize = require('sequelize');
const defineModel = require('../db/defineModel');

const Sign = defineModel('sign', {
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
  sign_at: {
    type: Sequelize.BIGINT(11)
  }
});

module.exports = Sign;
