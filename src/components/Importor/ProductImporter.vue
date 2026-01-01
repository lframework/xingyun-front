<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="'导入只支持新增商品信息。\n注：1、只支持导入普通商品。\n2、导入多个扩展编号，用英文逗号隔开。'"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      @confirm="(e) => $emit('confirm', e)"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/base-data/product/info';

  export default defineComponent({
    name: 'ProductImporter',
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
