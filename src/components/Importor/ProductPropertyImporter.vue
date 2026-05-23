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
  import * as api from '@/api/base-data/product/property';
  import { COLUMN_TYPE } from '@/enums/biz/columnType';

  export default defineComponent({
    name: 'ProductPropertyImporter',
    components: { ExcelImporter },
    data() {
      return {};
    },
    computed: {
      columnTypeImportText() {
        const descList = COLUMN_TYPE.values().map((item) => `“${item.desc}”`);

        if (descList.length <= 1) {
          return descList.join('');
        }

        return `${descList.slice(0, -1).join('、')}或${descList[descList.length - 1]}`;
      },
      customColumnTypeText() {
        return `“${COLUMN_TYPE.CUSTOM.desc}”`;
      },
      tipMsg() {
        return `导入支持新增商品分类属性，并可为已有商品分类属性追加属性值。\n注：\n1、导入不会修改已有属性或属性值。\n2、是否必填只能填写“是”或“否”。\n3、字段类型只能填写${this.columnTypeImportText}。\n4、同一属性编号的属性名称、是否必填、字段类型必须保持一致。\n5、字段类型为${this.customColumnTypeText}时不允许填写属性值。`;
      },
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
