<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:parameter:modify']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="键" name="pmKey">
          <a-input v-model:value="formData.pmKey" disabled />
        </a-form-item>
        <a-form-item label="是否加密值" name="isEncrypt">
          <a-switch
            v-model:checked="formData.isEncrypt"
            checked-children="是"
            un-checked-children="否"
            disabled
          />
        </a-form-item>
        <a-form-item label="值" name="pmValue">
          <a-space v-if="formData.isEncrypt && !modifyPmValue">
            <span>{{ oriPmValue }}</span
            ><a @click="modifyPmValue = true">点此修改</a>
          </a-space>
          <a-textarea v-else v-model:value="formData.pmValue" allow-clear />
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-textarea v-model:value="formData.description" allow-clear />
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
  import * as api from '@/api/system/parameter';
  import { validKey } from './constants';
  import { createSuccess } from '@/hooks/web/msg';

  export default defineComponent({
    // 使用组件
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
      tenantId: {
        type: Number,
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
        oriPmValue: '',
        modifyPmValue: false,
        // 表单校验规则
        rules: {
          pmKey: [{ required: true, message: '请输入键' }, { validator: validKey }],
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
          pmKey: '',
          pmValue: '',
          isEncrypt: false,
          description: '',
        };
        this.oriPmValue = '';
        this.modifyPmValue = false;
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = {
              ...this.formData,
              tenantId: this.tenantId,
            };
            if (params.isEncrypt && !this.modifyPmValue) {
              params.pmValue = '';
            }
            delete params.isEncrypt;
            delete params.pmKey;
            api
              .update(params)
              .then(() => {
                createSuccess('修改成功！');
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
      async loadFormData() {
        this.loading = true;
        api
          .get(this.id, this.tenantId)
          .then((data) => {
            this.formData = Object.assign({}, data);
            this.oriPmValue = data.pmValue;
            if (data.isEncrypt) {
              this.formData.pmValue = '';
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
