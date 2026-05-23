<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:product:brand:modify']" v-loading="loading">
      <vxe-form
        border
        title-background
        title-width="120"
        ref="form"
        :data="formData"
        :rules="rules"
      >
        <vxe-form-group span="24" title="基础信息" title-bold vertical>
          <vxe-form-item title="编号" field="code" span="12">
            <a-input v-model:value.trim="formData.code" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="名称" field="name" span="12">
            <a-input v-model:value.trim="formData.name" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="简称" field="shortName" span="12">
            <a-input v-model:value.trim="formData.shortName" allow-clear />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="扩展信息" title-bold vertical>
          <vxe-form-item title="Logo" field="logo" span="24">
            <image-upload
              v-model:value="formData.logo"
              :api="uploadBrandLogo"
              accept="image/png, image/jpeg, image/bmp, image/jpg, image/gif"
              :file-type="['image/png', 'image/jpeg', 'image/bmp', 'image/jpg', 'image/gif']"
              :max-size="2"
            />
          </vxe-form-item>
          <vxe-form-item title="简介" field="introduction" span="24">
            <a-textarea v-model:value.trim="formData.introduction" />
          </vxe-form-item>
          <vxe-form-item title="备注" field="description" span="24">
            <a-textarea v-model:value.trim="formData.description" />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-item span="24">
          <div class="form-modal-footer">
            <a-space>
              <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
                >保存</a-button
              >
              <a-button :loading="loading" @click="closeDialog">取消</a-button>
            </a-space>
          </div>
        </vxe-form-item>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/base-data/product/brand';
  import { uploadImage } from '@/api/components';
  import { createSuccess } from '@/hooks/web/msg';
  import { ImageUpload } from '@/components/Form';

  export default defineComponent({
    // 使用组件
    components: { ImageUpload },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {};
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
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入名称' }],
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
          code: '',
          name: '',
          shortName: '',
          logo: '',
          introduction: '',
          description: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            api
              .update(this.formData)
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
      loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      uploadBrandLogo({ file }) {
        return uploadImage(file.originFileObj || file);
      },
    },
  });
</script>
