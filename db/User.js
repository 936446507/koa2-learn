const model = require('../handleModel');
const config = require('../public/javascripts/config');
const bcrypt = require('../public/javascripts/bcrypt');
const commonStrategies = require('../public/javascripts/commonStrategies');
const Validator = require('../public/javascripts/Validator');

const strategies = {
  ...commonStrategies,
   async isExistName(value, error) {
    const data = await this.query({name: value});
    if (!data) {
      return error
    }
  }
}
const getNameRules = ((self, value) => ({ self, value,
  rules: [
    {
      strategy: 'isEmpty',
      errorCode: 1002,
      erroMessage: '用户名为空'
    },
    {
      strategy: 'isExistName',
      errorCode: config.NAME_NO_EXIST,
      erroMessage: '用户名不存在'
    }
  ]
}))

const validator = new Validator(strategies);

class User {
  constructor() {}
  async login(params = {}) {
    this.updateData(params);
    const { name, password } = params;
    const self = this;
    const rules = [
      getNameRules(self, name)
    ]
    validator.batchAdd(rules);

    const info = validator.start();
    // console.log(info);
    const data = await this.query({name});

    if (!data) {
      return {
        error_code: config.NAME_NO_EXIST,
        error_message: '用户名不存在'
      }
    }
    const isCheckPassword = bcrypt.decrypt(password, data.password);
    if (!isCheckPassword) {
      return {
        error_code: config.PASSWORD_ERROR,
        error_message: '密码错误'
      }
    }
    return {
      error_code: config.SUCCESS,
      body: {
        name: data.dataValues.name,
        rules
      }
    };
  }

  async register(params = {}) {
    this.updateData(params);
    const { name } = params;
    const data = await this.query({name});
    if (data) {
      return {
        error_code: config.NAME_REGISTERED,
        error_message: '用户名已注册'
      }
    }
    params.password = bcrypt.encrypt(params.password)
    const userData = await this.create(params);
    return {
      error_code: config.SUCCESS,
      body: userData
    };
  }

  query(queryContion) {
    return model.User.findOne({
      where: queryContion
    })
  }
  create(params) {
    return model.User.create(params);
  }
  updateData(params) {
    Object.assign(this, params);
  }
}

module.exports = User;