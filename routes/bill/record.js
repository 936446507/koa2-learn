const router = require('koa-router')();
const Bill = require(__rootPath + '/static/js/Bill');
const config = require(__rootPath + '/static/js/config');
const bill = new Bill();

router.prefix('/bill');

// 获取单条账单详情
router.get('/record.json', async (ctx, next) => {
  const { id } = ctx.request.body;
  const record = await bill.query(id);
  if (record) {
    Object.assign(ctx, {
      error_code: config.SUCCESS,
      body: record
    });
  } else {
    Object.assign(ctx, {
      error_code: config.SQL_QUERY_ERROR,
      error_message: '账单id错误'
    });
  }
});

// 记账
router.post('/record.json', async (ctx, next) => {
  const {
    type,
    sub_type: subType,
    money,
    bill_at: billAt,
    remark
  } = ctx.request.body;
  const { id: uid } = ctx.session.user;

  const info = await bill.add({
    uid,
    type,
    subType,
    money,
    billAt,
    remark
  });
  if (info) {
    Object.assign(ctx, {
      error_code: config.SUCCESS,
      body: {}
    });
  } else {
    Object.assign(ctx, {
      error_code: config.SQL_UPDATE_ERROR,
      error_message: '记账失败'
    });
  }
});

// 更新账单字段
router.put('/record.json', async (ctx, next) => {
  const {
    id: recordId,
    type,
    sub_type: subType,
    money,
    bill_at: billAt,
    remark
  } = ctx.request.body;

  const record = await bill.update({
    recordId,
    type,
    subType,
    money,
    billAt,
    remark
  });

  if (record) {
    Object.assign(ctx, {
      error_code: config.SUCCESS,
      body: {}
    });
  } else {
    Object.assign(ctx, {
      error_code: config.SQL_QUERY_ERROR,
      error_message: '更新账单信息错误'
    });
  }
});

// 删除单条账单记录
router.delete('/record.json', async (ctx, next) => {
  const { id: recordId } = ctx.request.body;
  const record = await bill.delete(recordId);
  if (record) {
    Object.assign(ctx, {
      error_code: config.SUCCESS,
      body: {}
    });
  } else {
    Object.assign(ctx, {
      error_code: config.SQL_QUERY_ERROR,
      error_message: '删除账单错误'
    });
  }
});

module.exports = router;
