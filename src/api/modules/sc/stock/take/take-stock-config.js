import { request } from '@/utils/request'

export default {

  /**
   * 根据ID查询
   * @param id
   * @returns {AxiosPromise}
   */
  get: (id) => {
    return request({
      url: '/stock/take/config',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 修改
   * @param params
   * @returns {AxiosPromise}
   */
  modify: (params) => {
    return request({
      url: '/stock/take/config',
      method: 'put',
      params: params
    })
  }
}
