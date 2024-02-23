<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="'导入只支持新增类目信息。\n注：\n1、类目是有上下级关系的，请按照先上级后下级的顺序写到Excel文件中。\n2、类目的上下级关系是不允许修改的。'"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      @confirm="(e) => $emit('confirm', e)"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/base-data/product/category';

  export default defineComponent({
    name: 'ProductCategoryImporter',
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
