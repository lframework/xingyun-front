<template>
  <div>
    <excel-importer
      ref="importer"
      :tip-msg="'导入支持新增商品销售属性，并可为已有商品销售属性追加属性值。\n注：\n1、导入不会修改已有属性或属性值。\n2、同一属性编号的属性名称必须保持一致。'"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      @confirm="(e) => $emit('confirm', e)"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/base-data/product/sale-property';

  export default defineComponent({
    name: 'ProductSalePropertyImporter',
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
