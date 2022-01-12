/**
 * 操作日志类型
 * @type {{AUTH: {code: number, desc: string}, OTHER: {code: number, desc: string}}}
 */
const OP_LOG_TYPE = {
  AUTH: {
    code: 1,
    desc: '用户认证'
  },
  OTHER: {
    code: 2,
    desc: '其他'
  }
}

export default OP_LOG_TYPE
