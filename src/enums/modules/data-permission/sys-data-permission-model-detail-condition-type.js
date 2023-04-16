const SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE = {
  EQ: {
    code: 0,
    desc: '等于'
  },
  GT: {
    code: 1,
    desc: '大于'
  },
  GE: {
    code: 2,
    desc: '大于或等于'
  },
  LT: {
    code: 3,
    desc: '小于'
  },
  LE: {
    code: 4,
    desc: '小于或等于'
  },
  NE: {
    code: 5,
    desc: '不等于'
  },
  IN: {
    code: 6,
    desc: '在列表中'
  },
  NOT_IN: {
    code: 7,
    desc: '不在列表中'
  },
  LEFT_LIKE: {
    code: 8,
    desc: '结尾'
  },
  RIGHT_LIKE: {
    code: 9,
    desc: '开头'
  },
  AROUND_LIKE: {
    code: 10,
    desc: '包含'
  }
}

export default SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE
