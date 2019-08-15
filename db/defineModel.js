const Sequelize = require('sequelize');
const { sequelize } = require('./connect');

const user = 'takashi';

const defineModel = function(name, attributes) {
  const defaultAttr = {
    version: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    create_user: {
      type: Sequelize.STRING,
      defaultValue: user
    },
    updated_user: {
      type: Sequelize.STRING,
      defaultValue: user
    },
    create_at: {
      type: Sequelize.BIGINT(11),
      defaultValue: Date.now()
    },
    updated_at: {
      type: Sequelize.BIGINT(11),
      defaultValue: Date.now()
    }
  }
  const attrs = Object.assign({}, defaultAttr, attributes);

  return sequelize.define(name, attrs, {
    timestamps: false,
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    hooks: {
      beforeBulkCreate(obj) {
        obj.version = 0;
      },
      beforeValidate(obj) {
        obj.version = obj.isNewRecord ? 0 : obj.version + 1;
      }
    }
  });

};

module.exports = defineModel;