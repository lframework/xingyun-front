<template>
  <div class="login-form-panel">
    <div v-show="getShow" class="login-form-panel__header enter-x">
      <span class="login-form-panel__eyebrow">Secure Access</span>
      <login-form-title class="login-form-panel__title" />
      <p class="login-form-panel__desc">请输入账号信息以继续访问业务工作台。</p>
    </div>

    <a-form
      class="login-form-panel__form enter-x"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
      v-show="getShow"
      @keypress.enter="handleLogin"
    >
      <a-form-item
        name="tenantName"
        class="login-form-panel__form-item enter-x"
        v-if="requireTenant.enable && isEmpty(requireTenant.tenantId)"
      >
        <a-input
          size="large"
          ref="tenantInput"
          v-model:value="formData.tenantName"
          placeholder="请输入租户名称"
          class="fix-auto-fill"
        >
          <template #prefix>
            <ApartmentOutlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="username" class="login-form-panel__form-item enter-x">
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
      <a-form-item name="password" class="login-form-panel__form-item enter-x">
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
      <a-form-item class="login-form-panel__action enter-x">
        <a-button
          type="primary"
          size="large"
          block
          @click="handleLogin"
          :loading="loading"
          class="login-form-panel__submit"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>

    <div v-show="getShow" class="login-form-panel__footer enter-x">
      登录即表示继续使用当前系统认证、租户及验证码校验流程。
    </div>

    <LoginCaptchaModal ref="loginCaptchaDialog" @confirm="doConfirmCaptcha" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, unref } from 'vue';
  import { KeyOutlined, UserOutlined, ApartmentOutlined } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import LoginCaptchaModal from './LoginCaptchaModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
  import { createSuccessTip } from '@/hooks/web/msg';
  import { welcomeMsg, isEmpty } from '@/utils/utils';
  import { TenantRequireBo } from '@/api/sys/model/tenantRequireBo';

  const userStore = useUserStore();
  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const formRef = ref();
  const loading = ref(false);
  const requireTenant = ref({} as TenantRequireBo);

  const formData = reactive({
    tenantName: '测试租户',
    username: 'admin',
    password: 'admin',
  });

  const { validForm } = useFormValid(formRef);

  const loginCaptchaDialog = ref();
  const usernameInput = ref();
  const tenantInput = ref();

  const focusInput = () => {
    usernameInput.value.focus();
  };

  onMounted(async () => {
    requireTenant.value = await userStore.getTenantRequire();

    focusInput();
  });

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  function loginSuccessTip(userInfo) {
    createSuccessTip(welcomeMsg(userInfo.name));
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;

    const captchaRequire = await userStore.getCaptchaRequire(
      data.tenantName,
      data.username,
      requireTenant.value.tenantId,
    );
    if (captchaRequire) {
      loginCaptchaDialog.value.openDialog();
    } else {
      focusInput();
      doLogin(data.tenantName, data.username, data.password, undefined, undefined);
    }
  }

  async function doLogin(tenantName, username, password, sn, captcha) {
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        tenantId: requireTenant.value.tenantId,
        tenantName: tenantName,
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
    focusInput();
    doLogin(data.tenantName, data.username, data.password, sn, captcha);
  }
</script>
<style lang="less">
  .login-form-panel {
    position: relative;
  }

  .login-form-panel__header {
    margin-bottom: 24px;
  }

  .login-form-panel__eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 999px;
    background: #eff6ff;
    color: #2563eb;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .login-form-panel__title {
    margin: 18px 0 10px;
  }

  .login-form-panel__desc {
    margin: 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.7;
  }

  .login-form-panel__form {
    padding: 8px 0 0;
  }

  .login-form-panel__form-item {
    margin-bottom: 18px;
  }

  .login-form-panel__action {
    margin-top: 6px;
    margin-bottom: 0;
  }

  .login-form-panel__submit {
    height: 50px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%);
    box-shadow: 0 18px 30px rgb(37 99 235 / 24%);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.08em;
  }

  .login-form-panel__submit:hover,
  .login-form-panel__submit:focus {
    background: linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%);
  }

  .login-form-panel__footer {
    margin-top: 18px;
    color: #94a3b8;
    font-size: 12px;
    line-height: 1.8;
  }

  .login-form-panel .ant-input-affix-wrapper,
  .login-form-panel .ant-input {
    min-height: 50px;
    border: 1px solid #dbe4f0;
    border-radius: 14px;
    background: #f8fafc;
    box-shadow: none;
    transition: all 0.2s ease;
  }

  .login-form-panel .ant-input-affix-wrapper:hover,
  .login-form-panel .ant-input:hover {
    border-color: #93c5fd;
    background: #fff;
  }

  .login-form-panel .ant-input-affix-wrapper:focus,
  .login-form-panel .ant-input-affix-wrapper-focused,
  .login-form-panel .ant-input:focus {
    border-color: #60a5fa;
    background: #fff;
    box-shadow: 0 0 0 4px rgb(96 165 250 / 12%);
  }

  .login-form-panel .ant-input-prefix {
    margin-right: 10px;
    color: #64748b;
    font-size: 16px;
  }

  .login-form-panel .ant-input,
  .login-form-panel .ant-input-password input {
    color: #0f172a;
    font-size: 14px;
  }

  .login-form-panel .ant-form-item-explain-error {
    margin-top: 6px;
  }

  .captcha-box {
    cursor: pointer !important;
  }
</style>
