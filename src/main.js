import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import 'vxe-table/lib/style.css' // vxe-table样式

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import permission from '@/directive/permission/index.js' // 权限判断指令

import msg from '@/utils/msg' // 消息提示工具类
import { enumParse } from '@/enums/parser' // 枚举解析工具
import enums from '@/enums' // 枚举

import { apiParse } from '@/api/parser' // api解析工具
import api from '@/api' // api

import 'xe-utils' // vxe-table需要依赖此工具类
import VXETable from 'vxe-table' // vxe-table

import utils from '@/utils/utils'
import JForm from '@/components/JForm'
import JFormItem from '@/components/JFormItem'
import JBorder from '@/components/JBorder'

Vue.prototype.$globalSize = Cookies.get('size') || 'medium'

Vue.use(Element, {
  size: Vue.prototype.$globalSize // set element-ui default size
})

Vue.config.productionTip = false

Vue.prototype.$msg = msg
Vue.prototype.$utils = utils
Vue.use(enums, enumParse())
Vue.use(api, apiParse())
VXETable.setup({
  size: Vue.prototype.$globalSize
})
Vue.use(VXETable)
Vue.use(permission)
Vue.component('JForm', JForm)
Vue.component('JFormItem', JFormItem)
Vue.component('JBorder', JBorder)
Vue.prototype.$vh = parseInt(window.innerHeight / 100)
Vue.prototype.$defaultTableHeight = Vue.prototype.$vh * 100 - 110

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
