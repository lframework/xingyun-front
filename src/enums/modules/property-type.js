/**
 * 属性类型
 * @type {{MAN: {code: number, desc: string}, MULTIPLE: {code: number, desc: string}, FEMALE: {code: number, desc: string}}}
 */
const PROPERTY_TYPE = {
  COMMON: {
    code: 1,
    desc: '通用属性'
  },
  APPOINT: {
    code: 2,
    desc: '指定类目属性'
  },
  NONE: {
    code: 3,
    desc: '无'
  }
}

export default PROPERTY_TYPE
