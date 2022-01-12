const SETTLE_STATUS = {
  UN_SETTLE: {
    code: 0,
    desc: '未结算'
  },
  PART_SETTLE: {
    code: 1,
    desc: '结算中'
  },
  SETTLED: {
    code: 3,
    desc: '已结算'
  },
  UN_REQUIRE: {
    code: 6,
    desc: '无需结算'
  }
}

export default SETTLE_STATUS
