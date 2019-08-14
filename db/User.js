const model = require('../hanleModel');
const config = require('../config');

class User {
  constructor() {}
  async login(params = {}) {
    this.updateData(params);
    const { name, password } = params;
    const queryNameData = await this.query({name});

    if (!queryNameData) {
      return {
        error_code: config.NAME_NO_EXIST,
        error_message: '用户名不存在'
      }
    }
    const queryLoginData = await this.query({ name, password })
    if (!queryLoginData) {
      return {
        error_code: config.PASSWORD_ERROR,
        error_message: '密码错误'
      }
    }

    return {
      error_code: 0,
      body: queryLoginData
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

    const userData = await this.create(params);
    return {
      error_code: 0,
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