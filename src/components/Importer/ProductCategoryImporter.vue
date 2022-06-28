<template>
  <div>
    <excel-importer ref="importer" :tip-msg="'如果编号不存在，那么就新增类目；如果编号已经存在，那么就修改类目。\n注：\n1、类目是有上下级关系的，请按照先上级后下级的顺序写到Excel文件中。\n2、上级类目是不允许修改的。'" :download-template-url="downloadTemplate" :upload-url="upload" @confirm="e => $emit('confirm', e)" />
  </div>
</template>

<script>
import ExcelImporter from '@/components/ExcelImporter'
import { request } from '@/utils/request'
export default {
  name: 'ProductCategoryImporter',
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
        url: '/basedata/product/category/import/template',
        method: 'get',
        responseType: 'blob'
      })
    },
    upload(params) {
      return request({
        url: '/basedata/product/category/import',
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
