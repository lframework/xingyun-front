<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="生成新版本"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="流程编号" name="code">
          <a-input v-model:value.trim="formData.code" disabled />
        </a-form-item>
        <a-form-item label="流程名称" name="name">
          <a-input v-model:value.trim="formData.name" />
        </a-form-item>
        <a-form-item label="流程分类" name="categoryId">
          <flow-category-selector v-model:value="formData.categoryId" only-final />
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
  import * as api from '@/api/bpm/flow/definition';
  import { validCode } from '@/utils/validate';

  export default defineComponent({
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },
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
          code: [{ required: true, message: '请输入流程编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入流程名称' }],
          categoryId: [{ required: true, message: '请选择流程分类' }],
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
          id: '',
          code: '',
          name: '',
          categoryId: '',
          categoryName: '',
        };
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();

        this.loadData();
      },
      loadData() {
        this.loading = true;
        api
          .detail(this.id)
          .then((res) => {
            this.formData = res;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .copy(this.formData)
              .then(() => {
                this.$msg.createSuccess('生成成功！');
                this.$emit('confirm');
                this.closeDialog();
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
    },
  });
</script>
