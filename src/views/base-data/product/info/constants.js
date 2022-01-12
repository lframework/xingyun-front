import utils from '@/utils/utils'

/**
 * 校验税率
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export const validTaxRate = (rule, value, callback) => {
  if (!utils.isEmpty(value)) {
    if (!utils.isInteger(value)) {
      return callback(new Error('税率必须为整数'))
    }
    if (!utils.isIntegerGeZero(value)) {
      return callback(new Error('税率不允许小于0'))
    }
  }

  callback()
}
