const modulesFiles = require.context('./svg', true, /\.svg$/)

const icons = []
modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')

  icons.push(moduleName)
  return modules
}, {})

export default icons
