<template>
  <a-row>
    <a-col :span="8">
      <a-form
        ref="form"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="自动锁屏" name="code">
          <a-select v-model:value="formData.autoLock">
            <a-select-option :value="0">不自动锁屏</a-select-option>
            <a-select-option :value="5">无操作5分钟后自动锁屏</a-select-option>
            <a-select-option :value="10">无操作10分钟后自动锁屏</a-select-option>
            <a-select-option :value="15">无操作15分钟后自动锁屏</a-select-option>
            <a-select-option :value="30">无操作30分钟后自动锁屏</a-select-option>
            <a-select-option :value="60">无操作60分钟后自动锁屏</a-select-option>
          </a-select>
        </a-form-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
              >保存</a-button
            >
            <a-button @click="reset">重置</a-button>
          </a-space>
        </div>
      </a-form>
    </a-col>
  </a-row>
</template>
<script>
  import { defineComponent } from 'vue';
  import { useAppStore } from '@/store/modules/app';

  export default defineComponent({
    setup() {
      const appStore = useAppStore();
      return {
        appStore,
      };
    },
    data() {
      return {
        formData: {
          autoLock: this.appStore.getProjectConfig.lockTime,
        },
        rules: [],
      };
    },
    methods: {
      submit() {
        const config = { lockTime: this.formData.autoLock };
        this.appStore.setProjectConfig(config);

        this.$msg.createSuccess('保存成功');
      },
      reset() {
        this.formData = {
          autoLock: 0,
        };
      },
    },
  });
</script>
