<template>
  <a-card>
    <login-form-title v-show="getShow" class="enter-x" />
    <a-form
      class="p-4 enter-x"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
      v-show="getShow"
      @keypress.enter="handleLogin"
    >
      <a-form-item name="username" class="enter-x">
        <a-input
          size="large"
          ref="usernameInput"
          v-model:value="formData.username"
          placeholder="请输入用户名"
          class="fix-auto-fill"
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password" class="enter-x">
        <a-input-password
          size="large"
          visibilityToggle
          v-model:value="formData.password"
          placeholder="请输入密码"
        >
          <template #prefix>
            <KeyOutlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item class="enter-x">
        <a-button type="primary" size="large" block @click="handleLogin" :loading="loading">
          登录
        </a-button>
      </a-form-item>
    </a-form>

    <LoginCaptchaModal ref="loginCaptchaDialog" @confirm="doConfirmCaptcha" />
  </a-card>
</template>
<script lang="ts" setup>
import {computed, onMounted, reactive, ref, unref} from 'vue';
  import { KeyOutlined, UserOutlined } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import LoginCaptchaModal from './LoginCaptchaModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
  import { createSuccessTip } from '@/hooks/web/msg';
  import { welcomeMsg } from '@/utils/utils';

  const userStore = useUserStore();
  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '1000@admin',
    password: 'admin',
  });

  const { validForm } = useFormValid(formRef);

  const loginCaptchaDialog = ref();
  const usernameInput = ref();

  const focusUsername = () => {
    usernameInput.value.focus();
  };

  onMounted(() => {
    focusUsername();
  });

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  function loginSuccessTip(userInfo) {
    createSuccessTip(welcomeMsg(userInfo.name));
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;

    const captchaRequire = await userStore.getCaptchaRequire(data.username);
    if (captchaRequire) {
      loginCaptchaDialog.value.openDialog();
    } else {
      focusUsername();
      doLogin(data.username, data.password);
    }
  }

  async function doLogin(username, password, sn, captcha) {
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: password,
        username: username,
        sn: sn,
        captcha: captcha,
      });
      if (userInfo) {
        loginSuccessTip(userInfo);
      }
    } finally {
      loading.value = false;
    }
  }

  async function doConfirmCaptcha({ sn, captcha }) {
    const data = await validForm();
    if (!data) return;
    focusUsername();
    doLogin(data.username, data.password, sn, captcha);
  }
</script>
<style lang="less" scoped>
  .captcha-box {
    cursor: pointer !important;
  }
</style>
