<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['settle:out-item:query']" v-loading="loading">
      <vxe-form border title-background title-width="120" :data="formData">
        <vxe-form-item title="编号" field="code" span="12" />
        <vxe-form-item title="名称" field="name" span="12" />
        <vxe-form-item title="备注" field="description" span="24" />
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/settle/out-item';

  export default defineComponent({
    components: {},
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
