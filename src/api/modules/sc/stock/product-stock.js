import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/stock/product/query',
      method: 'get',
      params: params
    })
  },
  /**
   * 导出列表
   * @param params
   * @returns {AxiosPromise}
   */
  exportList: (params) => {
    return request({
      url: '/stock/product/export',
      method: 'get',
      responseType: 'blob',
      params: params
    })
  }
}
