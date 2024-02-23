import { isPassword, isEmail, isTelephone } from '@/utils/validate';
import * as utils from '@/utils/utils';

/**
 * 验证密码
 * @param rule
 * @param value
 * @returns {*}
 */
export const validPassword = (rule, value) => {
  if (utils.isEmpty(value) || isPassword(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线');
  }
};
/**
 * 验证邮箱
 * @param rule
 * @param value
 * @returns {*}
 */
export const validEmail = (rule, value) => {
  if (utils.isEmpty(value) || isEmail(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject('邮箱地址格式不正确');
  }
};

export const validTelephone = (rule, value) => {
  if (utils.isEmpty(value) || isTelephone(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject('联系电话格式不正确');
  }
};
