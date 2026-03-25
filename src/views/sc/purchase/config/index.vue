<template>
  <div class="app-card-container">
    <div v-permission="['purchase:config:modify']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <vxe-form
              border
              title-background
              title-width="240"
              ref="form"
              :data="formData"
              :rules="rules"
            >
              <vxe-form-group span="24" title="采购订单设置" title-bold vertical>
                <vxe-form-item
                  title="采购订单是否开启审批流程"
                  field="purchaseRequireBpm"
                  span="24"
                >
                  <a-select v-model:value="formData.purchaseRequireBpm" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  :visible="formData.purchaseRequireBpm"
                  title="审批流程"
                  field="purchaseBpmProcessId"
                  span="24"
                >
                  <flow-definition-selector v-model:value="formData.purchaseBpmProcessId" />
                </vxe-form-item>
              </vxe-form-group>
              <vxe-form-group span="24" title="采购收货设置" title-bold vertical>
                <vxe-form-item
                  title="采购收货单是否关联采购订单"
                  field="receiveRequirePurchase"
                  span="24"
                >
                  <a-select v-model:value="formData.receiveRequirePurchase" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="采购收货单是否多次关联采购订单"
                  field="receiveMultipleRelatePurchase"
                  span="24"
                >
                  <a-select v-model:value="formData.receiveMultipleRelatePurchase" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
              </vxe-form-group>
              <vxe-form-group span="24" title="采购退货设置" title-bold vertical>
                <vxe-form-item
                  title="采购退货单是否关联采购收货单"
                  field="purchaseReturnRequireReceive"
                  span="24"
                >
                  <a-select v-model:value="formData.purchaseReturnRequireReceive" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="采购退货单是否多次关联采购收货单"
                  field="purchaseReturnMultipleRelateReceive"
                  span="24"
                >
                  <a-select
                    v-model:value="formData.purchaseReturnMultipleRelateReceive"
                    placeholder=""
                  >
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
              </vxe-form-group>
              <vxe-form-item span="24">
                <div class="form-modal-footer">
                  <a-space>
                    <a-button type="primary" :loading="loading" @click="submit">保存</a-button>
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
  import * as api from '@/api/sc/purchase/config';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import { createSuccess } from '@/hooks/web/msg';
  import FlowDefinitionSelector from '@/components/Selector/FlowDefinitionSelector.vue';

  export default defineComponent({
    name: 'PurchaseConfig',
    // 使用组件
    components: {
      FlowDefinitionSelector,
    },
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
          purchaseRequireBpm: [{ required: true, message: '请选择采购订单是否开启审批流程' }],
          purchaseBpmProcessId: [
            {
              validator({ itemValue, data }) {
                if (!data.purchaseRequireBpm || itemValue) {
                  return;
                }

                return new Error('请选择审批流程');
              },
            },
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
          purchaseRequireBpm: '',
          purchaseBpmProcessId: '',
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
