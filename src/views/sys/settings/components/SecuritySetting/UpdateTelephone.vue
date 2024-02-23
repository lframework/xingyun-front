<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改联系电话"
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
        <a-form-item label="联系电话" name="newTelephone">
          <a-input v-model:value="formData.newTelephone" />
        </a-form-item>
        <a-form-item label="确认联系电话" name="confirmTelephone">
          <a-input v-model:value="formData.confirmTelephone" />
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
  import { isTelephone } from '@/utils/validate';
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
          newTelephone: [
            { required: true, message: '请输入联系电话' },
            { validator: this.validTelephone },
          ],
          confirmTelephone: [
            { required: true, message: '请输入确认联系电话' },
            { validator: this.validConfirmTelephone },
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
      validTelephone(rule, value) {
        if (this.$utils.isEmpty(value)) {
          return Promise.resolve();
        }

        if (isTelephone(value)) {
          if (!this.$utils.isEmpty(this.formData.confirmTelephone)) {
            if (value !== this.formData.confirmTelephone) {
              return Promise.reject('两次联系电话输入不一致');
            }
          }
        } else {
          return Promise.reject('联系电话格式不正确');
        }

        return Promise.resolve();
      },
      validConfirmTelephone(rule, value) {
        if (this.$utils.isEmpty(value)) {
          return Promise.resolve();
        }

        if (isTelephone(value)) {
          if (!this.$utils.isEmpty(this.formData.newTelephone)) {
            if (value !== this.formData.newTelephone) {
              return Promise.reject('两次联系电话输入不一致');
            }
          }
        } else {
          return Promise.reject('联系电话格式不正确');
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
          newTelephone: '',
          confirmTelephone: '',
        };
      },
      // 提交表单事件
      submitEvent() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .updateTelephone(this.formData)
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
