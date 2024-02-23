<template>
  <div class="simple-app-container">
    <div v-permission="['purchase:config:modify']">
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
              <j-border class="m-2" title="采购收货设置">
                <a-form-item label="采购收货单是否关联采购订单" name="receiveRequirePurchase">
                  <a-select v-model:value="formData.receiveRequirePurchase" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="采购收货单是否多次关联采购订单"
                  name="receiveMultipleRelatePurchase"
                >
                  <a-select v-model:value="formData.receiveMultipleRelatePurchase" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
              </j-border>
              <j-border class="m-2" title="采购退货设置">
                <a-form-item label="采购退货单是否关联采购收货单" name="purchaseReturnRequireReceive">
                  <a-select v-model:value="formData.purchaseReturnRequireReceive" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="采购退货单是否多次关联采购收货单"
                  name="purchaseReturnMultipleRelateReceive"
                >
                  <a-select
                    v-model:value="formData.purchaseReturnMultipleRelateReceive"
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
  import * as api from '@/api/sc/purchase/config';

  export default defineComponent({
    name: 'PurchaseConfig',
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
          receiveRequirePurchase: [{ required: true, message: '请选择采购收货单是否关联采购订单' }],
          receiveMultipleRelatePurchase: [
            { required: true, message: '请选择采购收货单是否多次关联采购订单' },
          ],
          purchaseReturnRequireReceive: [
            { required: true, message: '请选择采购退货单是否关联采购收货单' },
          ],
          purchaseReturnMultipleRelateReceive: [
            { required: true, message: '请选择采购退货单是否多次关联采购收货单' },
          ],
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
          receiveRequirePurchase: '',
          receiveMultipleRelatePurchase: '',
          purchaseReturnRequireReceive: '',
          purchaseReturnMultipleRelateReceive: '',
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
