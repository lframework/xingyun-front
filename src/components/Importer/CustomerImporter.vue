<template>
  <div>
    <excel-importer ref="importer" tip-msg="如果编号不存在，那么就新增客户；如果编号已经存在，那么就修改客户。" :download-template-url="downloadTemplate" :upload-url="upload" @confirm="e => $emit('confirm', e)" />
  </div>
</template>

<script>
import ExcelImporter from '@/components/ExcelImporter'
import { request } from '@/utils/request'
export default {
  name: 'CustomerImporter',
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
        url: '/basedata/customer/import/template',
        method: 'get',
        responseType: 'blob'
      })
    },
    upload(params) {
      return request({
        url: '/basedata/customer/import',
        method: 'post',
        dataType: 'file',
        params: params
      })
    }
  }
}
</script>

<style lang="less">
</style>
