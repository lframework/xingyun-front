<template>
  <div class="simple-app-container">
    <div v-permission="['sale:config:modify']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <a-form
              ref="form"
              :label-col="{ span: 10 }"
              :wrapper-col="{ span: 8 }"
              :model="formData"
              :rules="rules"
            >
              <j-border title="销售出库单设置" class="m-2">
                <a-form-item label="销售出库单是否关联销售订单" name="outStockRequireSale">
                  <a-select v-model:value="formData.outStockRequireSale" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="销售出库单是否多次关联销售订单"
                  name="outStockMultipleRelateSale"
                >
                  <a-select v-model:value="formData.outStockMultipleRelateSale" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="销售出库单是否关联物流单" name="outStockRequireLogistics">
                  <a-select v-model:value="formData.outStockRequireLogistics" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
              </j-border>
              <j-border title="销售退货单设置" class="m-2">
                <a-form-item label="销售退货单是否关联销售出库单" name="saleReturnRequireOutStock">
                  <a-select v-model:value="formData.saleReturnRequireOutStock" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="销售退货单是否多次关联销售出库单"
                  name="saleReturnMultipleRelateOutStock"
                >
                  <a-select
                    v-model:value="formData.saleReturnMultipleRelateOutStock"
                    placeholder=""
                  >
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
              </j-border>
            </a-form>
            <div class="form-modal-footer">
              <a-space>
                <a-button type="primary" :loading="loading" @click="submit">保存</a-button>
                <a-button :loading="loading" @click="close">取消</a-button>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/sale/config';

  export default defineComponent({
    name: 'SaleConfig',
    // 使用组件
    components: {},

    props: {},
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          outStockRequireSale: [{ required: true, message: '请选择销售出库单是否关联销售订单' }],
          outStockMultipleRelateSale: [
            { required: true, message: '请选择销售出库单是否多次关联销售订单' },
          ],
          saleReturnRequireOutStock: [
            { required: true, message: '请选择销售退货单是否关联销售出库单' },
          ],
          saleReturnMultipleRelateOutStock: [
            { required: true, message: '请选择销售退货单是否多次关联销售出库单' },
          ],
          outStockRequireLogistics: [{ required: true, message: '请选择销售出库单是否关联物流单' }],
        },
      };
    },
    created() {
      this.initFormData();

      // 查询数据
      this.loadFormData();
    },
    methods: {
      // 初始化表单数据
      initFormData() {
        this.formData = {
          outStockRequireSale: '',
          outStockMultipleRelateSale: '',
          saleReturnRequireOutStock: '',
          saleReturnMultipleRelateOutStock: '',
          outStockRequireLogistics: '',
        };
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .get()
          .then((data) => {
            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .update(this.formData)
              .then(() => {
                this.$msg.createSuccess('修改成功！');
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      close() {
        this.$utils.closeCurrentPage();
      },
    },
  });
</script>
