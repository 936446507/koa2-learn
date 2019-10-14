const fs = require('fs');
const router = require('koa-router')();
const marked = require('marked');

const apiDocRoutes = [];
const fileSuffix = '.md';
const handleFolderPath = '/routes/';

// 获取文件夹列表
function getDirectoryList(path) {
  return fs.readdirSync(path).filter(file => fs.statSync(`${path}/${file}`).isDirectory());
};
function getMdFilesName(path) {
  return fs.readdirSync(path).filter(file => file.endsWith(fileSuffix))
}

function getMdFiles(path, files = []) {
  const directoryList = [...getDirectoryList(__rootPath + path)];
  files.push(...getMdFilesName(__rootPath + path).map(file => path + file));

  for (let dir of directoryList) {
    getMdFiles(`${path}${dir}/`, files)
  }

  return files;
}

function setApiDocRoutes() {
  const fileList = getMdFiles(handleFolderPath);

  while(fileList.length) {
    const file = fileList.shift();
    const url = file.replace(handleFolderPath, '/').replace('.md', '.doc');

    const route = router.get(url, async ctx => {
      const css = fs.readFileSync(__rootPath + '/public/stylesheets/api-doc.css', 'utf-8');
      const data = fs.readFileSync(__rootPath + file, 'utf-8');

      ctx.type = 'text/html;charset=utf-8';
          ctx.body = `
          <html>
            <head><style>${css}</style></head>
            <body>${marked(data)}</body>
          </html>
          `
    })
    apiDocRoutes.push([route.routes(), route.allowedMethods()]);
  }
}
setApiDocRoutes();

module.exports = apiDocRoutes;