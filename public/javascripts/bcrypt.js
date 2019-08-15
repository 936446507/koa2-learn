const bcrypt = require('bcrypt');

exports.encrypt = password => {
  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}
exports.decrypt = (password, hash) => bcrypt.compareSync(password, hash);