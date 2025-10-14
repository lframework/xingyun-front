<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="'\n注：\n1、每个业务单据只可以关联一个物流单。\n2、寄件人、收件人的省市区文字请参考地址库中的地区选择。'"
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
    name: 'LogisticsSheetImporter',
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
