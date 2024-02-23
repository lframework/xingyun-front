import XEUtils from 'xe-utils';
import pinyin from 'js-pinyin';
import Moment from 'moment';
import CryptoJS from 'crypto-js';
import * as math from 'mathjs';
import { SortPageVo } from '@/api/model/sortPageVo';
import eventBus from '@/events/eventBus';

/**
 * 是否 整数
 * @type {RegExp}
 */
export const PATTERN_IS_INTEGER: RegExp = /^(-?[1-9]\d*|[0])$/;

/**
 * 是否 正整数
 * @type {RegExp}
 */
export const PATTERN_IS_INTEGER_GT_ZERO: RegExp = /^[1-9]\d*$/;
/**
 * 是否 负整数
 * @type {RegExp}
 */
export const PATTERN_IS_INTEGER_LT_ZERO: RegExp = /^-[1-9]\d*$/;
/**
 * 是否 非正整数 <=0
 * @type {RegExp}
 */
export const PATTERN_IS_INTEGER_LE_ZERO: RegExp = /^(-[1-9]\d*|0)$/;
/**
 * 是否 非负整数 >=0
 * @type {RegExp}
 */
export const PATTERN_IS_INTEGER_GE_ZERO: RegExp = /^([1-9]\d*|0)$/;
/**
 * 是否 浮点数
 * @type {RegExp}
 */
export const PATTERN_IS_FLOAT: RegExp =
  /^((-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0))|((-?[1-9]\d*|0)))$/;
/**
 * 是否 正浮点数
 * @type {RegExp}
 */
export const PATTERN_IS_FLOAT_GT_ZERO: RegExp = /^(([1-9]\d*\.\d*|0\.\d*[1-9]\d*)|([1-9]\d*))$/;
/**
 * 是否 负浮点数
 * @type {RegExp}
 */
export const PATTERN_IS_FLOAT_LT_ZERO: RegExp = /^((-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|(-[1-9]\d*))$/;
/**
 * 是否 非正浮点数 <= 0
 * @type {RegExp}
 */
export const PATTERN_IS_FLOAT_LE_ZERO: RegExp =
  /^(((-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0)|(-[1-9]\d*))$/;
/**
 * 是否 非负浮点数 >= 0
 * @type {RegExp}
 */
export const PATTERN_IS_FLOAT_GE_ZERO: RegExp =
  /^(([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)|([1-9]\d*))$/;
/**
 * 是否 数字组成
 * @type {RegExp}
 */
export const PATTERN_IS_NUMBERIC: RegExp = /^[0-9]*$/;

/**
 * 是否 价格
 * 大于或等于0的两位小数
 * @type {RegExp}
 */
export const PATTERN_IS_PRICE: RegExp =
  /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

/**
 * 是否是编号
 * 字母、数字、“-_.”组成，长度不能超过20位
 * @type {RegExp}
 */
export const PATTERN_IS_CODE: RegExp = /^[-_.A-Za-z0-9]{1,20}$/;

export const isNull = function (obj: any): boolean {
  return XEUtils.isUndefined(obj) || XEUtils.isNull(obj);
};
/**
 * 是否为空
 * @param obj
 * @returns {*}
 */
export const isEmpty = function (obj: any): boolean {
  if (isNull(obj)) {
    return true;
  }

  if (XEUtils.isObject(obj)) {
    return XEUtils.isEmpty(obj);
  }

  if (XEUtils.isString(obj)) {
    return obj === '';
  }

  if (XEUtils.isNumber(obj)) {
    return XEUtils.isNaN(obj);
  }

  return false;
};

/**
 * 是否为Array
 * @param obj
 * @returns {*}
 */
export const isArray = function (obj: any): boolean {
  return XEUtils.isArray(obj);
};

/**
 * 将两个对象转为字符串再进行比较
 * @param obj1
 * @param obj2
 * @returns {*}
 */
export const isEqualWithStr = function (obj1: any = '', obj2: any = ''): boolean {
  return XEUtils.isEqual(toString(obj1), toString(obj2));
};

/**
 * 将一个带层级的数据列表转成树结构
 * @param array
 * @param options
 * @returns {*}
 */
export const toArrayTree = function (array: any, options: any): any[] {
  return XEUtils.toArrayTree(array, options);
};

/**
 * 将一个树结构转成数组列表
 * @param array
 * @param options
 * @returns {*}
 */
export const toTreeArray = function (array: any, options: any): any[] {
  return XEUtils.toTreeArray(array, options);
};

/**
 * 获取对象所有属性
 * @param obj
 * @returns {*}
 */
export const keys = function (obj: any): any[] {
  return XEUtils.keys(obj);
};

/**
 * 字符串转驼峰
 * @param str
 * @returns {*}
 */
export const camelCase = function (str: string): string {
  return XEUtils.camelCase(str);
};

/**
 * 检查键、路径是否是该对象的属性
 * @param obj
 * @param property
 * @returns {*}
 */
export const has = function (obj: any, property: string | string[]): boolean {
  return XEUtils.has(obj, property);
};

/**
 * 获取对象的属性的值，如果值为 undefined，则返回默认值
 * @param obj
 * @param property
 * @param defaultValue
 * @returns {*}
 */
export const get = function (obj: any, property: any, defaultValue: any): any {
  return XEUtils.get(obj, property, defaultValue);
};

/**
 * 设置对象属性上的值。如果属性不存在则创建它
 */
export const set = function (obj: any, property: any, value: any): any {
  return XEUtils.set(obj, property, value);
};

/**
 * 将obj转字符串
 * @param obj
 * @returns {*}
 */
export const toString = function (obj: any): string {
  return XEUtils.toString(obj);
};

/**
 * 从树结构中根据回调查找数据
 * @param obj
 * @param iterate
 * @param options
 * @param context
 * @returns {*}
 */
export const searchTree = function (obj: any, iterate: any, options?: any, context?: any): any {
  return XEUtils.searchTree(obj, iterate, options, context);
};

/**
 * 从树结构中查找匹配第一条数据的键、值、路径
 * @param obj
 * @param iterate
 * @param options
 * @param context
 * @returns {*}
 */
export const findTree = function (obj, iterate, options, context) {
  return XEUtils.findTree(obj, iterate, options, context);
};

/**
 * 从树结构中指定方法后的返回值组成的新数组
 * @param obj
 * @param iterate
 * @param options
 * @param context
 * @returns {*}
 */
export const mapTree = function (obj, iterate, options, context) {
  return XEUtils.mapTree(obj, iterate, options, context);
};

/**
 *
 * @param val
 * @returns {*}
 */
export const isFunction = function (val) {
  return XEUtils.isFunction(val);
};

/**
 * 从树结构中遍历数据的键、值、路径
 * @param obj
 * @param iterate
 * @param options
 * @param context
 */
export const eachTree = function (obj, iterate, options, context) {
  XEUtils.eachTree(obj, iterate, options, context);
};

/**
 * 将多个数的值返回唯一的并集数组
 * @param array
 * @returns {*}
 */
export const union = function (...array) {
  return XEUtils.union(...array);
};

/**
 * 是否 整数
 * @param value
 * @returns {boolean}
 */
export const isInteger = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_INTEGER.test(String(value));
};

/**
 * 是否 正整数
 * @param value
 */
export const isIntegerGtZero = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_INTEGER_GT_ZERO.test(String(value));
};

/**
 * 是否 负整数
 * @param value
 * @returns {boolean}
 */
export const isIntegerLtZero = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_INTEGER_LT_ZERO.test(String(value));
};

