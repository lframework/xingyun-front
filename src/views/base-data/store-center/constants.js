import utils from '@/utils/utils'

/**
 * 验证仓库人数
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export const validPeopleNum = (rule, value, callback) => {
  if (utils.isEmpty(value) || utils.isIntegerGeZero(value)) {
    callback()
  } else {
    if (!utils.isInteger(value)) {
      return callback(new Error('仓库人数必须为整数'))
    }

    if (!utils.isIntegerGeZero(value)) {
      return callback(new Error('仓库人数不允许小于0'))
    }
  }
}
