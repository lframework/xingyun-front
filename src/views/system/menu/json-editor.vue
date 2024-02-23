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
      <div v-if="!$utils.isEmpty(description)" style="padding: 10px 10px 5px 10px">
        <a-alert message="注意事项" :description="description" type="warning" show-icon />
      </div>

      <textarea ref="editor"></textarea>

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
  import 'codemirror/lib/codemirror.css';
  import CodeMirror from 'codemirror/lib/codemirror';
  import 'codemirror/mode/javascript/javascript';

  export default defineComponent({
    components: {},
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
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        editor: null,
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

        this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
          mode: 'application/json',
          lineNumbers: true,
          tabSize: 2,
          lineWrapping: true,
        });

        this.editor.setValue(this.value || '');
      },
      submit() {
        const value = this.editor.getValue();
        if (!this.$utils.isEmpty(value)) {
          try {
            JSON.parse(value);
          } catch (e) {
            this.$msg.createError('参数应为对象的json字符串，如：{"name": "名称"}');
            return;
          }
        }

        this.$emit('update:value', this.editor.getValue());
        this.closeDialog();
      },
    },
  });
</script>
<style lang="less" scoped></style>
