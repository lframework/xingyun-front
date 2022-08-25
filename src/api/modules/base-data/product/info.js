import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/basedata/product/query',
      region: 'basedata',
      method: 'get',
      params: params
    })
  },
  /**
   * 根据ID查询
   * @param id
   * @returns {AxiosPromise}
   */
  get: (id) => {
    return request({
      url: '/basedata/product',
      region: 'basedata',
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
      url: '/basedata/product',
      region: 'basedata',
      method: 'put',
      params: params
    })
  }
}
