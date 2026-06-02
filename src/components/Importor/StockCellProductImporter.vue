<template>
  <div>
    <excel-importer
      ref="importer"
      :form-data="formData"
      :download-template-url="downloadTemplate"
      :upload-url="upload"
      :before-upload="beforeUpload"
      @confirm="(e) => $emit('confirm', e)"
    >
      <template #form>
        <j-form bordered label-width="160px">
          <j-form-item :span="24" label="是否自动创建仓位" required>
            <a-radio-group v-model:value="formData.autoCreateStockCell">
              <a-radio :value="false">否</a-radio>
              <a-radio :value="true">是</a-radio>
            </a-radio-group>
          </j-form-item>
          <j-form-item :span="24" v-if="formData.autoCreateStockCell" label="仓位类别" required>
            <a-radio-group v-model:value="formData.stockCellType">
              <a-radio v-for="item in STOCK_CELL_TYPE.values()" :key="item.code" :value="item.code">
                {{ item.desc }}</a-radio
              >
            </a-radio-group>
          </j-form-item>
        </j-form>
      </template>
    </excel-importer>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ExcelImporter from '@/components/ExcelImporter';
  import * as api from '@/api/base-data/stock-cell-product';
  import { STOCK_CELL_TYPE } from '@/enums/biz/stockCellType';
  import { createError } from '@/hooks/web/msg';
  import { isEmpty } from '@/utils/utils';

  export default defineComponent({
    name: 'StockCellProductImporter',
    components: { ExcelImporter },
    setup() {
      return {
        STOCK_CELL_TYPE,
      };
    },
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
        this.formData = {
          autoCreateStockCell: false,
          stockCellType: undefined,
        };
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
      beforeUpload() {
        if (this.formData.autoCreateStockCell && isEmpty(this.formData.stockCellType)) {
          createError('请选择仓位类别！');
          return false;
        }

        return true;
      },
    },
  });
</script>

<style lang="less"></style>
