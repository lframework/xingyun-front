import { isPassword, isEmail, isTelephone } from '@/utils/validate'
import utils from '@/utils/utils'

/**
 * 验证密码
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export const validPassword = (rule, value, callback) => {
  if (utils.isEmpty(value) || isPassword(value)) {
    callback()
  } else {
    return callback(new Error('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线'))
  }
}
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

export const validTelephone = (rule, value, callback) => {
  if (utils.isEmpty(value) || isTelephone(value)) {
    callback()
  } else {
    return callback(new Error('联系电话格式不正确'))
  }
}
