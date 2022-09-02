import { request } from '@/utils/request'

export default {

  /**
   * 查询
   * @param params
   * @returns {AxiosPromise}
   */
  get: () => {
    return request({
      url: '/retail/config',
      region: 'sc-api',
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
      url: '/retail/config',
      region: 'sc-api',
      method: 'put',
      data: params
    })
  }
}
