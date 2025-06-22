<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="500px"
    :title="_title"
    :style="{ top: '20px' }"
  >
    <div v-if="visible">
      <a-form
        ref="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="说明" name="message">
          <a-textarea v-model:value.trim="formData.message" max-length="200" allow-clear />
        </a-form-item>
        <a-form-item v-if="!$utils.isEmpty(_messageList)" label="快捷说明">
          <a-tag
            v-for="(item, index) in _messageList"
            class="cursor-pointer"
            :key="index"
            @click="() => (formData.message += item)"
            >{{ item }}</a-tag
          >
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <div style="text-align: center">
        <a-button type="primary" :loading="loading" @click="submit">确定</a-button>
        <a-button :loading="loading" @click="closeDialog">关闭</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {},
    props: {
      approveType: {
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
          message: [{ required: true, message: '请输入说明' }],
        },
      };
    },
    computed: {
      _title() {
        if ('pass' === this.approveType) {
          return '通过';
        } else if ('refuse' === this.approveType) {
          return '退回';
        } else if ('undo' === this.approveType) {
          return '撤回';
        } else {
          return '';
        }
      },
      _messageList() {
        if ('pass' === this.approveType) {
          return ['同意', '通过', '收到'];
        } else if ('refuse' === this.approveType) {
          return ['退回', '拒绝', '拒绝通过'];
        } else if ('undo' === this.approveType) {
          return ['填写错误，需撤回', '重新发起', '撤回'];
        } else if ('reject' === this.approveType) {
          return ['反对'];
        } else {
          return [];
        }
      },
    },
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
          message: '',
        };
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      // 提交
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.$emit('confirm', {
              message: this.formData.message,
              approveType: this.approveType,
            });
            this.closeDialog();
          }
        });
      },
    },
  });
</script>
<style></style>
