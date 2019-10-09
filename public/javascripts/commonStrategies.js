const commonStrategies = {
  async isEmpty({value, error}) {
    if (!value) return error;
  }
}

module.exports = commonStrategies;