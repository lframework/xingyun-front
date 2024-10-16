<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="30%"
    title="请输入验证码"
    centered
    @ok="doConfirm"
  >
    <a-row>
      <a-col span="24">
        <a-tooltip class="captcha-box">
          <template #title>点此获取验证码</template>
          <span>
            <a-image
              :src="captchaData.image"
              @click="getCaptcha"
              :preview="false"
              :fallback="emptyCaptchaImg"
            />
          </span>
        </a-tooltip>
      </a-col>
    </a-row>
    <div style="height: 10px"></div>
    <a-row>
      <a-col span="24">
        <a-input
          size="large"
          v-model:value="formData.captcha"
          placeholder="请输入验证码"
          class="fix-auto-fill"
        >
          <template #prefix>
            <icon icon="captcha|svg" />
          </template>
        </a-input>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { CaptchaModel } from '@/api/sys/model/userModel';
  import Icon from '@/components/Icon/Icon.vue';
  import emptyCaptchaImg from '@/assets/images/empty-captcha.png';
  import { onKeyStroke } from '@vueuse/core';

  const emit = defineEmits(['confirm']);

  const userStore = useUserStore();

  let captchaData: CaptchaModel = ref({
    sn: '',
    image: '',
  });

  const formData = ref({
    captcha: '',
  });

  const visible = ref(false);

  onKeyStroke('Enter', doConfirm);

  // 获取登录验证码
  async function getCaptcha() {
    try {
      const data = await userStore.getCaptcha();
      captchaData.value = Object.assign(captchaData.value, data);
    } catch (e) {
      Object.assign(captchaData.value, {
        sn: '',
        image: '',
      } as CaptchaModel);
    }
  }

  // 打开对话框 由父页面触发
  function openDialog() {
    visible.value = true;

    this.$nextTick(() => open());
  }

  // 关闭对话框
  function closeDialog() {
    visible.value = false;
  }

  function open() {
    getCaptcha();
  }

  function doConfirm() {
    emit('confirm', {
      sn: captchaData.value.sn,
      captcha: formData.value.captcha,
    });

    closeDialog();
  }

  defineExpose({
    openDialog,
    closeDialog,
  });
</script>
