/**
 * 解析枚举文件
 * @returns {*}
 */
export function enumParse() {
  const modulesFiles = require.context('./modules', true, /\.js$/)

  const uniqArr = []
  const options = modulesFiles.keys().reduce((modules, modulePath) => {
    // 枚举命名规则：
    // 1、文件名转全大写
    // 2、-字符转下划线
    let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    if (moduleName.indexOf('/') > -1) {
      moduleName = moduleName.split('/')
      moduleName = moduleName[moduleName.length - 1]
    }
    moduleName = moduleName.toUpperCase().replaceAll('-', '_')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    if (uniqArr.indexOf(moduleName) > -1) {
      throw new Error(moduleName + '枚举重复，请检查！')
    }

    uniqArr.push(moduleName)
    return modules
  }, {})

  return options
}
