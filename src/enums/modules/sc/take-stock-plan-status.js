const TAKE_STOCK_PLAN_STATUS = {
  CREATED: {
    code: 0,
    desc: '盘点任务生成'
  },
  DIFF_CREATED: {
    code: 6,
    desc: '盘点差异生成'
  },
  FINISHED: {
    code: 9,
    desc: '盘点完成'
  },
  CANCELED: {
    code: 12,
    desc: '盘点已作废'
  }
}

export default TAKE_STOCK_PLAN_STATUS
