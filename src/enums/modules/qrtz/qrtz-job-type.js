/**
 * 任务类型
 * @type {{EXCUTE_CLASS: {code: number, desc: string}, GROOVY: {code: number, desc: string}}}
 */
const QRTZ_JOB_TYPE = {
  EXCUTE_CLASS: {
    code: 1,
    desc: '指定类'
  },
  GROOVY: {
    code: 2,
    desc: 'Groovy脚本'
  }
}

export default QRTZ_JOB_TYPE
