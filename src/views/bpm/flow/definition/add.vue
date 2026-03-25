<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="鏂板"
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
        <vxe-form-item title="娴佺▼缂栧彿" field="code" span="12">
          <a-input v-model:value.trim="formData.code" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="娴佺▼鍚嶇О" field="name" span="12">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="娴佺▼鍒嗙被" field="categoryId" span="24">
          <flow-category-selector v-model:value="formData.categoryId" only-final />
        </vxe-form-item>
        <vxe-form-item span="24">
          <div class="form-modal-footer">
            <a-space>
              <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
                >淇濆瓨</a-button
              >
              <a-button :loading="loading" @click="closeDialog">鍙栨秷</a-button>
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
  import { createConfirm, createSuccess } from '@/hooks/web/msg';
  import FlowCategorySelector from '@/components/Selector/FlowCategorySelector.vue';

  export default defineComponent({
    components: {
      FlowCategorySelector,
    },
    data() {
      return {
        // 鏄惁鍙
        visible: false,
        // 鏄惁鏄剧ず鍔犺浇妗?
        loading: false,
        // 琛ㄥ崟鏁版嵁
        formData: {},
        // 琛ㄥ崟鏍￠獙瑙勫垯
        rules: {
          code: [{ required: true, message: '请输入流程编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入流程名称' }],
          categoryId: [{ required: true, message: '请选择流程分类' }],
        },
      };
    },
    computed: {},
    created() {
      // 鍒濆鍖栬〃鍗曟暟鎹?
      this.initFormData();
    },
    methods: {
      // 鎵撳紑瀵硅瘽妗嗭紝鐢辩埗椤甸潰瑙﹀彂
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 鍏抽棴瀵硅瘽妗?
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 鍒濆鍖栬〃鍗曟暟鎹?
      initFormData() {
        this.formData = {
          code: '',
          name: '',
          categoryId: '',
        };
      },
      // 椤甸潰鏄剧ず鏃剁敱鐖堕〉闈㈣Е鍙?
      open() {
        // 鍒濆鍖栬〃鍗曟暟鎹?
        this.initFormData();
      },
      submit() {
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            createConfirm('新增后流程编号将不可修改，确定新增吗？').then(() => {
              this.loading = true;
              api
                .create(this.formData)
                .then(() => {
                  createSuccess('新增成功！');
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
    },
  });
</script>
