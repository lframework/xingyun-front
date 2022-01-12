/**
 * 数据类型
 * @type {{DATE: {code: number, desc: string}, FLOAT: {code: number, desc: string}, STRING: {code: number, desc: string}, TIME: {code: number, desc: string}, DATE_TIME: {code: number, desc: string}, INT: {code: number, desc: string}}}
 */
const COLUMN_DATA_TYPE = {
  INT: {
    code: 1,
    desc: '整数型'
  },
  FLOAT: {
    code: 2,
    desc: '浮点型'
  },
  STRING: {
    code: 3,
    desc: '字符型'
  },
  DATE: {
    code: 4,
    desc: '日期型'
  },
  TIME: {
    code: 5,
    desc: '时间型'
  },
  DATE_TIME: {
    code: 6,
    desc: '日期时间型'
  }
}

export default COLUMN_DATA_TYPE
