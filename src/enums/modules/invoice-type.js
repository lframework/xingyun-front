/**
 * 发票类型
 * @type {{NORMAL_OR_SPECIAL: {code: number, desc: string}, SPECIAL: {code: number, desc: string}, NORMAL: {code: number, desc: string}}}
 */
const INVOICE_TYPE = {
  NORMAL: {
    code: 1,
    desc: '增值税普通发票'
  },
  SPECIAL: {
    code: 2,
    desc: '增值税专用发票'
  },
  NORMAL_OR_SPECIAL: {
    code: 3,
    desc: '增值税专用发票或增值税普通发票'
  }
}

export default INVOICE_TYPE
