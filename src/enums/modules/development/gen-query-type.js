const GEN_QUERY_TYPE = {
  EQ: {
    code: 0,
    desc: '='
  },
  GT: {
    code: 1,
    desc: '>'
  },
  GE: {
    code: 2,
    desc: '>='
  },
  LT: {
    code: 3,
    desc: '<'
  },
  LE: {
    code: 4,
    desc: '<='
  },
  NE: {
    code: 5,
    desc: '!='
  },
  IN: {
    code: 6,
    desc: 'IN'
  },
  NOT_IN: {
    code: 7,
    desc: 'NOT IN'
  },
  LEFT_LIKE: {
    code: 8,
    desc: 'LIKE %?'
  },
  RIGHT_LIKE: {
    code: 9,
    desc: 'LIKE ?%'
  },
  AROUND_LIKE: {
    code: 10,
    desc: 'LIKE %?%'
  }
}

export default GEN_QUERY_TYPE
