<template>
  <div class="app-card-container">
    <div v-permission="['retail:config:modify']">
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
              <vxe-form-group span="24" title="零售出库单设置" title-bold vertical>
                <vxe-form-item
                  title="零售出库单上的会员是否必填"
                  field="retailOutSheetRequireMember"
                  span="24"
                >
                  <a-select v-model:value="formData.retailOutSheetRequireMember" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="零售出库单是否需要发货"
                  field="retailOutSheetRequireLogistics"
                  span="24"
                >
                  <a-select v-model:value="formData.retailOutSheetRequireLogistics" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
              </vxe-form-group>
              <vxe-form-group span="24" title="零售退货单设置" title-bold vertical>
                <vxe-form-item
                  title="零售退货单上的会员是否必填"
                  field="retailReturnRequireMember"
                  span="24"
                >
                  <a-select v-model:value="formData.retailReturnRequireMember" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="零售退货单是否关联零售出库单"
                  field="retailReturnRequireOutStock"
                  span="24"
                >
                  <a-select v-model:value="formData.retailReturnRequireOutStock" allow-clear>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="零售退货单是否多次关联零售出库单"
                  field="retailReturnMultipleRelateOutStock"
                  span="24"
                >
                  <a-select v-model:value="formData.retailReturnMultipleRelateOutStock" allow-clear>
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
  import * as api from '@/api/sc/retail/config';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import { createSuccess } from '@/hooks/web/msg';

  export default defineComponent({
    name: 'RetailConfig',
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
          retailOutSheetRequireMember: [
            { required: true, message: '请选择零售出库单上的会员是否必填' },
          ],
          retailReturnRequireMember: [
            { required: true, message: '请选择零售退货单上的会员是否必填' },
          ],
          retailReturnRequireOutStock: [
            { required: true, message: '请选择零售退货单是否关联零售出库单' },
          ],
          retailReturnMultipleRelateOutStock: [
            { required: true, message: '请选择零售退货单是否多次关联零售出库单' },
          ],
          retailOutSheetRequireLogistics: [
            { required: true, message: '请选择零售出库单是否需要发货' },
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
          retailOutSheetRequireMember: '',
          retailReturnRequireMember: '',
          retailReturnRequireOutStock: '',
          retailReturnMultipleRelateOutStock: '',
          retailOutSheetRequireLogistics: '',
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
