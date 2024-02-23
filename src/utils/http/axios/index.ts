// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { clone } from 'lodash-es';
import type { RequestOptions, Result } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { useGlobSetting } from '/@/hooks/setting';
import { ContentTypeEnum, RequestEnum, ResponseEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { getToken } from '/@/utils/auth';
import { deepMerge, setObjToUrlParams } from '/@/utils';
import { formatRequestDate, joinTimestamp } from './helper';
import { createError } from '@/hooks/web/msg';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse, responseType } = options;
    if (responseType === ResponseEnum.BLOB) {
      const content = res.data;
      const blob = new Blob([content], { type: res.headers['content-type'] });
      const url = res.config.url;
      const fileName = res.headers.filename
        ? decodeURIComponent(res.headers.filename)
        : url.substring(url.lastIndexOf('/') + 1, url.length);
      if ('download' in document.createElement('a')) {
        // 支持a标签download的浏览器
        const link = document.createElement('a'); // 创建a标签
        link.download = fileName; // a标签添加属性
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click(); // 执行下载
        URL.revokeObjectURL(link.href); // 释放url
        document.body.removeChild(link); // 释放标签
      } else {
        // 其他浏览器
        navigator.msSaveBlob(blob, fileName);
      }

      return {};
    }

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error('网络请求错误，请稍后重试！');
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code } = data;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code >= 200 && code <= 299;
    if (hasSuccess) {
      return data.data;
    }

    throw new Error('网络请求错误，请稍后重试！');
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (options.responseType === ResponseEnum.BLOB) {
      config.responseType = 'blob';
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${
        globSetting.cloudEnable === 'true' ? (options.region ? '/' + options.region : '') : ''
      }${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config
    const token = getToken();
    config.headers['X-Auth-Token'] = token;
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { response, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    let errMessage = response?.data?.error?.message ?? '';

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const handleErrorData = (v, errorMessageMode) => {
      if (errorMessageMode === 'none') {
        return;
      }

      const code: number = v?.code;
      const msg: string = v?.msg;
      if (!msg) {
        try {
          errMessage = errMessage || '网络请求错误，请稍后重试！';
          if (errorMessageMode !== 'none') {
            createError(errMessage);
          }
          return Promise.reject(error);
        } catch (error) {
          throw new Error(error as unknown as string);
        }
      }

      errMessage = msg;

      checkStatus(code, errMessage, errorMessageMode);
    };

    if (config.requestOptions.responseType === ResponseEnum.BLOB) {
      const reader = new FileReader(); // 创建读取文件对象
      reader.addEventListener('loadend', function () {
        //
        try {
          const res = JSON.parse(reader.result); // 返回的数据
          handleErrorData(res, errorMessageMode);
        } catch (e) {
          handleErrorData({}, errorMessageMode);
        }
      });
      reader.readAsText(response?.data, 'utf-8');

      return Promise.reject({});
    }

    handleErrorData(response?.data, errorMessageMode);

    return Promise.reject(response?.data);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 30 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'modal',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: false,
            count: 5,
            waitTime: 100,
          },
        },
      },
      opt || {},
    ),
  );
}
export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
