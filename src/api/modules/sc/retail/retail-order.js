import { request } from '@/utils/request'

export default {
  /**
   * 根据关键字查询商品
   * @param condition
   * @returns {AxiosPromise}
   */
  searchProduct: (scId, condition) => {
    return request({
      url: '/retail/order/product/search',
      method: 'get',
      params: {
        scId: scId,
        condition: condition
      }
    })
  },
  /**
   * 查询商品列表
   * @param params
   * @returns {AxiosPromise}
   */
  queryProduct: (params) => {
    return request({
      url: '/retail/order/product/list',
      method: 'get',
      params: params
    })
  }
}
