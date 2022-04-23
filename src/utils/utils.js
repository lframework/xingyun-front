/**
 * 工具类主要调用XEUtils
 * 文档地址：https://x-extends.gitee.io/xe-utils/
 */
import Vue from 'vue'
import XEUtils from 'xe-utils'
import pinyin from 'js-pinyin'
import Moment from 'moment'
import CryptoJS from 'crypto-js'
import * as math from 'mathjs'
import BlankView from '@/layouts/BlankView'
import { isExternal } from '@/utils/validate'

const utils = {}

/**
 * 是否 整数
 * @type {RegExp}
 */
utils.PATTERN_IS_INTEGER = /^(-?[1-9]\d*|[0])$/

/**
 * 是否 正整数
 * @type {RegExp}
 */
utils.PATTERN_IS_INTEGER_GT_ZERO = /^[1-9]\d*$/
/**
 * 是否 负整数
 * @type {RegExp}
 */
utils.PATTERN_IS_INTEGER_LT_ZERO = /^-[1-9]\d*$/
/**
 * 是否 非正整数 <=0
 * @type {RegExp}
 */
utils.PATTERN_IS_INTEGER_LE_ZERO = /^(-[1-9]\d*|[0]{1})$/
/**
 * 是否 非负整数 >=0
 * @type {RegExp}
 */
utils.PATTERN_IS_INTEGER_GE_ZERO = /^([1-9]\d*|[0]{1})$/
/**
 * 是否 浮点数
 * @type {RegExp}
 */
utils.PATTERN_IS_FLOAT = /^((-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0))|((-?[1-9]\d*|[0])))$/
/**
 * 是否 正浮点数
 * @type {RegExp}
 */
utils.PATTERN_IS_FLOAT_GT_ZERO = /^(([1-9]\d*\.\d*|0\.\d*[1-9]\d*)|([1-9]\d*))$/
/**
 * 是否 负浮点数
 * @type {RegExp}
 */
