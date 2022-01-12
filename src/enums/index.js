/**
 * 枚举工具类
 */
import utils from '@/utils/utils'

const instance = {}

instance.install = function(Vue, options = {}) {
  const enums = {}

  const optionsKeys = utils.keys(options)
  optionsKeys.forEach(item => {
    enums[item] = options[item]

    const enumObj = enums[item]

    /**
     * 获取枚举对象中各个枚举值数组
     * @returns eg: [code: 1, desc:'test1', code: 2, desc: 'test2']
     */
    enumObj.values = function() {
      const keys = utils.keys(this)
      const result = []
      keys.filter(key => !utils.isFunction(this[key])).forEach(key => result.push(this[key]))
      return result
    }

    /**
     * 将枚举的code解析为desc
     * @param type 枚举类型
     * @param code
     * @returns desc
     */
    enumObj.getDesc = function(code) {
      if (utils.isNull(code)) {
        return null
      }

      const keys = utils.keys(this)

      if (utils.isEmpty(keys)) {
        return null
      }

      const enumList = keys.filter(item => !utils.isFunction(this[item]))
      for (let i = 0; i < enumList.length; i++) {
        const enumObj = this[enumList[i]]
        if (utils.isEqualWithStr(enumObj.code, code)) {
          return enumObj.desc
        }
      }
    }

    /**
     * 将枚举的code解析为对象
     * @param type 枚举类型
     * @param code
     * @returns desc
     */
    enumObj.getByCode = function(code) {
      if (utils.isNull(code)) {
        return null
      }

      const keys = utils.keys(this)

      if (utils.isEmpty(keys)) {
        return null
      }

      const enumList = keys.filter(item => !utils.isFunction(this[item]))
      for (let i = 0; i < enumList.length; i++) {
        const enumObj = this[enumList[i]]
        if (utils.isEqualWithStr(enumObj.code, code)) {
          return enumObj
        }
      }
    }

    const enumKeys = utils.keys(enumObj)
    enumKeys.filter(element => !utils.isFunction(element)).forEach(element => {
      /**
       * 判断code是否与该枚举的code相等
       * @param code
       * @returns {*}
       */
      enumObj[element].equalsCode = function(code) {
        return utils.isEqualWithStr(this.code, code)
      }
    })
  })

  Vue.prototype.$enums = enums
}

export default instance

