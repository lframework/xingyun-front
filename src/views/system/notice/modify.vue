<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="80%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:notice:modify']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="标题" name="title">
          <a-input v-model:value="formData.title" allow-clear />
        </a-form-item>
        <a-form-item label="状态" name="available">
          <a-select v-model:value="formData.available" allow-clear>
            <a-select-option
              v-for="item in $enums.AVAILABLE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item name="content" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
          <tinymce v-model="formData.content" class="mb-1" />
        </a-form-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button
              v-if="!formData.published || !formData.available"
              type="primary"
              :loading="loading"
              html-type="submit"
              @click="(e) => submit(false)"
              >保存</a-button
            >
            <a-button
              v-if="formData.available"
              type="primary"
              :loading="loading"
              html-type="submit"
              @click="(e) => submit(true)"
              >保存并发布</a-button
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
  import * as api from '@/api/system/notice';
  import { Tinymce } from '@/components/Tinymce';

  export default defineComponent({
    // 使用组件
    components: {
      Tinymce,
    },
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
        // 表单校验规则
        rules: {
          title: [{ required: true, message: '请输入标题' }],
          content: [{ required: true, message: '请输入内容' }],
          available: [{ required: true, message: '请选择状态' }],
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
          title: '',
          content: '',
          available: '',
          published: false,
        };
      },
      // 提交表单事件
      submit(published) {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            if (this.formData.published && published) {
              this.$msg
                .createConfirm('重新发布后，会重置所有人的已读状态，是否确认继续执行？')
                .then(() => {
                  this.onPublish(published);
                });
            } else {
              if (published) {
                this.$msg.createConfirm('是否确认执行发布操作？').then(() => {
                  this.onPublish(published);
                });
              } else {
                this.onPublish(published);
              }
            }
          }
        });
      },
      onPublish(published) {
        this.loading = true;
        api
          .update(Object.assign(this.formData, { published: published }))
          .then(() => {
            this.$msg.createSuccess(
              published ? '发布成功，发布状态更新稍有延迟，请耐心等待！' : '修改成功！',
            );
            this.$emit('confirm');
            this.visible = false;
          })
          .finally(() => {
            this.loading = false;
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
    },
  });
</script>