utils.PATTERN_IS_FLOAT_LT_ZERO = /^((-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|(-[1-9]\d*))$/
/**
 * 是否 非正浮点数 <= 0
 * @type {RegExp}
 */
utils.PATTERN_IS_FLOAT_LE_ZERO = /^(((-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0)|(-[1-9]\d*))$/
/**
 * 是否 非负浮点数 >= 0
 * @type {RegExp}
 */
utils.PATTERN_IS_FLOAT_GE_ZERO = /^(([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)|([1-9]\d*))$/
/**
 * 是否 数字组成
 * @type {RegExp}
 */
utils.PATTERN_IS_NUMBERIC = /^[0-9]*$/

/**
 * 是否 价格
 * 大于或等于0的两位小数
 * @type {RegExp}
 */
utils.PATTERN_IS_PRICE = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

/**
 * 是否为null
 * @param obj
 * @returns {*}
 */
utils.isNull = function(obj) {
  return XEUtils.isUndefined(obj) || XEUtils.isNull(obj)
}

/**
 * 是否为空
 * @param obj
 * @returns {*}
 */
utils.isEmpty = function(obj) {
  if (this.isNull(obj)) {
    return true
  }

  if (XEUtils.isObject(obj)) {
    return XEUtils.isEmpty(obj)
  }

  if (XEUtils.isString(obj)) {
    return obj === ''
  }

  if (XEUtils.isNumber(obj)) {
    return XEUtils.isNaN(obj)
  }

  return false
}

/**
 * 是否为Array
 * @param obj
 * @returns {*}
 */
utils.isArray = function(obj) {
  return XEUtils.isArray(obj)
}

/**
 * 将两个对象转为字符串再进行比较
 * @param obj1
 * @param obj2
 * @returns {*}
 */
utils.isEqualWithStr = function(obj1 = '', obj2 = '') {
  return XEUtils.isEqual(this.toString(obj1), this.toString(obj2))
}

/**
 * 将一个带层级的数据列表转成树结构
 * @param array
 * @param options
 * @returns {*}
 */
utils.toArrayTree = function(array, options) {
  return XEUtils.toArrayTree(array, options)
}

/**
 * 将一个树结构转成数组列表
 * @param array
 * @param options
 * @returns {*}
 */
utils.toTreeArray = function(array, options) {
  return XEUtils.toTreeArray(array, options)
}

/**
 * 获取对象所有属性
 * @param obj
 * @returns {*}
 */
utils.keys = function(obj) {
  return XEUtils.keys(obj)
}

/**
 * 字符串转驼峰
 * @param str
 * @returns {*}
 */
utils.camelCase = function(str) {
  return XEUtils.camelCase(str)
}

/**
 * 检查键、路径是否是该对象的属性
 * @param obj
 * @param property
 * @returns {*}
 */
utils.has = function(obj, property) {
  return XEUtils.has(obj, property)
}

/**
 * 获取对象的属性的值，如果值为 undefined，则返回默认值
 * @param obj
 * @param property
 * @param defaultValue
 * @returns {*}
 */
utils.get = function(obj, property, defaultValue) {
  return XEUtils.get(obj, property, defaultValue)
}

/**
 * 设置对象属性上的值。如果属性不存在则创建它
 */
utils.set = function(obj, property, value) {
  return XEUtils.set(obj, property, value)
}

/**
 * 将obj转字符串
 * @param obj
 * @returns {*}
 */
utils.toString = function(obj) {
  return XEUtils.toString(obj)
}

/**
 * 从树结构中根据回调查找数据
 * @param obj
 * @param iterate
 * @param options
 * @param context
 * @returns {*}
 */
utils.searchTree = function(obj, iterate, options, context) {
  return XEUtils.searchTree(obj, iterate, options, context)
}

/**
 * 从树结构中查找匹配第一条数据的键、值、路径
 * @param obj
 * @param iterate
 * @param options
 * @param context
 * @returns {*}
 */
utils.findTree = function(obj, iterate, options, context) {
  return XEUtils.findTree(obj, iterate, options, context)
}

/**
 * 从树结构中遍历数据的键、值、路径
 * @param obj
 * @param iterate
 * @param options
 * @param context
 * @returns {*}
 */
utils.eachTree = function(obj, iterate, options, context) {
  return XEUtils.eachTree(obj, iterate, options, context)
}

/**
 *
 * @param val
 * @returns {*}
 */
utils.isFunction = function(val) {
  return XEUtils.isFunction(val)
}

/**
 * 从树结构中遍历数据的键、值、路径
 * @param obj
 * @param iterate
 * @param options
 * @param context
 */
utils.eachTree = function(obj, iterate, options, context) {
  XEUtils.eachTree(obj, iterate, options, context)
}

/**
 * 将多个数的值返回唯一的并集数组
 * @param array
 * @returns {*}
 */
utils.union = function(...array) {
  return XEUtils.union(...array)
}

/**
 * 是否 整数
 * @param value
 * @returns {boolean}
 */
utils.isInteger = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_INTEGER.test(String(value))
}

/**
 * 是否 正整数
 * @param value
 */
utils.isIntegerGtZero = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_INTEGER_GT_ZERO.test(String(value))
}

/**
 * 是否 负整数
 * @param value
 * @returns {boolean}
 */
utils.isIntegerLtZero = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_INTEGER_LT_ZERO.test(String(value))
}

/**
 * 是否 非正整数 <=0
 * @param value
 * @returns {boolean}
 */
utils.isIntegerLeZero = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_INTEGER_LE_ZERO.test(String(value))
}

/**
 * 是否 非负整数 >=0
 * @param value
 * @returns {boolean}
 */
utils.isIntegerGeZero = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_INTEGER_GE_ZERO.test(String(value))
}
/**
 * 是否 浮点数
 * @param value
 * @returns {boolean}
 */
utils.isFloat = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_FLOAT.test(String(value))
}
/**
 * 是否 正浮点数
 * @param value
 * @returns {boolean}
 */
utils.isFloatGtZero = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_FLOAT_GT_ZERO.test(String(value))
}

/**
 * 是否 负浮点数
 * @param value
 * @returns {boolean}
 */
utils.isFloatLtZero = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_FLOAT_LT_ZERO.test(String(value))
}
/**
 * 是否 非正浮点数 <= 0
 * @param value
 * @returns {boolean}
 */
utils.isFloatLeZero = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_FLOAT_LE_ZERO.test(String(value))
}
/**
 * 是否 非负浮点数 >= 0
 * @param value
 * @returns {boolean}
 */
utils.isFloatGeZero = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_FLOAT_GE_ZERO.test(String(value))
}

/**
 * 是否 价格
 * 大于或等于0的两位小数
 * @param value
 * @returns {boolean}
 */
