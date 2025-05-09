<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="50%"
    title="编辑示例数据"
    :body-style="{ padding: '0 0 10px 0' }"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <code-editor v-model:value="formData" bordered />

      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
            >确定</a-button
          >
          <a-button :loading="loading" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/print-template';
  import { CodeEditor } from '@/components/CodeEditor';

  export default defineComponent({
    components: {
      CodeEditor,
    },
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
        formData: '',
      };
    },
    computed: {},
    mounted() {},
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
        this.formData = '';
      },
      // 页面显示时由父页面触发
      async open() {
        // 初始化表单数据
        this.initFormData();

        this.loading = true;
        try {
          const { demoData } = await api.getSetting(this.id);
          this.formData = JSON.stringify(demoData || {});
        } finally {
          this.loading = false;
        }
      },
      submit() {
        this.loading = true;
        api
          .updateDemoData({
            id: this.id,
            demoData: this.formData,
          })
          .then(() => {
            this.$msg.createSuccess('保存成功！');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style lang="less" scoped></style>
