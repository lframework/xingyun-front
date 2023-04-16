<template>
  <div>
    <excel-importer ref="importer" :tip-msg="'注：\n1、状态为“' + $enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.desc + '”的单据不允许导入。\n2、对于相同的支付方式不会合并。\n3、支付金额为0的支付方式不允许导入。'" :download-template-url="downloadTemplate" :upload-url="upload" @confirm="e => $emit('confirm', e)" />
  </div>
</template>

<script>
import ExcelImporter from '@/components/ExcelImporter'
import { request } from '@/utils/request'
export default {
  name: 'PurchaseOrderPayTypeImporter',
  components: { ExcelImporter },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    openDialog() {
      this.$refs.importer.openDialog()
    },
    downloadTemplate() {
      return request({
        url: '/purchase/order/import/template/paytype',
        region: 'sc-api',
        method: 'get',
        responseType: 'blob'
      })
    },
    upload(params) {
      return request({
        url: '/purchase/order/import/paytype',
        region: 'sc-api',
        method: 'post',
        dataType: 'file',
        data: params
      })
    }
  }
}
</script>

<style lang="less">
</style>
