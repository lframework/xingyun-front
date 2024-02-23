import { App, createVNode } from 'vue';
import { message as Message, Modal, Input } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import * as utils from '@/utils/utils';

export function install(app: App): void {
  const msg = {
    createError,
    createErrorDialog,
    createConfirm,
    createSuccess,
    createSuccessTip,
    createPrompt,
  };

  app.config.globalProperties.$msg = msg;
}

export const createError = function (message: string): void {
  Message.error(message);
};

export const createErrorDialog = function (message: string, title: string = '错误提示'): void {
  Modal.error({
    title: title,
    content: message,
  });
};

export type ConfirmOptions = {
  okText?: string;
  cancelText?: string;
};

export const createConfirm = function (
  message: string,
  title: string = '提示信息',
  options: ConfirmOptions = {},
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const defaultOptions = {
      okText: '确定',
      cancelText: '取消',
    } as ConfirmOptions;
    const finalOptions = { ...defaultOptions, ...options };
    Modal.confirm({
      title: title,
      content: message,
      onOk: () => resolve(),
      onCancel: () => reject(),
      okText: finalOptions.okText,
      cancelText: finalOptions.cancelText,
    });
  });
};

export const createSuccess = function (message: string): void {
  Modal.success({
    title: '提示信息',
    content: message,
  });
};

export const createSuccessTip = function (message: string): void {
  Message.success(message);
};

export const createPrompt = function (
  message: string,
  {
    inputPattern,
    inputErrorMessage,
    title,
    inputValue,
    required,
  }: {
    inputPattern: RegExp;
    inputErrorMessage: string;
    title: string;
    inputValue?: any;
    required?: boolean;
  },
): Promise<{ value: string }> {
  return new Promise<{ value: string }>((resolve) => {
    const datas: { text: string } = {
      text: '',
    };
    const change = (e) => {
      datas.text = e.target.value;
    };
    Modal.confirm({
      title: title,
      content: createVNode('div', null, [createVNode(Input, { onInput: change })]),
      icon: createVNode(ExclamationCircleOutlined),
      okText: '确定',
      cancelText: '取消',
      onOk() {
        return new Promise<void>((r, j) => {
          if (required) {
            if (utils.isEmpty(datas.text)) {
              const errorMsg = message || '请输入信息';
              createError(errorMsg);
              return j();
            }
          }
          if (utils.isEmpty(datas.text)) {
            datas.text = inputValue || '';
          }
          if (inputPattern) {
            if (!inputPattern.test(datas.text)) {
              const errorMsg = inputErrorMessage || '输入信息格式有误';
              createError(errorMsg);
              return j();
            }
          }

          r();
          resolve({ value: datas.text });
        });
      },
    });
  });
};

export const errorDialog = function (message: string, title: string): void {
  Modal.error({
    title: title || '提示信息',
    content: message,
  });
};
