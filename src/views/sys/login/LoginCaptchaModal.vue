<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="30%"
    title="请输入验证码"
    centered
    @ok="doConfirm"
  >
    <a-form
      class="p-4 enter-x"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
      @keypress.enter="doConfirm"
    >
      <a-form-item class="enter-x">
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
      </a-form-item>
      <a-form-item name="captcha" class="enter-x">
        <a-input
          ref="captchaInput"
          size="large"
          v-model:value="formData.captcha"
          placeholder="请输入验证码"
          class="fix-auto-fill"
        >
          <template #prefix>
            <icon icon="captcha|svg" />
          </template>
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { CaptchaModel } from '@/api/sys/model/userModel';
  import Icon from '@/components/Icon/Icon.vue';
  import emptyCaptchaImg from '@/assets/images/empty-captcha.png';
  import type { Rule as ValidationRule } from 'ant-design-vue/lib/form/interface';
  import { useFormValid } from '@/views/sys/login/useLogin';

  const emit = defineEmits(['confirm']);

  const userStore = useUserStore();

  let captchaData: CaptchaModel = ref({
    sn: '',
    image: '',
  });

  const formData = ref({
    captcha: '',
  });

  const formRef = ref();
  const captchaInput = ref();

  const { validForm } = useFormValid(formRef);

  const visible = ref(false);

  const getCaptchaFormRule = computed(() => [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'change',
    },
  ]);

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const captchaFormRule = unref(getCaptchaFormRule);

    return {
      captcha: captchaFormRule,
    };
  });

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
    formData.value.captcha = '';
    captchaInput.value.focus();
  }

  async function doConfirm() {
    const data = await validForm();
    if (!data) return;

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
