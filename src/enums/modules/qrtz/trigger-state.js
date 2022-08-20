/**
 * Trigger状态
 * @type {{PAUSED: {code: string, desc: string}, COMPLETE: {code: string, desc: string}, WAITING: {code: string, desc: string}, ACQUIRED: {code: string, desc: string}, BLOCKED: {code: string, desc: string}, PAUSED_BLOCKED: {code: string, desc: string}, ERROR: {code: string, desc: string}}}
 */
const TRIGGER_STATE = {
  WAITING: {
    code: 'WAITING',
    desc: '等待执行'
  },
  PAUSED: {
    code: 'PAUSED',
    desc: '暂停执行'
  },
  ACQUIRED: {
    code: 'ACQUIRED',
    desc: '正常执行'
  },
  BLOCKED: {
    code: 'BLOCKED',
    desc: '阻塞'
  },
  ERROR: {
    code: 'ERROR',
    desc: '执行错误'
  },
  COMPLETE: {
    code: 'COMPLETE',
    desc: '执行完毕'
  },
  PAUSED_BLOCKED: {
    code: 'PAUSED_BLOCKED',
    desc: '阻塞暂停'
  }
}

export default TRIGGER_STATE