/**
 * 是否 非正整数 <=0
 * @param value
 * @returns {boolean}
 */
export const isIntegerLeZero = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_INTEGER_LE_ZERO.test(String(value));
};

/**
 * 是否 非负整数 >=0
 * @param value
 * @returns {boolean}
 */
export const isIntegerGeZero = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_INTEGER_GE_ZERO.test(String(value));
};
/**
 * 是否 浮点数
 * @param value
 * @returns {boolean}
 */
export const isFloat = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_FLOAT.test(String(value));
};
/**
 * 是否 正浮点数
 * @param value
 * @returns {boolean}
 */
export const isFloatGtZero = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_FLOAT_GT_ZERO.test(String(value));
};

/**
 * 是否 负浮点数
 * @param value
 * @returns {boolean}
 */
export const isFloatLtZero = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_FLOAT_LT_ZERO.test(String(value));
};
/**
 * 是否 非正浮点数 <= 0
 * @param value
 * @returns {boolean}
 */
export const isFloatLeZero = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_FLOAT_LE_ZERO.test(String(value));
};
/**
 * 是否 非负浮点数 >= 0
 * @param value
 * @returns {boolean}
 */
export const isFloatGeZero = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_FLOAT_GE_ZERO.test(String(value));
};

/**
 * 是否 价格
 * 大于或等于0的两位小数
 * @param value
 * @returns {boolean}
 */
export const isPrice = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_PRICE.test(String(value));
};

/**
 * 是否 编号
 * 字母、数字、“-_.”组成，长度不能超过20位
 * @param value
 * @returns {boolean}
 */
export const isCode = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_CODE.test(String(value));
};

/**
 * 是否 数字组成
 * @param value
 * @returns {boolean}
 */
export const isNumberic = function (value) {
  if (isEmpty(value)) {
    return false;
  }

  return PATTERN_IS_NUMBERIC.test(String(value));
};
/**
 * 判断{value}是否为{precision}位小数
 * @param value
 * @param precision
 */
