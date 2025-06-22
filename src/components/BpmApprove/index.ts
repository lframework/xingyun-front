import BpmApprove from './src/BpmApprove.vue';
import BpmApproveHis from './src/ApproveHis.vue'

// 自定义业务组件
import PurchaseOrderViewer from '@/views/sc/purchase/order/viewer.vue';

const install = function (Vue) {
  Vue.component('BpmApprove', BpmApprove);
  Vue.component('BpmApproveHis', BpmApproveHis);
  // 系统功能自定义组件
  Vue.component('PurchaseOrderViewer', PurchaseOrderViewer);
};
export default {
  install,
};
