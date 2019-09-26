const fs = require('fs');

const fileSuffix = '.js';
const curFolderUrl = __dirname + '/routes/';
const filterFile = 'all.js';
function getDirectoryList(path) {
  return fs.readdirSync(path).filter(file => fs.statSync(`${path}/${file}`).isDirectory());
};

const jsFiles =  [];
const dir = getDirectoryList(curFolderUrl);
for (let path of dir) {
  const files = fs.readdirSync(curFolderUrl + path);
  const filterFilesPath = files
    .filter(file => file.endsWith(fileSuffix))
    .map(file => `${path}/${file}`);
  jsFiles.push(...filterFilesPath);
}
jsFiles.push(filterFile);

const routes = jsFiles.map(file => {
  const route = require(curFolderUrl + file);
  return [route.routes(), route.allowedMethods()];
})

module.exports = routes;