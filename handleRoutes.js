const fs = require('fs');

const fileSuffix = '.js';
const curFolderUrl = __dirname + '/routes/';
const filterFile = 'all.js';

const files = fs.readdirSync(curFolderUrl);
const jsFiles = files.filter(file => file.endsWith(fileSuffix) && !file.includes(filterFile));
jsFiles.push(filterFile);

const routes = jsFiles.map(file => {
  const route = require(curFolderUrl + file);
  return [route.routes(), route.allowedMethods()];
})

module.exports = routes;