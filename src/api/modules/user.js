import request from '@/utils/request'

const user = {
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
  }
}
export default user
