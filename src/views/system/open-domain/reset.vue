<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="重置密钥"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:open-domain:config']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="ID" name="id">
          <a-input v-model:value.trim="formData.id" readonly />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value.trim="formData.name" readonly />
        </a-form-item>
        <a-form-item label="Api密钥" name="apiSecret">
          <no-wrap>
            <a-input v-model:value.trim="apiSecret" readonly />
            <a-button type="link" @click="generateApiSecret">点此重置</a-button>
          </no-wrap>
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
  import * as api from '@/api/system/open-domain';

  export default defineComponent({
    // 使用组件
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
        apiSecret: '',
        // 表单校验规则
        rules: {
          apiSecret: [{ required: true, message: '请重置密钥' }],
        },
      };
    },
    created() {
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.open();
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {};
        this.apiSecret = '';
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .updateSecret(this.formData)
              .then(() => {
                this.$msg.createSuccess('重置成功！');
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
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;
            this.apiSecret = this.formData.apiSecret;
            this.formData.apiSecret = '';
          })
          .finally(() => {
            this.loading = false;
          });
      },
      generateApiSecret() {
        this.formData.apiSecret = this.$utils.uuid().toUpperCase();
        this.apiSecret = this.formData.apiSecret;
      },
    },
  });
</script>
