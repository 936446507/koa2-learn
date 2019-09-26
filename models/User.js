var Sequelize = require('sequelize');
const defineModel = require('../db/defineModel');

const Pet = defineModel('user', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  username: Sequelize.STRING(100),
  email: Sequelize.STRING(100),
  password: Sequelize.STRING(100),
  gender: Sequelize.BOOLEAN
})
module.exports = Pet;