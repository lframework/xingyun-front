<template>
  <div>
    <excel-importer
      ref="importer"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      @confirm="(e) => $emit('confirm', e)"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/base-data/stock-cell-product';

  export default defineComponent({
    name: 'StockCellProductImporter',
    components: { ExcelImporter },
    data() {
      return {
        formData: {},
      };
    },
    computed: {},
    created() {
      this.initFormData();
    },
    methods: {
      initFormData() {
        this.formData = {};
      },
      openDialog() {
        this.initFormData();
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
