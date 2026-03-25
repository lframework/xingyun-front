<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['stock:adjust:reason:modify']" v-loading="loading">
      <vxe-form border title-background title-width="80" ref="form" :data="formData" :rules="rules">
        <vxe-form-item title="编号" field="code" span="12">
          <a-input v-model:value.trim="formData.code" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="名称" field="name" span="12">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="备注" field="description" span="24">
          <a-textarea v-model:value.trim="formData.description" />
        </vxe-form-item>
        <vxe-form-item span="24">
          <div class="form-modal-footer">
            <a-space>
              <a-button type="primary" :loading="loading" html-type="submit" @click="submit">
                保存
              </a-button>
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
  import * as api from '@/api/sc/stock/adjust/reason';
  import { createSuccess } from '@/hooks/web/msg';

  export default defineComponent({
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        visible: false,
        loading: false,
        formData: {},
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
      openDialog() {
        this.visible = true;
        this.$nextTick(() => this.open());
      },
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      initFormData() {
        this.formData = {
          id: '',
          code: '',
          name: '',
          description: '',
        };
      },
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
      open() {
        this.initFormData();
        this.loadFormData();
      },
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
