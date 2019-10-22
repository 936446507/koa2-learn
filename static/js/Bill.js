const model = require(__rootPath + '/handleModel');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Bill {
  add({ uid, type, subType, money, billAt, remark }) {
    return model.Bill.create({
      uid,
      type,
      sub_type: subType,
      money,
      bill_at: billAt,
      remark
    });
  }

  update({ recordId, type, subType, money, billAt, remark }) {
    return model.Bill.update(
      {
        type,
        sub_type: subType,
        money,
        bill_at: billAt,
        remark
      },
      { where: { id: recordId } }
    );
  }

  delete(recordId) {
    return model.Bill.destroy({
      where: { id: recordId }
    });
  }

  query(recordId) {
    return model.Bill.findOne({
      where: { id: recordId },
      attributes: ['id', 'type', 'sub_type', 'money', 'bill_at', 'remark']
    });
  }

  queryList(uid, startTime = 0, endTime = Date.now()) {
    return model.Bill.findAll({
      where: {
        uid,
        bill_at: {
          [Op.gte]: startTime,
          [Op.lte]: endTime
        }
      },
      attributes: ['id', 'type', 'sub_type', 'money', 'bill_at', 'remark']
    });
  }
}

module.exports = Bill;
