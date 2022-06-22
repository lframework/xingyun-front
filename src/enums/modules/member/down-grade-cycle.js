/**
 * 会员降级周期
 * @type {{MONTH: {code: number, desc: string}, QUARTER: {code: number, desc: string}, YEAR: {code: number, desc: string}, HALF_YEAR: {code: number, desc: string}, WEEK: {code: number, desc: string}, DAY: {code: number, desc: string}}}
 */
const DOWN_GRADE_CYCLE = {
  DAY: {
    code: 1,
    desc: '每天'
  },
  WEEK: {
    code: 2,
    desc: '每周'
  },
  MONTH: {
    code: 3,
    desc: '每月'
  },
  QUARTER: {
    code: 4,
    desc: '每季度'
  },
  HALF_YEAR: {
    code: 5,
    desc: '每半年'
  },
  YEAR: {
    code: 6,
    desc: '每年'
  }
}

export default DOWN_GRADE_CYCLE
