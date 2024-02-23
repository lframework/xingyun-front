<template>
  <div class="simple-app-container">
    <div v-permission="['retail:config:modify']">
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
              <j-border title="零售出库单设置" class="m-2">
                <a-form-item label="零售出库单上的会员是否必填" name="retailOutSheetRequireMember">
                  <a-select v-model:value="formData.retailOutSheetRequireMember" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="零售出库单是否需要发货" name="retailOutSheetRequireLogistics">
                  <a-select v-model:value="formData.retailOutSheetRequireLogistics" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
              </j-border>
              <j-border title="零售出库单设置" class="m-2">
                <a-form-item label="零售退货单上的会员是否必填" name="retailReturnRequireMember">
                  <a-select v-model:value="formData.retailReturnRequireMember" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="零售退货单是否关联零售出库单" name="retailReturnRequireOutStock">
                  <a-select v-model:value="formData.retailReturnRequireOutStock" placeholder="">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="零售退货单是否多次关联零售出库单"
                  name="retailReturnMultipleRelateOutStock"
                >
                  <a-select
                    v-model:value="formData.retailReturnMultipleRelateOutStock"
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
  import * as api from '@/api/sc/retail/config';

  export default defineComponent({
    name: 'RetailConfig',
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
