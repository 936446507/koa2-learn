const fs = require('fs');
const router = require('koa-router')();
const marked = require('marked');

const apiDocRoutes = [];
const fileSuffix = '.md';
const handleFolderUrl = __rootpath + '/routes/';
const dir = getDirectoryList(handleFolderUrl);
// 获取文件夹列表
function getDirectoryList(path) {
  return fs.readdirSync(path).filter(file => fs.statSync(`${path}/${file}`).isDirectory());
};
function getMdFilesName(path) {
  return fs.readdirSync(path).filter(file => file.endsWith(fileSuffix))
}

function setApiDocRoutes(dir, parentPath = '') {
  while(dir.length) {
    const directoryName = dir.shift();
    const directoryPath = `${handleFolderUrl}${parentPath}${directoryName}`;
    const subDirectoryList = getDirectoryList(directoryPath);
    if (!subDirectoryList.length) {
      const apiDocs = getMdFilesName(directoryPath);

      for (let name of apiDocs) {
        const url = `${parentPath}/${directoryName}/${name.replace('.md', '')}.doc`;
        const route = router.get(url, async (ctx, next) => {
          const css = fs.readFileSync(__rootpath + '/public/stylesheets/api-doc.css', 'utf-8')
          const data = fs.readFileSync(`${handleFolderUrl}${parentPath}/${directoryName}/${name}`, 'utf8');

          ctx.type = 'text/html;charset=utf-8';
          ctx.body = `
          <html>
            <head><style>${css}</style></head>
            <body>${marked(data)}</body>
          </html>
          `
        });
        apiDocRoutes.push([route.routes(), route.allowedMethods()]);
      }
    } else {
      setApiDocRoutes(subDirectoryList, `${parentPath}/${directoryName}`)
    }
  }
}

setApiDocRoutes(dir);

// router.prefix('/user');
// router.get('/exit.doc', async (ctx, next) => {
//   ctx.type = 'text/html;charset=utf-8';
//   ctx.body = '<html><body>123</body></html>'
// })

module.exports = apiDocRoutes;