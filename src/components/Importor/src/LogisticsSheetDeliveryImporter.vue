<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="'\n注：\n1、物流单号、物流费如果不填则保留原有物流单的信息。\n2、物流单号、物流费如果填写则覆盖原有物流单的信息。'"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      @confirm="(e) => $emit('confirm', e)"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/sc/logistics/sheet';

  export default defineComponent({
    name: 'LogisticsSheetDeliveryImporter',
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
        return api.downloadDeliveryImportTemplate();
      },
      upload(params) {
        return api.deliveryImportExcel(params);
      },
    },
  });
</script>

<style lang="less"></style>
