<template>
  <div class="app-card-container">
    <div v-permission="['sale:config:modify']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <vxe-form
              border
              title-background
              title-width="220"
              ref="form"
              :data="formData"
              :rules="rules"
            >
              <vxe-form-group span="24" title="销售出库单设置" title-bold vertical>
                <vxe-form-item
                  title="销售出库单是否关联销售订单"
                  field="outStockRequireSale"
                  span="24"
                >
                  <a-select v-model:value="formData.outStockRequireSale" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="销售出库单是否多次关联销售订单"
                  field="outStockMultipleRelateSale"
                  span="24"
                >
                  <a-select v-model:value="formData.outStockMultipleRelateSale" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="销售出库单是否关联物流单"
                  field="outStockRequireLogistics"
                  span="24"
                >
                  <a-select v-model:value="formData.outStockRequireLogistics" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
              </vxe-form-group>
              <vxe-form-group span="24" title="销售退货单设置" title-bold vertical>
                <vxe-form-item
                  title="销售退货单是否关联销售出库单"
                  field="saleReturnRequireOutStock"
                  span="24"
                >
                  <a-select v-model:value="formData.saleReturnRequireOutStock" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="销售退货单是否多次关联销售出库单"
                  field="saleReturnMultipleRelateOutStock"
                  span="24"
                >
                  <a-select v-model:value="formData.saleReturnMultipleRelateOutStock" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
              </vxe-form-group>
              <vxe-form-item span="24">
                <div class="form-modal-footer">
                  <a-space>
                    <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
                      >保存</a-button
                    >
                    <a-button :loading="loading" @click="close">取消</a-button>
                  </a-space>
                </div>
              </vxe-form-item>
            </vxe-form>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/sale/config';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import { createSuccess } from '@/hooks/web/msg';

  export default defineComponent({
    name: 'SaleConfig',
    // 使用组件
    components: {},
    mixins: [multiplePageMix],

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
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            api
              .update(this.formData)
              .then(() => {
                createSuccess('修改成功！');
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      close() {
        this.closeCurrentPage();
      },
    },
  });
</script>
