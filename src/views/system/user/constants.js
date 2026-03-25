import { isPassword, isEmail, isTelephone } from '@/utils/validate';
import * as utils from '@/utils/utils';

/**
 * 验证密码
 * @param itemValue
 * @returns {*}
 */
export const validPassword = ({ itemValue }) => {
  if (!utils.isEmpty(itemValue) && !isPassword(itemValue)) {
    return new Error('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线');
  }
};
/**
 * 验证邮箱
 * @param itemValue
 * @returns {*}
 */
export const validEmail = ({ itemValue }) => {
  if (!utils.isEmpty(itemValue) && !isEmail(itemValue)) {
    return new Error('邮箱地址格式不正确');
  }
};

export const validTelephone = ({ itemValue }) => {
  if (!utils.isEmpty(itemValue) && !isTelephone(itemValue)) {
    return new Error('联系电话格式不正确');
  }
};