export const isNumberPrecision = function (value, precision) {
  if (isEmpty(value)) {
    return false;
  }

  if (!isFloat(value)) {
    return false;
  }

  if (!isIntegerGtZero(precision)) {
    return false;
  }

  let str = String(value);

  if (str.includes('.')) {
    while (str.substring(str.length - 1, str.length) === '0') {
      // 将数字末尾为0的字符去除
      str = str.substring(0, str.length - 1);
    }

    if (str.substring(str.length - 1, str.length) === '.') {
      return true;
    }

    return str.substring(str.indexOf('.')).length - 1 <= precision;
  }

  return true;
};

/**
 * 判断{func}是否是Promise
 * @param func
 * @returns {*}
 */
export const isPromise = function (func) {
  return !isNull(func) && XEUtils.isFunction(func.then) && XEUtils.isFunction(func.catch);
};

/**
 * 文字全拼音
 * @param str
 * @returns {string}
 */
export const getFullChars = function (str) {
  return pinyin.getFullChars(str);
};

/**
 * 文字拼音首字母
 * @param str
 * @returns {*}
 */
export const getCamelChars = function (str) {
  return pinyin.getCamelChars(str);
};

/**
 * 文字拼音首字母（大写）
 * @param str
 * @returns {string}
 */
export const getCamelCharsUpperCase = function (str) {
  return pinyin.getCamelChars(str).toUpperCase();
};

/**
 * 获取当前日期
 * @returns {moment.Moment}
 */
export const getCurrentDate = function () {
  return Moment().hour(0).minute(0).second(0).millisecond(0);
};

/**
 * 获取当前日期时间
 * @returns {moment.Moment}
 */
export const getCurrentDateTime = function () {
  return Moment();
};

/**
 * 格式化日期
 * @param moment
 * @returns {string}
 */
export const formatDate = function (moment) {
  return moment.format('YYYY-MM-DD');
};

/**
 * 格式化日期时间
 * @param moment
 * @param pattern
 * @returns {string}
 */
export const formatDateTime = function (moment, pattern?: string): string {
  return moment.format(pattern || 'YYYY-MM-DD HH:mm:ss');
};

/**
 * 获取最小时间的日期时间
 * @param moment
 * @returns {*}
 */
export const getDateTimeWithMinTime = function (moment) {
  return moment.hour(0).minute(0).second(0).millisecond(0);
};

/**
 * 获取最大时间的日期时间
 * @param moment
 * @returns {*}
 */
export const getDateTimeWithMaxTime = function (moment) {
  return moment.hour(23).minute(59).second(59).millisecond(0);
};

/**
 * 解析日期
 * @param str
 * @returns {*|moment.Moment}
 */
export const parseDate = function (str) {
  return Moment(str, 'YYYY-MM-DD');
};

/**
 * 解析日期时间
 * @param str
 * @returns {moment.Moment}
 */
export const parseDateTime = function (str) {
  return Moment(str, 'YYYY-MM-DD HH:mm:ss');
};

/**
 * 日期时间转日期
 * @param dateTime
 * @returns {string}
 */
export const dateTimeToDate = function (dateTime) {
  return formatDate(Moment(dateTime, 'YYYY-MM-DD HH:mm:ss'));
};

export const uuid = function () {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

  const uuid = s.join('');
  return uuid;
};

/**
 * MD5加密
 * @param v
 */
export const md5 = function (v) {
  return CryptoJS.MD5(v);
};

/**
 * 读取图片
 * @param file
 * @returns {Promise<unknown>}
 */
