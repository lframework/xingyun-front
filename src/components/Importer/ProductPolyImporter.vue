<template>
  <div>
    <excel-importer ref="importer" :tip-msg="'如果商品货号不存在，那么就新增商品SPU；如果商品货号已经存在，那么就修改商品SPU。\n注：\n1、无论是新增还是修改商品SPU，类目编号都需要填写。\n2、销售属性组编号在修改商品SPU时可以不填写。\n3、销售属性组编号和类目编号只有在新增商品SPU时生效。'" :download-template-url="downloadTemplate" :upload-url="upload" @confirm="e => $emit('confirm', e)" />
  </div>
</template>

<script>
import ExcelImporter from '@/components/ExcelImporter'
import { request } from '@/utils/request'
export default {
  name: 'ProductPolyImporter',
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
        url: '/basedata/product/poly/import/template',
        method: 'get',
        responseType: 'blob'
      })
    },
    upload(params) {
      return request({
        url: '/basedata/product/poly/import',
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
