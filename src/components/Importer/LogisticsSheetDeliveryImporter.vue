<template>
  <div>
    <excel-importer ref="importer" :tip-msg="'\n注：\n1、物流单号、物流费如果不填则保留原有物流单的信息。\n2、物流单号、物流费如果填写则覆盖原有物流单的信息。'" :download-template-url="downloadTemplate" :upload-url="upload" @confirm="e => $emit('confirm', e)" />
  </div>
</template>

<script>
import ExcelImporter from '@/components/ExcelImporter'
import { request } from '@/utils/request'
export default {
  name: 'LogisticsSheetDeliveryImporter',
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
        url: '/logistics/sheet/import/template/delivery',
        region: 'sc-api',
        method: 'get',
        responseType: 'blob'
      })
    },
    upload(params) {
      return request({
        url: '/logistics/sheet/import/delivery',
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
