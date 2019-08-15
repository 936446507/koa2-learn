const fs = require('fs');
const { sequelize } = require('./db/connect');

const fileSuffix = '.js';
const curFolderUrl = __dirname + '/models/'
const files = fs.readdirSync(curFolderUrl);
const jsFiles = files.filter(file => file.endsWith(fileSuffix));

for (let file of jsFiles) {
  module.exports[file.replace(fileSuffix, '')] = require(curFolderUrl + file);
}

sequelize.sync();