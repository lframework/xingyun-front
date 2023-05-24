/**
 * 单据时间轴业务类型
 * @type {{APPROVE_RETURN: {code: number, desc: string}, CREATE: {code: number, desc: string}, CANCEL_APPROVE: {code: number, desc: string}, APPROVE_PASS: {code: number, desc: string}, UPDATE: {code: number, desc: string}, NORMAL: {code: number, desc: string}, SEND: {code: number, desc: string}}}
 */
const ORDER_TIME_LINE_biZ_TYPE = {
  NORMAL: {
    code: 0,
    desc: '普通操作'
  },
  CREATE: {
    code: 1,
    desc: '保存'
  },
  UPDATE: {
    code: 2,
    desc: '修改'
  },
  SEND: {
    code: 3,
    desc: '发送'
  },
  APPROVE_PASS: {
    code: 4,
    desc: '审核通过'
  },
  APPROVE_RETURN: {
    code: 5,
    desc: '审核拒绝'
  },
  CANCEL_APPROVE: {
    code: 6,
    desc: '取消审核'
  },
  RECEIVE: {
    code: 7,
    desc: '收货'
  }
}

export default ORDER_TIME_LINE_biZ_TYPE