utils.isPrice = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_PRICE.test(String(value))
}

/**
 * 是否 数字组成
 * @param value
 * @returns {boolean}
 */
utils.isNumberic = function(value) {
  if (this.isEmpty(value)) {
    return false
  }

  return this.PATTERN_IS_NUMBERIC.test(String(value))
}
/**
 * 判断{value}是否为{precision}位小数
 * @param value
 * @param precision
 */
utils.isNumberPrecision = function(value, precision) {
  if (this.isEmpty(value)) {
    return false
  }

  if (!this.isFloat(value)) {
    return false
  }

  if (!this.isIntegerGtZero(precision)) {
    return false
  }

  let str = String(value)

  if (str.includes('.')) {
    while (str.substring(str.length - 1, str.length) === '0') {
      // 将数字末尾为0的字符去除
      str = str.substring(0, str.length - 1)
    }

    if (str.substring(str.length - 1, str.length) === '.') {
      return true
    }

    return str.substring(str.indexOf('.')).length - 1 <= precision
  }

  return true
}

/**
 * 判断{func}是否是Promise
 * @param func
 * @returns {*}
 */
utils.isPromise = function(func) {
  return !this.isNull(func) && XEUtils.isFunction(func.then) && XEUtils.isFunction(func.catch)
}

/**
 * 判断{func}是否是Function
 * @param func
 * @returns {*}
 */
utils.isFunction = function(func) {
  return XEUtils.isFunction(func)
}

/**
 * 文字全拼音
 * @param str
 * @returns {string}
 */
utils.getFullChars = function(str) {
  return pinyin.getFullChars(str)
}

/**
 * 文字拼音首字母
 * @param str
 * @returns {*}
 */
utils.getCamelChars = function(str) {
  return pinyin.getCamelChars(str)
}

/**
 * 文字拼音首字母（大写）
 * @param str
 * @returns {string}
 */
utils.getCamelCharsUpperCase = function(str) {
  return pinyin.getCamelChars(str).toUpperCase()
}

/**
 * 获取当前日期
 * @returns {moment.Moment}
 */
utils.getCurrentDate = function() {
  return Moment().hour(0).minute(0).second(0).millisecond(0)
}

/**
 * 获取当前日期时间
 * @returns {moment.Moment}
 */
utils.getCurrentDateTime = function() {
  return Moment()
}

/**
 * 格式化日期
 * @param moment
 * @returns {string}
 */
utils.formatDate = function(moment) {
  return moment.format('YYYY-MM-DD')
}

/**
 * 格式化日期时间
 * @param moment
 * @returns {string}
 */
