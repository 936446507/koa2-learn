const fs = require('fs');
const { sequelize } = require('./db/connect');

const fileSuffix = '.js';
const files = fs.readdirSync(__dirname + '/models');
const jsFiles = files.filter(file => file.endsWith(fileSuffix));

for (let file of jsFiles) {
  module.exports[file.replace(fileSuffix, '')] = require(__dirname + '/models/' + file);
}

sequelize.sync();