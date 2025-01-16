<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading" v-permission="['stock:warning:add']">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="仓库" name="scId">
          <store-center-selector v-model:value="formData.scId" />
        </a-form-item>
        <a-form-item label="商品" name="productId">
          <product-selector v-model:value="formData.productId" />
        </a-form-item>
        <a-form-item label="预警上限" name="maxLimit">
          <a-input v-model:value="formData.maxLimit" class="number-input" allow-clear />
        </a-form-item>
        <a-form-item label="预警下限" name="minLimit">
          <a-input v-model:value="formData.minLimit" class="number-input" allow-clear />
        </a-form-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
              >保存</a-button
            >
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/stock/warning';

  export default defineComponent({
    components: {},
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          scId: [{ required: true, message: '请选择仓库' }],
          productId: [{ required: true, message: '请选择商品' }],
          minLimit: [
            { required: true, message: '请输入预警下限' },
            {
              validator: (rule, value) => {
                if (this.$utils.isEmpty(value)) {
                  return Promise.resolve();
                }
                if (!this.$utils.isInteger(value)) {
                  return Promise.reject('预警下限必须为整数');
                }
                if (!this.$utils.isIntegerGtZero(value)) {
                  return Promise.reject('预警下限必须大于0');
                }
                return Promise.resolve();
              },
            },
          ],
          maxLimit: [
            { required: true, message: '请输入预警上限' },
            {
              validator: (rule, value) => {
                if (this.$utils.isEmpty(value)) {
                  return Promise.resolve();
                }
                if (!this.$utils.isInteger(value)) {
                  return Promise.reject('预警上限必须为整数');
                }
                if (!this.$utils.isIntegerGtZero(value)) {
                  return Promise.reject('预警上限必须大于0');
                }
                if (
                  this.$utils.isIntegerGtZero(value) &&
                  this.$utils.isIntegerGtZero(this.formData.minLimit)
                ) {
                  if (Number(value) < Number(this.formData.minLimit)) {
                    return Promise.reject('预警上限必须大于预警下限');
                  }
                }
                return Promise.resolve();
              },
            },
          ],
        },
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          scId: '',
          productId: '',
          maxLimit: '',
          minLimit: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .create(this.formData)
              .then(() => {
                this.$msg.createSuccess('新增成功！');
                this.$emit('confirm');
                this.visible = false;
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
    },
  });
</script>
