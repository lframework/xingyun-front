import { request } from '@/utils/request'

export default {

  /**
   * 查询
   * @param params
   * @returns {AxiosPromise}
   */
  get: () => {
    return request({
      url: '/purchase/config',
      region: 'sc',
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
      url: '/purchase/config',
      region: 'sc',
      method: 'put',
      data: params
    })
  }
}
