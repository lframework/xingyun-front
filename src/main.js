import Vue from 'vue'
import App from './App.vue'
import { initRouter } from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import { initI18n } from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
import { enumParse } from '@/enums/parser' // 枚举解析工具
import enums from '@/enums' // 枚举
import msg from '@/utils/msg' // 消息提示工具类
import utils from '@/utils/utils'

import { apiParse } from '@/api/parser' // api解析工具
import api from '@/api' // api
import './icons'
import 'vxe-table/lib/style.css' // vxe-table样式
import VXETable from 'vxe-table' // vxe-table
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
import { Empty } from 'ant-design-vue'
import loading from '@/directive/loading'
import permission from '@/directive/permission/index.js' // 权限判断指令
import JForm from '@/components/JForm'
import JFormItem from '@/components/JFormItem'
import JBorder from '@/components/JBorder'

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.prototype.$msg = msg
Vue.prototype.$utils = utils

Vue.use(enums, enumParse())
Vue.use(api, apiParse())
Vue.use(loading)
Vue.use(permission)
VXETable.setup({
  table: {
    sortConfig: {
      trigger: 'cell'
    },
    emptyRender: {
      name: 'NotData'
    }
  },
  grid: {
    pagerConfig: {
      pageSize: 20,
      pageSizes: [5, 15, 20, 50, 100]
    },
    toolbarConfig: {
      // 缩放
      zoom: true,
      // 自定义表头
      custom: true,
      // 右侧是否显示刷新按钮
      refresh: true
    }
  }
})
VXETable.use(VXETablePluginAntd)
VXETable.renderer.add('NotData', {
  // 空内容模板
  renderEmpty() {
    return [
      <a-empty image={ Empty.PRESENTED_IMAGE_SIMPLE } />
    ]
  }
})
Vue.use(VXETable)

Vue.prototype.$vh = (document.documentElement.clientHeight || document.body.clientHeight) / 100
Vue.prototype.$defaultTableHeight = Vue.prototype.$vh * 100 - 140

Vue.component('JForm', JForm)
Vue.component('JFormItem', JFormItem)
Vue.component('JBorder', JBorder)

bootstrap({ router, store, i18n, message: Vue.prototype.$message })

Vue.config.silent = true

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
