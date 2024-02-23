<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="创建文件夹"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="文件夹名称" name="name">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-textarea v-model:value.trim="formData.description" />
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
  import * as api from '@/api/smart-work/file-box';

  export default defineComponent({
    components: {},
    props: {
      parentPath: {
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
          name: [
            { required: true, message: '请输入文件夹名称' },
            {
              validator: (rule, value) => {
                if (this.$utils.isEmpty(value)) {
                  return Promise.resolve();
                }

                if (!/^(?!^\.)[^/:*?"<>|\s].*$/.test(value)) {
                  return Promise.reject('文件夹名称不合法，请检查');
                }

                return Promise.resolve();
              },
            },
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
          code: '',
          description: '',
          name: '',
          shortName: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .createDir({
                name: this.formData.name,
                parentPath: this.parentPath,
              })
              .then(() => {
                this.$msg.createSuccess('创建成功！');
                // 初始化表单数据
                this.initFormData();
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
        // 初始化表单数据
        this.initFormData();
      },
    },
  });
</script>