utils.formatDateTime = function(moment) {
  return moment.format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取最小时间的日期时间
 * @param moment
 * @returns {*}
 */
utils.getDateTimeWithMinTime = function(moment) {
  return moment.hour(0).minute(0).second(0).millisecond(0)
}

/**
 * 获取最大时间的日期时间
 * @param moment
 * @returns {*}
 */
utils.getDateTimeWithMaxTime = function(moment) {
  return moment.hour(23).minute(59).second(59).millisecond(0)
}

/**
 * 日期时间转日期
 * @param dateTime
 * @returns {string}
 */
utils.dateTimeToDate = function(dateTime) {
  return this.formatDate(Moment(dateTime, 'YYYY-MM-DD HH:mm:ss'))
}

utils.uuid = function() {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01

  const uuid = s.join('')
  return uuid
}

/**
 * MD5加密
 * @param v
 */
utils.md5 = function(v) {
  return CryptoJS.MD5(v)
}

/**
 * 将url参数转对象
 * @param {string} url
 * @returns {Object}
 */
utils.getQueryObject = function(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.indexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * n1 + n2
 * @param n1
 * @param n2
 * @returns {math.MathType}
 */
utils.add = function(n1, n2) {
  return math.number(math.add(math.bignumber(n1), math.bignumber(n2)))
}

/**
 * n1 - n2
 * @param n1
 * @param n2
 * @returns {math.MathType}
 */
utils.sub = function(n1, n2) {
  return math.number(math.subtract(math.bignumber(n1), math.bignumber(n2)))
}

/**
 * n1 * n2
 * @param n1
 * @param n2
 * @returns {math.MathType}
 */
utils.mul = function(n1, n2) {
  return math.number(math.multiply(math.bignumber(n1), math.bignumber(n2)))
}

/**
 * n1 / n2
 * @param n1
 * @param n2
 * @returns {math.MathType}
 */
utils.div = function(n1, n2) {
  return math.number(math.divide(math.bignumber(n1), math.bignumber(n2)))
}
/**
 * 获取当前月有多少天
 * @returns {number}
 */
utils.getCountDays = function() {
  const curDate = new Date()
  // 获取当前月份
  const curMonth = curDate.getMonth()
  // 实际月份比curMonth大1，下面将月份设置为下一个月
  curDate.setMonth(curMonth + 1)
  // 将日期设置为0，表示自动计算为上个月（这里指的是当前月份）的最后一天
  curDate.setDate(0)
  // 返回当前月份的天数
  return curDate.getDate()
}

/**
 * 交换数组元素
 * @param arr
 * @param index
 * @param toIndex
 * @returns {*}
 */
utils.swapArrayItem = function(arr, index, toIndex) {
  if (index >= arr.length || index < 0) {
    return arr
  }

  if (toIndex >= arr.length || toIndex < 0) {
    return arr
  }

  if (index === toIndex) {
    return arr
  }

  const newArr = []
  for (let i = 0; i < arr.length; i++) {
    if (i === index) {
      newArr.push(arr[toIndex])
    } else if (i === toIndex) {
      newArr.push(arr[index])
    } else {
      newArr.push(arr[i])
    }
  }
  return newArr
}

utils.buildMenus = function(oriMenus = []) {
  const result = []
  oriMenus.forEach(menu => {
    const obj = {}

    const $enums = Vue.prototype.$enums
    const MENU_DISPLAY = $enums.MENU_DISPLAY
    if (MENU_DISPLAY.CATALOG.equalsCode(menu.display)) {
      // 如果是目录
      obj.path = this.isEmpty(menu.path) ? '' : menu.path
      obj.name = menu.meta.title
      obj.meta = {
        icon: 'menu',
        invisible: menu.hidden || false
      }

      /* if (this.isEmpty(menu.children)) {
        // 如果没有子节点 也展示
        obj.alwayShow = true
      }*/
      obj.component = BlankView
    } else if (MENU_DISPLAY.FUNCTION.equalsCode(menu.display)) {
      // 如果是功能
      obj.path = menu.path || ''
      obj.name = menu.meta.title
      obj.meta = {
        icon: '',
        invisible: menu.hidden || false,
        page: {
          cacheAble: !menu.meta.noCache
        }
      }

      if (!isExternal(menu.path)) {
        let component = menu.component
        if (component.substring(0, 1) !== '/') {
          component = '/' + component
        }
        obj.component = (resolve) => require([`@/views${component}`], resolve)
        if (menu.path.indexOf('?') > -1) {
          const queryObj = this.getQueryObject(menu.path)
          if (!this.isEmpty(queryObj)) {
            obj.props = queryObj
          }
        } else if (menu.path.indexOf('/:') > -1) {
          obj.props = true
        }
      }
    }

    // 如果是最上级节点 path必须/开头
    // 如果不是最上级节点 path不以/开头
    if (!isExternal(menu.path)) {
      if (utils.isEmpty(menu.parentId)) {
        if (!obj.path.startsWith('/')) {
          obj.path = '/' + obj.path
        }
      } else {
        if (obj.path.startsWith('/')) {
          obj.path = obj.path.substring(1)
        }
      }
      if (!this.isEmpty(obj.path) && obj.path.indexOf('?') > -1) {
        obj.path = obj.path.substring(0, obj.path.indexOf('?'))
      }
    } else {
      // 如果是外部url
      obj.meta.link = menu.path
    }

    // obj.meta = Object.assign({ title: '', icon: '', noCache: false }, menu.meta)
    if (!obj.meta) {
      obj.meta = {}
    }
    obj.hidden = menu.hidden
    obj.children = this.buildMenus(menu.children)
    obj.isCollect = menu.isCollect || false
    obj.display = menu.display
    obj.id = menu.id
    obj.meta.id = menu.id
    result.push(obj)
  })

  return result
}

/**
 * 关闭当前页签
 * @param el
 */
utils.closeCurrentPage = function(el) {
  let parent = el
  while (parent) {
    if (parent.$options.name === 'TabsView') {
      parent.remove(parent.activePage)
    }
    parent = parent.$parent
  }
}

export default utils
