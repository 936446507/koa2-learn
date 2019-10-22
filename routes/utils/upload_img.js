const router = require('koa-router')();
const path = require('path');
const Upload = require(__rootPath + '/static/js/upload');
const config = require(__rootPath + '/static/js/config');

router.prefix('/utils');

router.post('/upload_img', async (ctx, next) => {
  const { file_type: fileType = 'common' } = ctx.request.body;
  const serverFilePath = path.join(__rootPath, 'static/img');
  const upload = new Upload({
    fileType,
    path: serverFilePath
  });
  const result = await upload.uploadFile(ctx);

  Object.assign(ctx, result);
});

module.exports = router;
