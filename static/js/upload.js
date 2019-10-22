const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const config = require(__rootPath + '/static/js/config');

class Upload {
  constructor(options = {}) {
    this._options = options;
  }
  mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
  getSuffixName(fileName) {
    const nameList = fileName.split('.');
    return nameList[nameList.length - 1];
  }
  uploadFile(ctx, upLoadOptions) {
    const options = upLoadOptions || this._options;
    const req = ctx.req;
    const busboy = new Busboy({ headers: req.headers });

    // 获取类型
    const fileType = options.fileType || 'common';
    const filePath = path.join(options.path, fileType);
    this.mkdirsSync(filePath);

    return new Promise((resolve, reject) => {
      const result = {};

      // 解析请求文件事件
      busboy.on('file', (fieldname, file, filename) => {
        const fileSuffix = this.getSuffixName(filename);
        const fileName = `${Date.now().toString(16)}.${fileSuffix}`;

        const _uploadFilePath = path.join(filePath, fileName);
        const saveTo = path.join(_uploadFilePath);

        // 文件保存到制定路径
        file.pipe(fs.createWriteStream(saveTo));

        // 文件写入事件结束
        file.on('end', () => {
          result.error_code = config.SUCCESS;
          result.body = {
            url: `//${ctx.host}/img/${fileType}/${fileName}`
          };

          resolve(result);
        });
      });

      // 解析结束事件
      // busboy.on('finish', () => resolve(result));

      // 解析错误事件
      busboy.on('error', err =>
        reject({
          error_code: config.REQUEST_ERROR,
          error_message: '上传失败',
          data: err
        })
      );

      req.pipe(busboy);
    });
  }
}
/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName(fileName) {
  const nameList = fileName.split('.');
  return nameList[nameList.length - 1];
}

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}
 */
function uploadFile(ctx, options) {
  const req = ctx.req;
  const busboy = new Busboy({ headers: req.headers });

  // 获取类型
  const fileType = options.fileType || 'common';
  const filePath = path.join(options.path, fileType);
  mkdirsSync(filePath);

  return new Promise((resolve, reject) => {
    const result = {
      success: false,
      message: '',
      data: null
    };

    // 解析请求文件事件
    busboy.on('file', (fieldname, file, filename) => {
      const fileSuffix = getSuffixName(filename);
      const fileName = `${Date.now().toString(16)}.${fileSuffix}`;

      const _uploadFilePath = path.join(filePath, fileName);
      const saveTo = path.join(_uploadFilePath);

      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(saveTo));

      // 文件写入事件结束
      file.on('end', () => {
        result.success = true;
        result.message = '文件上传成功';
        result.data = {
          pictureUrl: `//${ctx.host}/img/${fileType}/${fileName}`
        };

        resolve(result);
      });
    });

    // 解析结束事件
    busboy.on('finish', () => resolve(result));

    // 解析错误事件
    busboy.on('error', err => reject(err));

    req.pipe(busboy);
  });
}

module.exports = Upload;
