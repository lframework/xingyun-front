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
    name: 'StockCellProductByCellImporter',
    components: { ExcelImporter },
    props: {
      stockCellId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        formData: {},
      };
    },
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
        return api.downloadImportByCellTemplate();
      },
      upload(params) {
        return api.importExcelByCell({
          ...params,
          stockCellId: this.stockCellId,
        });
      },
    },
  });
</script>

<style lang="less"></style>
