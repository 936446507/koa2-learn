const model = require('../handleModel');
const config = require('../public/javascripts/config');
const bcrypt = require('../public/javascripts/bcrypt');
const commonStrategies = require('../public/javascripts/commonStrategies');
const Validator = require('../public/javascripts/Validator');

const strategies = {
  ...commonStrategies,
  async isExistName(value, error) {
    if (!this.userData) {
      this.userData = await this.query({name: value});
    }

    if (!this.userData) return error;
  },
  async isCheckPassword(name, password, error) {
    if (!this.userData) {
      this.userData = await this.query({name});
    }
    const isCheckPassword = bcrypt.decrypt(password, this.userData.password);
    if (!isCheckPassword) return error;
  }
}
const getNameRules = ((self, value, password) => ({ self, value,
  rules: [
    {
      strategy: 'isEmpty',
      errorCode: config.EMPTY_ERROR,
      errorMessage: '用户名为空'
    },
    {
      strategy: 'isExistName',
      errorCode: config.NAME_NO_EXIST,
      errorMessage: '用户名不存在'
    },
    {
      strategy: `isCheckPassword:${password}`,
      errorCode: config.PASSWORD_ERROR,
      errorMessage: '密码错误'
    }
  ]
}))

const validator = new Validator(strategies);

class User {
  constructor() {
    this.userData = null;
  }
  async login(params = {}) {
    this.updateData(params);
    const { name, password } = params;
    const self = this;

    validator.batchAdd([ getNameRules(self, name, password) ]);

    const info = await validator.start();
    if (info) {
      return {
        error_code: info.errorCode,
        error_message: info.errorMessage
      }
    }

    return {
      error_code: config.SUCCESS,
      body: {
        name: this.userData.name
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
const user = new User()
user.login({ name: 'name3', password: 'password' });

module.exports = User;