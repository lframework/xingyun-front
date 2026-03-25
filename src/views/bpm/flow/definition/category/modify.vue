<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="淇敼"
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
        <vxe-form-item title="鍚嶇О" field="name" span="24">
          <a-input v-model:value.trim="formData.name" allow-clear />
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
  import * as api from '@/api/bpm/flow/flow-category';
  import { createSuccess } from '@/hooks/web/msg';

  export default defineComponent({
    // 浣跨敤缁勪欢
    components: {},

    props: {
      id: {
        type: String,
        required: true,
      },
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
          name: [{ required: true, message: '请输入名称' }],
        },
      };
    },
    created() {
      this.initFormData();
    },
    methods: {
      // 鎵撳紑瀵硅瘽妗嗭紝鐢辩埗椤甸潰瑙﹀彂
      openDialog() {
        this.visible = true;

        this.$nextTick(() => {
          this.$nextTick(() => this.open());
        });
      },
      // 鍏抽棴瀵硅瘽妗?
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 鍒濆鍖栬〃鍗曟暟鎹?
      initFormData() {
        this.formData = {
          id: '',
          name: '',
        };
      },
      // 鎻愪氦琛ㄥ崟浜嬩欢
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
      // 椤甸潰鏄剧ず鏃惰Е鍙?
      open() {
        // 鍒濆鍖栨暟鎹?
        this.initFormData();

        // 鏌ヨ鏁版嵁
        this.loadFormData();
      },
      // 鏌ヨ鏁版嵁
      loadFormData() {
        this.loading = true;
        api
          .detail(this.id)
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
