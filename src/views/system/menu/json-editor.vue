<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="50%"
    title="编辑参数"
    :body-style="{ padding: '0 0 10px 0' }"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <div v-if="!isEmpty(description)" style="padding: 10px 10px 5px">
        <a-alert message="注意事项" :description="description" type="warning" show-icon />
      </div>

      <div class="json-editor">
        <code-editor v-model:value="editorValue" bordered />
      </div>

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
  import { CodeEditor } from '@/components/CodeEditor';
  import { isEmpty } from '@/utils/utils';
  import { createError } from '@/hooks/web/msg';

  export default defineComponent({
    components: {
      CodeEditor,
    },
    props: {
      value: {
        type: String,
        required: true,
      },
      mode: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        isEmpty,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        editorValue: '',
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
      initFormData() {},
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();
        this.editorValue = this.value || '';
      },
      submit() {
        const value = this.editorValue;
        if (!isEmpty(value)) {
          try {
            JSON.parse(value);
          } catch (e) {
            createError('参数应为对象的json字符串，如：{"name": "名称"}');
            return;
          }
        }

        this.$emit('update:value', this.editorValue);
        this.closeDialog();
      },
    },
  });
</script>
<style lang="less" scoped>
  .json-editor {
    height: 420px;
    border: 1px solid #d9d9d9;
  }
</style>
