<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="'导入后会根据仓库编号、供应商编号、采购员编号、预计到货日期进行分组生成采购订单。\n注：\n1、预计到货日期如果为空，那么就按当前时间进行生成。\n2、“是否赠品”只能填“是”或“否”。\n3、单据备注指的是采购单的备注，单据备注以分组后的第一条备注为准。\n4、单据明细备注指的是每行商品的备注。\n5、“是否赠品”为“是”时，“采购价格”无论填不填都会填充0。'"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      @confirm="(e) => $emit('confirm', e)"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/sc/purchase/order';

  export default defineComponent({
    name: 'PurchaseOrderImporter',
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
