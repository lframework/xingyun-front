<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="500px"
    title="审核拒绝"
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
        <a-form-item label="拒绝理由" name="refuseReason">
          <a-textarea v-model:value.trim="formData.refuseReason" max-length="200" allow-clear />
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
          refuseReason: [{ required: true, message: '请输入拒绝理由' }],
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
          refuseReason: '',
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
            this.$emit('confirm', this.formData.refuseReason);
            this.closeDialog();
          }
        });
      },
    },
  });
</script>
<style></style>
