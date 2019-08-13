const Sequelize = require('sequelize');
const sequelize = require('./connect');

const defineModel = function(name, attributes) {
  const attrs = {};
  for (let key in attributes) {
    const value = attributes[key];
    if (typeof value === 'object' && value['type']) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        // allowNull: false
      };
    }
  }
  // attrs.version = {
  //   type: Sequelize.BIGINT,
  //   // allowNull: false
  // };
  // attrs.createUser = {
  //   type: Sequelize.STRING,
  //   allowNull: false
  // };
  // attrs.updateUser = {
  //   type: Sequelize.STRING,
  //   allowNull: false
  // };
  if (!sequelize.isDefined(name)) {
    return sequelize.define(name, attributes, {
      tableName: name,
      timestamps: false,
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      hooks: {
        // beforeBulkCreate: function(obj) {
        //   obj.version = 0;
        // },
        // beforeValidate: function(obj) {
        //   if (obj.isNewRecord) {
        //     obj.version = 0;
        //   } else {
        //     obj.version = obj.version + 1;
        //   }
        // }
      }
    });
  }

};

module.exports = defineModel;