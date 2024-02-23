<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改密码"
    :style="{ top: '20px' }"
  >
    <div v-if="visible">
      <a-form
        ref="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="旧密码" name="oldPsw">
          <a-input-password v-model:value="formData.oldPsw" />
        </a-form-item>
        <a-form-item label="新密码" name="newPsw">
          <a-input-password v-model:value="formData.newPsw" />
        </a-form-item>
        <a-form-item label="确认密码" name="confirmPsw">
          <a-input-password v-model:value="formData.confirmPsw" />
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" @click="submitEvent">保存</a-button>
          <a-button :loading="loading" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import { isPassword } from '@/utils/validate';
  import * as api from '@/api/sys/center';

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
          oldPsw: [{ required: true, message: '请输入旧密码' }, { validator: this.validOldPsw }],
          newPsw: [{ required: true, message: '请输入新密码' }, { validator: this.validNewPsw }],
          confirmPsw: [
            { required: true, message: '请输入确认密码' },
            { validator: this.validConfirmPsw },
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
      validOldPsw(rule, value) {
        if (this.$utils.isEmpty(value)) {
          return Promise.resolve();
        }

        if (!isPassword(value)) {
          return Promise.reject('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线');
        }

        return Promise.resolve();
      },
      validNewPsw(rule, value) {
        if (this.$utils.isEmpty(value)) {
          return Promise.resolve();
        }

        if (isPassword(value)) {
          if (!this.$utils.isEmpty(this.formData.confirmPsw)) {
            if (value !== this.formData.confirmPsw) {
              return Promise.reject('两次密码输入不一致');
            }
          }
        } else {
          return Promise.reject('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线');
        }

        return Promise.resolve();
      },
      validConfirmPsw(rule, value) {
        if (this.$utils.isEmpty(value)) {
          return Promise.resolve();
        }

        if (isPassword(value)) {
          if (!this.$utils.isEmpty(this.formData.newPsw)) {
            if (value !== this.formData.newPsw) {
              return Promise.reject('两次密码输入不一致');
            }
          }
        } else {
          return Promise.reject('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线');
        }

        return Promise.resolve();
      },
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
          oldPsw: '',
          newPsw: '',
          confirmPsw: '',
        };
      },
      // 提交表单事件
      submitEvent() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.$msg.createConfirm('是否确认修改密码？注：修改密码后需要重新登录').then(() => {
              this.loading = true;
              api
                .updatePassword(this.formData)
                .then((res) => {
                  this.$emit('confirm');
                  this.closeDialog();
                })
                .finally(() => {
                  this.loading = false;
                });
            });
          }
        });
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
    },
  });
</script>
