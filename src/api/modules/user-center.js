import { request } from '@/utils/request'

export default {

  /**
   * 获取用户信息
   * @returns {AxiosPromise}
   */
  getInfo: () => {
    return request({
      url: '/center/info',
      region: 'common',
      method: 'get'
    })
  },
  /**
   * 修改邮箱
   * @param params
   * @returns {AxiosPromise}
   */
  updateEmail: (params) => {
    return request({
      url: '/center/email',
      region: 'common',
      method: 'patch',
      data: params
    })
  },
  /**
   * 修改联系电话
   * @param params
   * @returns {AxiosPromise}
   */
  updateTelephone: (params) => {
    return request({
      url: '/center/telephone',
      region: 'common',
      method: 'patch',
      data: params
    })
  },
  /**
   * 修改密码
   * @param params
   * @returns {AxiosPromise}
   */
  updatePsw: (params) => {
    return request({
      url: '/center/password',
      region: 'common',
      method: 'patch',
      data: params
    })
  },
  /**
   * 查询操作日志
   * @param params
   * @returns {AxiosPromise}
   */
  queryOpLogs: (params) => {
    return request({
      url: '/center/oplog',
      region: 'common',
      method: 'get',
      params: params
    })
  }
}
