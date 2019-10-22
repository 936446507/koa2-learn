const router = require('koa-router')();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User, Sign } = require(__rootPath + '/handleModel');
const DateUtils = require(__rootPath + '/static/js/DateUtils');
const config = require(__rootPath + '/static/js/config');

router.prefix('/user');

router.post('/sign.json', async (ctx, next) => {
  const { id, username } = ctx.session.user;
  const now = Date.now();
  const oneDayTime = 24 * 60 * 60 * 1000;
  const todayRangeTime = new DateUtils(now).getDayRangeTime();

  const signRecord = await Sign.findAll({
    where: {
      uid: id,
      sign_at: {
        [Op.gte]: todayRangeTime.start - oneDayTime,
        [Op.lt]: todayRangeTime.end
      }
    },
    attributes: [['sign_at', 'signAt']]
  });

  for (let record of signRecord) {
    const signAt = record.dataValues.signAt;

    if (signAt >= todayRangeTime.start) {
      Object.assign(ctx, {
        error_code: config.USER_OPERATION_ERROR,
        error_message: '今日已签到'
      });
      return false;
    }
    User.update(
      {
        cnt_sign:
          signAt >= todayRangeTime.start
            ? Sequelize.literal('`cnt_sign` + 1')
            : 1
      },
      { where: { id } }
    );
  }

  Sign.upsert({
    uid: id,
    username,
    sign_at: now
  });

  Object.assign(ctx, {
    error_code: config.SUCCESS,
    body: {}
  });
});

module.exports = router;
