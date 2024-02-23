/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  sn: string;
  captcha: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  user: GetUserInfoModel;
  token: string;
  roles: string[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // 姓名
  name: string;
  roles: RoleInfo[];
}

/**
 * @description: 验证码
 */
export interface CaptchaModel {
  // sn
  sn: string;
  // 图片Base64编码
  image: string;
}
