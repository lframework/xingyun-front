<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="'导入只支持新增客户信息。\n注：\n1、地区的格式为：省/市/区（县），例如：北京市/市辖区/朝阳区。文字请参考新增或修改功能中的地区选择。\n2、结账方式只是在新增时生效。'"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      @confirm="(e) => $emit('confirm', e)"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/base-data/customer';

  export default defineComponent({
    name: 'CustomerImporter',
    components: { ExcelImporter },
    data() {
      return {};
    },
    computed: {},
    methods: {
      openDialog() {
        this.$refs.importer.openDialog();
      },
      downloadTemplate() {
        return api.downloadImportTemplate();
      },
      upload(params) {
        return api.importExcel(params);
      },
    },
  });
</script>

<style lang="less"></style>
