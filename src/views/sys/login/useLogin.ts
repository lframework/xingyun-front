import type { FormInstance } from 'ant-design-vue/lib/form/Form';
import type { NamePath, Rule as ValidationRule } from 'ant-design-vue/lib/form/interface';
import { ref, computed, unref, Ref } from 'vue';

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN);

// 这里也可以优化
// import { createGlobalState } from '@vueuse/core'

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
  const validate = computed(() => {
    const form = unref(formRef);
    return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve());
  });

  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validate, validForm };
}

export function useFormRules() {
  const getUsernameFormRule = computed(() => createRule('请输入用户名'));
  const getPasswordFormRule = computed(() => createRule('请输入密码'));
  const getCaptchaFormRule = computed(() => createRule('请输入验证码'));

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const usernameFormRule = unref(getUsernameFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    const captchaFormRule = unref(getCaptchaFormRule);

    return {
      username: usernameFormRule,
      password: passwordFormRule,
      captcha: captchaFormRule,
    };
  });
  return { getFormRules };
}

function createRule(message: string): ValidationRule[] {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}
