<template>
  <div>
    <excel-importer ref="importer" :tip-msg="'\n注：\n1、每个业务单据只可以关联一个物流单。\n2、寄件人、收件人的省市区文字请参考地址库中的地区选择。'" :download-template-url="downloadTemplate" :upload-url="upload" @confirm="e => $emit('confirm', e)" />
  </div>
</template>

<script>
import ExcelImporter from '@/components/ExcelImporter'
import { request } from '@/utils/request'
export default {
  name: 'LogisticsSheetImporter',
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
        url: '/logistics/sheet/import/template',
        region: 'cloud-api',
        method: 'get',
        responseType: 'blob'
      })
    },
    upload(params) {
      return request({
        url: '/logistics/sheet/import',
        region: 'cloud-api',
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
