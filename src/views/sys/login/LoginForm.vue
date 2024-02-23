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
      <a-form-item name="captcha" class="enter-x">
        <a-input
          size="large"
          v-model:value="formData.captcha"
          placeholder="请输入验证码"
          class="fix-auto-fill"
        >
          <template #prefix>
            <icon icon="captcha|svg" />
          </template>
          <template #suffix>
            <a-tooltip class="captcha-box">
              <template #title>点此获取验证码</template>
              <span>
                <a-image
                  :src="captchaData.image"
                  @click="getCaptcha"
                  :height="24"
                  :width="72"
                  :preview="false"
                  :fallback="emptyCaptchaImg"
                />
              </span>
            </a-tooltip>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item class="enter-x">
        <a-button type="primary" size="large" block @click="handleLogin" :loading="loading">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, unref } from 'vue';
  import { KeyOutlined, UserOutlined } from '@ant-design/icons-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
  import { CaptchaModel } from '@/api/sys/model/userModel';
  import { createSuccessTip } from '@/hooks/web/msg';
  import emptyCaptchaImg from '@/assets/images/empty-captcha.png';
  import { welcomeMsg } from '@/utils/utils';

  const userStore = useUserStore();
  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '1000@admin',
    password: 'admin',
    captcha: '',
  });

  let captchaData: CaptchaModel = reactive({
    sn: '',
    image: '',
  });

  const { validForm } = useFormValid(formRef);

  // onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  onMounted(() => {
    getCaptcha();
  });

  function loginSuccessTip(userInfo) {
    createSuccessTip(welcomeMsg(userInfo.name));
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        username: data.username,
        sn: captchaData.sn,
        captcha: data.captcha,
      });
      if (userInfo) {
        loginSuccessTip(userInfo);
      }
    } catch (e) {
      await getCaptcha();
    } finally {
      loading.value = false;
    }
  }

  // 获取登录验证码
  async function getCaptcha() {
    try {
      const data = await userStore.getCaptcha();
      Object.assign(captchaData, data);
    } catch (e) {
      Object.assign(captchaData, {
        sn: '',
        image: '',
      } as CaptchaModel);
    }
  }
</script>
<style lang="less" scoped>
  .captcha-box {
    cursor: pointer !important;
  }
</style>
