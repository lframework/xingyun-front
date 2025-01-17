import { defHttp } from '/@/utils/http/axios';
import { CaptchaModel, LoginParams, LoginResultModel } from './model/userModel';
import { ContentTypeEnum } from '@/enums/httpEnum';

enum Api {
  Login = '/auth/login',
  Logout = '/auth/logout',
  Captcha = '/auth/captcha',
  CaptchaRequire = '/auth/captcha/require',
  TenantRequire = '/auth/tenant/require',
  CheckPassword = '/auth/check/password',
}

const region = 'cloud-api';

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams): Promise<LoginResultModel> {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

export function doLogout(): Promise<void> {
  return defHttp.post({ url: Api.Logout }, { region });
}

export function getCaptchaApi() {
  return defHttp.get<CaptchaModel>({ url: Api.Captcha }, { region });
}

export function getCaptchaRequireApi(tenantName: string, username: string) {
  return defHttp.post<boolean>(
    {
      url: Api.CaptchaRequire,
      params: {
        tenantName,
        username,
      },
    },
    { region, contentType: ContentTypeEnum.FORM_URLENCODED },
  );
}

export function getTenantRequireApi() {
  return defHttp.get<boolean>(
    {
      url: Api.TenantRequire,
    },
    { region },
  );
}

export function checkPasswordApi(password: string) {
  return defHttp.post<CaptchaModel>(
    {
      url: Api.CheckPassword,
      data: {
        password,
      },
    },
    { contentType: ContentTypeEnum.FORM_URLENCODED, region },
  );
}
