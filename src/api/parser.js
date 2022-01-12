import utils from '@/utils/utils'
/**
 * 解析api
 * @returns {*}
 */
export function apiParse() {
  const modulesFiles = require.context('./modules', true, /\.js$/)

  const options = modulesFiles.keys().reduce((modules, modulePath) => {
    // 命名规则：
    // -转驼峰
    let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    if (moduleName.indexOf('/') > -1) {
      moduleName = moduleName.split('/')
      for (let i = 0; i < moduleName.length; i++) {
        moduleName[i] = utils.camelCase(moduleName[i])
      }
      utils.set(modules, moduleName, value.default)
    } else {
      modules[utils.camelCase(moduleName)] = value.default
    }

    return modules
  }, {})

  return options
}
