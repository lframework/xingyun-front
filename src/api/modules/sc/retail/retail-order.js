import { request } from '@/utils/request'

export default {
  /**
   * 根据关键字查询商品
   * @param condition
   * @returns {AxiosPromise}
   */
  searchProduct: (scId, condition) => {
    return request({
      url: '/basedata/product/retail/product/search',
      region: 'basedata',
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
      url: '/basedata/product/retail/product/list',
      region: 'sc',
      method: 'get',
      params: params
    })
  }
}
