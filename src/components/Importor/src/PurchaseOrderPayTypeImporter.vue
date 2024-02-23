<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="
        '注：\n1、状态为“' +
        $enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.desc +
        '”的单据不允许导入。\n2、对于相同的约定支付不会合并。\n3、支付金额为0的约定支付不允许导入。'
      "
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
    name: 'PurchaseOrderPayTypeImporter',
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
        return api.downloadImportPayTypeTemplate();
      },
      upload(params) {
        return api.importPayTypeExcel(params);
      },
    },
  });
</script>

<style lang="less"></style>
