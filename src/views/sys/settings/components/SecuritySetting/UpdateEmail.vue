<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改电子邮箱"
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
        <a-form-item label="新邮箱地址" name="newEmail">
          <a-input v-model:value="formData.newEmail" />
        </a-form-item>
        <a-form-item label="确认邮箱地址" name="confirmEmail">
          <a-input v-model:value="formData.confirmEmail" />
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
  import { isEmail } from '@/utils/validate';
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
          newEmail: [
            { required: true, message: '请输入新邮箱地址' },
            { validator: this.validEmail },
          ],
          confirmEmail: [
            { required: true, message: '请输入确认邮箱地址' },
            { validator: this.validConfirmEmail },
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
      validEmail(rule, value) {
        if (this.$utils.isEmpty(value)) {
          return Promise.resolve();
        }

        if (isEmail(value)) {
          if (!this.$utils.isEmpty(this.formData.confirmEmail)) {
            if (value !== this.formData.confirmEmail) {
              return Promise.reject('两次邮箱地址输入不一致');
            }
          }
        } else {
          return Promise.reject('邮箱地址格式不正确');
        }

        return Promise.resolve();
      },
      validConfirmEmail(rule, value) {
        if (this.$utils.isEmpty(value)) {
          return Promise.resolve();
        }

        if (isEmail(value)) {
          if (!this.$utils.isEmpty(this.formData.newEmail)) {
            if (value !== this.formData.newEmail) {
              return Promise.reject('两次邮箱地址输入不一致');
            }
          }
        } else {
          return Promise.reject('邮箱地址格式不正确');
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
          newEmail: '',
          confirmEmail: '',
        };
      },
      // 提交表单事件
      submitEvent() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .updateEmail(this.formData)
              .then((res) => {
                this.$msg.createSuccess('修改成功！');
                this.$emit('confirm');
                this.closeDialog();
              })
              .finally(() => {
                this.loading = false;
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
