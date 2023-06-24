import JForm from '@/components/JForm'
import JFormItem from '@/components/JFormItem'
import JBorder from '@/components/JBorder'
import OrderTimeLine from '@/components/OrderTimeLine'
import DataDicPicker from '@/components/DataDicPicker'
import CustomList from '@/components/CustomList'
import CustomSelector from '@/components/CustomSelector'
import CustomForm from '@/components/CustomForm'
import CustomPage from '@/components/CustomPage'
import JEditor from '@/components/JEditor'
import JUpload from '@/components/JUpload'
import JImgUpload from '@/components/JImgUpload'
import JVideoUpload from '@/components/JVideoUpload'
import SvgIcon from '@/components/SvgIcon'
import IconPicker from '@/components/IconPicker'
import CronPicker from '@/components/CronPicker'
import DataPermissionDragger from '@/components/DataPermissionDragger'
import DataPermission from '@/components/DataPermission'
import LocationMap from '@/components/LocationMap'
import LuckySheet from '@/components/LuckySheet'

const instance = {}
instance.install = function(Vue) {
  Vue.component('JForm', JForm)
  Vue.component('JFormItem', JFormItem)
  Vue.component('JBorder', JBorder)
  Vue.component('OrderTimeLine', OrderTimeLine)
  Vue.component('DataDicPicker', DataDicPicker)
  Vue.component('CustomList', CustomList)
  Vue.component('CustomSelector', CustomSelector)
  Vue.component('CustomForm', CustomForm)
  Vue.component('CustomPage', CustomPage)
  Vue.component('JEditor', JEditor)
  Vue.component('JUpload', JUpload)
  Vue.component('JImgUpload', JImgUpload)
  Vue.component('JVideoUpload', JVideoUpload)
  Vue.component('SvgIcon', SvgIcon)
  Vue.component('IconPicker', IconPicker)
  Vue.component('CronPicker', CronPicker)
  Vue.component('DataPermissionDragger', DataPermissionDragger)
  Vue.component('DataPermission', DataPermission)
  Vue.component('LocationMap', LocationMap)
  Vue.component('LuckySheet', LuckySheet)

  // selector
  const selectors = require.context('./Selector', true, /\.vue$/i)
  selectors.keys().forEach(modulePath => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = selectors(modulePath)
    Vue.component(moduleName, value.default)
  })

  // importer
  const importers = require.context('./Importer', true, /\.vue$/i)
  importers.keys().forEach(modulePath => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = importers(modulePath)
    Vue.component(moduleName, value.default)
  })

  // tag
  const tags = require.context('./Tag', true, /\.vue$/i)
  tags.keys().forEach(modulePath => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = tags(modulePath)
    Vue.component(moduleName, value.default)
  })
}

export default instance
