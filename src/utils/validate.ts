/**
 * Created by PanJiaChen on 16/11/18.
 */
import * as utils from '@/utils/utils';

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function isEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true;
  }
  return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
}

/**
 * @param {string} str
 * @returns {boolean}
 */
export function isPassword(str) {
  const reg = /^[a-zA-Z0-9_]{5,16}$/;
  return reg.test(str);
}

/**
 * @param {string} str
 * @returns {boolean}
 */
export function isTelephone(str) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(str);
}

/**
 * 判断编号
 * @param rule
 * @param value
 */
export function validCode(rule, value) {
  if (utils.isEmpty(value)) {
    return Promise.resolve();
  }

  if (!utils.isCode(value)) {
    return Promise.reject('编号必须由字母、数字、“-_.”组成，长度不能超过20位');
  }

  return Promise.resolve();
}
