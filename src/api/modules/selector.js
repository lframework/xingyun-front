import { request } from '@/utils/request'

const selector = {

  /**
   * 订单支付方式
   * @param params
   * @returns {AxiosPromise}
   */
  getOrderPayType: (params) => {
    return request({
      url: '/selector/paytype/order',
      region: 'sc-api',
      method: 'get',
      params: params
    })
  }
}
export default selector
