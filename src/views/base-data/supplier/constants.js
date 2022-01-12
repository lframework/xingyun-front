import utils from '@/utils/utils'
import { isEmail } from '@/utils/validate'

/**
 * 验证邮箱
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export const validEmail = (rule, value, callback) => {
  if (utils.isEmpty(value) || isEmail(value)) {
    callback()
  } else {
    return callback(new Error('邮箱地址格式不正确'))
  }
}

export const validDeliveryCycle = (rule, value, callback) => {
  if (utils.isEmpty(value)) {
    return callback()
  }

  if (!utils.isInteger(value)) {
    return callback(new Error('送货周期（天）必须为整数'))
  }

  if (!utils.isIntegerGtZero(value)) {
    return callback(new Error('送货周期（天）必须大于0'))
  }
}
