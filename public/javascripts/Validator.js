const config = require('./config');

class Validator {
  constructor(strategies) {
    this.strategies = strategies;
    this.cache = [];
  }
  add({self, value, rules}) {
    for (let rule of rules) {
      const strategyArr = rule.strategy.split(':');
      const errorCode = rule.errorCode;
      const errorMessage = rule.errorMessage;
      this.cache.push(() => {
        const strategy = strategyArr.shift();
        strategyArr.unshift(value);
        strategyArr.push({errorCode, errorMessage});
        console.log(value, this.strategies[strategy], this.strategies[strategy].apply)
        return this.strategies[strategy].apply(self, strategyArr)
      })
    }
  }
  start() {
    for (let validatorFunc of this.cache) {
      const info = validatorFunc();

      if (info && info.errorCode !== config.SUCCESS) {
        return info;
      }
    }
  }
  batchAdd(strategies) {
    for (let strategy of strategies) {
      this.add(strategy);
    }
  }
}

module.exports = Validator;