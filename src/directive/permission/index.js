import permission from './permission'
import noPermission from './no-permission'

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.directive('no-permission', noPermission)
}

if (window.Vue) {
  window['permission'] = permission
  window['no-permission'] = noPermission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
