<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="tipMsg"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      @confirm="(e) => $emit('confirm', e)"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/sc/stock/adjust/stock';

  export default defineComponent({
    name: 'StockAdjustSheetImporter',
    components: { ExcelImporter },
    emits: ['confirm'],
    data() {
      return {
        tipMsg:
          '导入支持新增库存调整单，导入后的单据为待审核状态。\n注：\n1、业务类型只能填写“入库”或“出库”。\n2、调整库存数量必须大于0，最多允许8位小数。\n3、相同仓库、业务类型、调整原因和单据备注会生成同一张单据。',
      };
    },
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
