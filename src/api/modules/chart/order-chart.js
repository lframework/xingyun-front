import { request } from '@/utils/request'

export default {
  /**
   * 查询汇总数据
   * @returns {AxiosPromise}
   */
  get: () => {
    return request({
      url: '/chart/order',
      method: 'get'
    })
  }
}