export const readImg = function (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
/**
 * 将url参数转对象
 * @param {string} url
 * @returns {Object}
 */
export const getQueryObject = function (url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.indexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
};

/**
 * n1 + n2
 * @param n1
 * @param n2
 * @returns {math.MathType}
 */
export const add = function (n1, n2) {
  return math.number(math.add(math.bignumber(n1), math.bignumber(n2)));
};

/**
 * n1 - n2
 * @param n1
 * @param n2
 * @returns {math.MathType}
 */
export const sub = function (n1, n2) {
  return math.number(math.subtract(math.bignumber(n1), math.bignumber(n2)));
};

/**
 * n1 * n2
 * @param n1
 * @param n2
 * @returns {math.MathType}
 */
export const mul = function (n1, n2) {
  return math.number(math.bignumber(n1).mul(math.bignumber(n2)));
};

/**
 * n1 / n2
 * @param n1
 * @param n2
 * @returns {math.MathType}
 */
export const div = function (n1, n2) {
  return math.number(math.bignumber(n1).div(math.bignumber(n2)));
};

/**
 * n1 > n2
 * @param n1
 * @param n2
 * @returns {boolean}
 */
export const gt = function (n1, n2) {
  return math.bignumber(n1).gt(n2);
};

/**
 * n1 >= n2
 * @param n1
 * @param n2
 * @returns {boolean}
 */
export const ge = function (n1, n2) {
  return math.bignumber(n1).gte(n2);
};

/**
 * n1 < n2
 * @param n1
 * @param n2
 * @returns {boolean}
 */
export const lt = function (n1, n2) {
  return math.bignumber(n1).lt(n2);
};

/**
 * n1 <= n2
 * @param n1
 * @param n2
 * @returns {boolean}
 */
export const le = function (n1, n2) {
  return math.bignumber(n1).lte(n2);
};

/**
 * n1 == n2
 * @param n1
 * @param n2
 * @returns {any | ((obj1: any, obj2: any) => boolean)}
 */
export const eq = function (n1, n2) {
  return math.bignumber(n1).eq(n2);
};

/**
 * 获取当前月有多少天
 * @returns {number}
 */
export const getCountDays = function () {
  const curDate = new Date();
  // 获取当前月份
  const curMonth = curDate.getMonth();
  // 实际月份比curMonth大1，下面将月份设置为下一个月
  curDate.setMonth(curMonth + 1);
  // 将日期设置为0，表示自动计算为上个月（这里指的是当前月份）的最后一天
  curDate.setDate(0);
  // 返回当前月份的天数
  return curDate.getDate();
};

/**
 * 交换数组元素
 * @param arr
 * @param index
 * @param toIndex
 * @returns {*}
 */
export const swapArrayItem = function (arr, index, toIndex) {
  if (index >= arr.length || index < 0) {
    return arr;
  }

  if (toIndex >= arr.length || toIndex < 0) {
    return arr;
  }

  if (index === toIndex) {
    return arr;
  }

  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === index) {
      newArr.push(arr[toIndex]);
    } else if (i === toIndex) {
      newArr.push(arr[index]);
    } else {
      newArr.push(arr[i]);
    }
  }
  return newArr;
};

/**
 * 关闭当前页签
 * @param el
 */
export const closeCurrentPage = function () {
  eventBus.$emit(eventBus.$otherEvent.CLOSE_CURRENT_TAB);
};

/**
 * 字符串Ant匹配
 * @param str
 * @param pattern
 * @returns {boolean|*}
 */
export const strMatch = function (str, pattern) {
  str = toString(str);
  pattern = toString(pattern);

  if (isEmpty(str) && isEmpty(pattern)) {
    return true;
  }
  if (str === '*') {
    return true;
  }
  if (isEmpty(str) || isEmpty(pattern)) {
    return false;
  }

  if (str[0] === '?') {
    return strMatch(str.substring(1), pattern.substring(1));
  } else if (str[0] === '*') {
    return (
      strMatch(str.substring(1), pattern) ||
      strMatch(str.substring(1), pattern.substring(1)) ||
      strMatch(str, pattern.substring(1))
    );
  } else if (str[0] === pattern[0]) {
    return strMatch(str.substring(1), pattern.substring(1));
  } else {
    return false;
  }
};

/**
 * 清空数组
 * @param arr
 */
export const clearAll = function (arr: any[]): void {
  if (isEmpty(arr)) {
    return;
  }

  arr.splice(0, arr.length);
};

/**
 * 组合数组
 * @param arr
 */
export const combineArr = function (arr: any[]) {
  const result = arr.reduce((accArr, currentArr) => {
    const result = [];
    currentArr.forEach((c) => {
      if (accArr.length) {
        accArr.forEach((a) => {
          result.push(a.concat(c));
        });
      } else {
        result.push([c]);
      }
    });
    return result;
  }, []);
  return result;
};

export const welcomeMsg = function (name: string): string {
  const hour = getCurrentDateTime().get('h');
  let msg = '';
  if (hour < 4) {
    msg = '夜深了';
  } else if (hour < 6) {
    msg = '凌晨好';
  } else if (hour < 9) {
    msg = '早上好';
  } else if (hour < 12) {
    msg = '上午好';
  } else if (hour < 14) {
    msg = '中午好';
  } else if (hour < 17) {
    msg = '下午好';
  } else if (hour < 19) {
    msg = '傍晚好';
  } else if (hour < 22) {
    msg = '晚上好';
  } else {
    msg = '夜深了';
  }

  return `${name}，${msg}，欢迎回来`;
};

export const buildSortPageVo = function (
  { currentPage, pageSize }: { currentPage: number; pageSize: number },
  sorts: { field: string; order: string }[],
): SortPageVo {
  return {
    pageIndex: currentPage,
    pageSize,
    sortField: sorts ? sorts[0]?.field : undefined,
    sortOrder: sorts ? sorts[0]?.order : undefined,
  } as SortPageVo;
};
