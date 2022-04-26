import { request } from '@/utils/request'

const user = {

  /**
   * 获取初始化参数
   * @param params
   * @returns {AxiosPromise}
   */
  getInit: () => {
    return request({
      url: '/auth/init',
      method: 'get'
    })
  },

  /**
   * 注册
   * @param params
   * @returns {AxiosPromise}
   */
  regist: (params) => {
    return request({
      url: '/auth/regist',
      method: 'post',
      params: params
    })
  },
  /**
   * 登录
   * @param data
   * @returns {AxiosPromise}
   */
  login: (data) => {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  },
  /**
   * 获取用户信息
   * @returns {AxiosPromise}
   */
  getInfo: () => {
    return request({
      url: '/auth/info',
      method: 'get'
    })
  },
  /**
   * 退出登录
   * @returns {AxiosPromise}
   */
  logout: () => {
    return request({
      url: '/auth/logout',
      method: 'post'
    })
  },
  /**
   * 获取登录验证码
   * @returns {AxiosPromise}
   */
  getCaptcha: () => {
    return request({
      url: '/auth/captcha',
      method: 'get'
    })
  },
  /**
   * 获取菜单
   * @returns {AxiosPromise}
   */
  getMenus: () => {
    return request({
      url: '/auth/menus',
      method: 'get'
    })
  },
  /**
   * 收藏菜单
   * @param menuId
   * @returns {AxiosPromise}
   */
  collectMenu: (menuId) => {
    return request({
      url: '/menu/collect',
      method: 'post',
      data: {
        menuId: menuId
      }
    })
  },
  /**
   * 取消收藏菜单
   * @param menuId
   * @returns {AxiosPromise}
   */
  cancelCollectMenu: (menuId) => {
    return request({
      url: '/menu/collect/cancel',
      method: 'post',
      data: {
        menuId: menuId
      }
    })
  },
  /**
   * 忘记密码时，根据用户名获取信息
   * @param username
   * @returns {*}
   */
  forgetUsername: (username) => {
    return request({
      url: '/auth/forget/username',
      method: 'get',
      params: {
        username: username
      }
    })
  },
  /**
   * 获取邮箱验证码
   * @returns {*}
   */
  getMailCaptcha: (username) => {
    return request({
      url: '/auth/forget/mail/code',
      method: 'get',
      params: {
        username: username
      }
    })
  },
  /**
   * 获取邮箱验证码
   * @returns {*}
   */
  resetPswByMail: (params) => {
    return request({
      url: '/auth/forget/mail',
      method: 'post',
      params: params
    })
  },
  /**
   * 获取短信验证码
   * @returns {*}
   */
  getSmsCaptcha: (username) => {
    return request({
      url: '/auth/forget/sms/code',
      method: 'get',
      params: {
        username: username
      }
    })
  },
  /**
   * 获取短信验证码
   * @returns {*}
   */
  resetPswBySms: (params) => {
    return request({
      url: '/auth/forget/sms',
      method: 'post',
      params: params
    })
  },
  /**
   * 手机号登录时发送短信验证码
   * @param params
   * @returns {AxiosPromise}
   */
  getTelephoneLoginSmsCaptcha: (params) => {
    return request({
      url: '/auth/login/telephone/captcha',
      method: 'get',
      params: params
    })
  },
  /**
   * 手机号登录
   * @param params
   * @returns {AxiosPromise}
   */
  telephoneLogin: (params) => {
    return request({
      url: '/auth/login/telephone',
      method: 'post',
      params: params
    })
  },
  /**
   * 手机号绑定用户
   * @param params
   * @returns {AxiosPromise}
   */
  telephoneBindUser: (params) => {
    return request({
      url: '/auth/bind/telephone',
      method: 'post',
      params: params
    })
  }
}
export default user
