import JForm from '@/components/JForm'
import JFormItem from '@/components/JFormItem'
import JBorder from '@/components/JBorder'
import OrderTimeLine from '@/components/OrderTimeLine'
import DataDicPicker from '@/components/DataDicPicker'
import CustomList from '@/components/CustomList'
import CustomSelector from '@/components/CustomSelector'
import CustomForm from '@/components/CustomForm'
import JEditor from '@/components/JEditor'
import JUpload from '@/components/JUpload'
import JImgUpload from '@/components/JImgUpload'
import SvgIcon from '@/components/SvgIcon'
import IconPicker from '@/components/IconPicker'
import CronPicker from '@/components/CronPicker'

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
  Vue.component('JEditor', JEditor)
  Vue.component('JUpload', JUpload)
  Vue.component('JImgUpload', JImgUpload)
  Vue.component('SvgIcon', SvgIcon)
  Vue.component('IconPicker', IconPicker)
  Vue.component('CronPicker', CronPicker)
}

export default instance
