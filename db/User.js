const model = require(__rootpath + '/handleModel');
const config = require(__rootpath + '/public/javascripts/config');
const bcrypt = require(__rootpath + '/public/javascripts/bcrypt');
const commonStrategies = require(__rootpath + '/public/javascripts/commonStrategies');
const Validator = require(__rootpath + '/public/javascripts/Validator');
// 校验策略
const strategies = {
  ...commonStrategies,
  /*
   * checkType: exist,检查类型为存在用户名，存在则不返回错误
   */
  async isExistName({
    username,
    checkType = 'exist',
    error
  }) {
    this.userData = await this.query({
      username
    });
    if (checkType === 'exist' && !this.userData) return error;
    if (checkType !== 'exist' && this.userData) return error;
  },

  async isCheckPassword({
    username,
    password,
    error
  }) {
    this.userData = await this.query({
      username
    });
    const isCheckPassword = bcrypt.decrypt(password, this.userData.password);
    if (!isCheckPassword) return error;
  },

  async isQualifiedPassword({ password, error }) {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if (!reg.test(password)) return error;
  },

  async isCommonPassword({ password, confirmPassword, error }) {
    if (password !== confirmPassword) return error;
  }
};
// 登录规则
const loginRules = (self, username, password) => ({
  self,
  rules: [{
      strategy: 'isEmpty',
      value: username,
      errorCode: config.EMPTY_ERROR,
      errorMessage: '用户名为空'
    },
    {
      strategy: 'isExistName',
      username,
      errorCode: config.NAME_NO_EXIST,
      errorMessage: '用户名不存在'
    },
    {
      strategy: 'isCheckPassword',
      username,
      password,
      errorCode: config.PASSWORD_ERROR,
      errorMessage: '密码错误'
    }
  ]
});
// 注册规则
const registerRules = (self, username, password, confirmPassword) => ({
  self,
  rules: [{
      strategy: 'isExistName',
      username,
      checkType: 'noExist',
      errorCode: config.NAME_REGISTERED,
      errorMessage: '用户名已注册'
    },
    {
      strategy: 'isQualifiedPassword',
      password,
      errorCode: config.PASSWORD_ERROR,
      errorMessage: '密码格式不符合'
    },
    {
      strategy: 'isCommonPassword',
      password,
      confirmPassword,
      errorCode: config.PASSWORD_ERROR,
      errorMessage: '密码不一致'
    }
  ]
})

const validator = new Validator(strategies);

class User {
  constructor() {
    // 存储数据库查询数据
    this.userData = null;
  }
  async login(params = {}) {
    const {
      username,
      password
    } = params;
    const self = this;
    validator.add(loginRules(self, username, password));

    const info = await validator.start();

    if (info) {
      return {
        error_code: info.errorCode,
        error_message: info.errorMessage
      };
    }

    return {
      error_code: config.SUCCESS,
      body: {
        username: this.userData.username
      }
    };
  }

  async register(params = {}) {
    const {
      username,
      password,
      confirmPassword
    } = params;
    const self = this;

    validator.add(registerRules(self, username, password, confirmPassword));
    const info = await validator.start();

    if (info) {
      return {
        error_code: info.errorCode,
        error_message: info.errorMessage
      };
    }
    params.password = bcrypt.encrypt(params.password)
    const userData = await this.create(params);
    return {
      error_code: config.SUCCESS,
      body: {
        username: userData.username
      }
    };
  }

  query(queryCondition) {
    return model.User.findOne({
      where: queryCondition
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