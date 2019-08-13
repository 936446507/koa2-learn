var Sequelize = require('sequelize');
const defineModel = require('../db/defineModel');

const Pet = defineModel('pet', {
  id: {
    type: Sequelize.STRING(50),
    primaryKey: true
  },
  name: Sequelize.STRING(100),
  gender: Sequelize.BOOLEAN
})
module.exports = Pet;