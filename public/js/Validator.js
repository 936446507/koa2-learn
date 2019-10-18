const config = require('./config');

class Validator {
  constructor(strategies) {
    this.strategies = strategies;
    this.cache = [];
  }
  add({ self, rules }) {

    rules.forEach((rule, index) => {
      const {
        strategy,
        errorCode,
        errorMessage
      } = rule;
      this.cache[index] = () => {
        const params = {
          ...this.getParams(rule, ['strategy', 'errorCode', 'errorMessage']),
          error: { errorCode, errorMessage }
        }
        return this.strategies[strategy].call(self, params);
      }
    });
  }
  getParams(params = {}, excludeParams = []) {
    const obj = {};
    for (let key in params) {
      if (!excludeParams.includes(key)) {
        obj[key] = params[key];
      }
    }

    return obj;
  }
  start() {
    return new Promise(async (resolve, reject) => {
      for (let validatorFunc of this.cache) {
        const info = await validatorFunc();
        if (info && info.errorCode !== config.SUCCESS) {
          resolve(info);
        }
      }
      resolve();
    })
  }
  batchAdd(strategies) {
    for (let strategy of strategies) {
      this.add(strategy);
    }
  }
}

module.exports = Validator;