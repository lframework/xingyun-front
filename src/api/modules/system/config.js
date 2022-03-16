import { request } from '@/utils/request'

export default {
  /**
   * 查询
   * @returns {AxiosPromise}
   */
  get: () => {
    return request({
      url: '/system/config',
      method: 'get'
    })
  },
  /**
   * 修改
   * @param params
   * @returns {AxiosPromise}
   */
  modify: (params) => {
    return request({
      url: '/system/config',
      method: 'put',
      params: params
    })
  }
}
