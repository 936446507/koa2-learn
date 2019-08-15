const model = require('../handleModel');
const config = require('../config');
const bcrypt = require('../bcrypt');

class User {
  constructor() {}
  async login(params = {}) {
    this.updateData(params);
    const { name, password } = params;
    const data = await this.query({name});

    if (!data) {
      return {
        error_code: config.NAME_NO_EXIST,
        error_message: '用户名不存在'
      }
    }
    const isCheckPassword = bcrypt.decrypt(params.password, data.password);
    if (!isCheckPassword) {
      return {
        error_code: config.PASSWORD_ERROR,
        error_message: '密码错误'
      }
    }
    return {
      error_code: config.SUCCESS,
      body: {
        name: data.dataValues.name
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