/**
 * 字段类型
 * @type {{MAN: {code: number, desc: string}, MULTIPLE: {code: number, desc: string}, FEMALE: {code: number, desc: string}}}
 */
const COLUMN_TYPE = {
  MULTIPLE: {
    code: 1,
    desc: '多选'
  },
  SINGLE: {
    code: 2,
    desc: '单选'
  },
  CUSTOM: {
    code: 3,
    desc: '手动录入'
  }
}

export default COLUMN_TYPE
