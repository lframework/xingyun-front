<template>
  <div>
    <excel-importer ref="importer" :tip-msg="'\n注：\n1、实体类型填写：' + $enums.ADDRESS_ENTITY_TYPE.values().map(item => item.desc).join('、') + '。\n2、地址类型填写：' + $enums.ADDRESS_TYPE.values().map(item => item.desc).join('、') + '。\n3、地区的格式为：省/市/区（县），例如：北京市/市辖区/朝阳区。文字请参考新增或修改功能中的地区选择。\n4、是否默认地址填写：是、否。'" :download-template-url="downloadTemplate" :upload-url="upload" @confirm="e => $emit('confirm', e)" />
  </div>
</template>

<script>
import ExcelImporter from '@/components/ExcelImporter'
import { request } from '@/utils/request'
export default {
  name: 'AddressImporter',
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
        url: '/basedata/address/import/template',
        region: 'basedata-api',
        method: 'get',
        responseType: 'blob'
      })
    },
    upload(params) {
      return request({
        url: '/basedata/address/import',
        region: 'basedata-api',
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
