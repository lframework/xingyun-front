<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <vxe-form
        border
        title-background
        title-width="120"
        ref="form"
        :data="formData"
        :rules="rules"
      >
        <vxe-form-item title="流程编号" field="code" span="12">
          <a-input v-model:value.trim="formData.code" disabled />
        </vxe-form-item>
        <vxe-form-item title="流程名称" field="name" span="12">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="流程分类" field="categoryId" span="24">
          <flow-category-selector v-model:value="formData.categoryId" only-final />
        </vxe-form-item>
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
  import * as api from '@/api/bpm/flow/definition';
  import { validCode } from '@/utils/validate';
  import { createSuccess } from '@/hooks/web/msg';
  import FlowCategorySelector from '@/components/Selector/FlowCategorySelector.vue';

  export default defineComponent({
    components: {
      FlowCategorySelector,
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
          code: [{ required: true, message: '请输入流程编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入流程名称' }],
          categoryId: [{ required: true, message: '请选择流程分类' }],
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
          id: '',
          code: '',
          name: '',
          categoryId: '',
          categoryName: '',
        };
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();

        this.loadData();
      },
      loadData() {
        this.loading = true;
        api
          .detail(this.id)
          .then((res) => {
            this.formData = res;
          })
          .finally(() => {
            this.loading = false;
          });
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
                this.closeDialog();
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
    },
  });
</script>
