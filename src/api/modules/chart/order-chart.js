import request from '@/utils/request'

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
  },
  /**
   * 查询当日数据
   * @param params
   * @returns {AxiosPromise}
   */
  queryToday: (params) => {
    return request({
      url: '/chart/order/datas/today',
      method: 'get',
      params: params
    })
  },
  /**
   * 查询当月数据
   * @param params
   * @returns {AxiosPromise}
   */
  querySameMonth: (params) => {
    return request({
      url: '/chart/order/datas/samemonth',
      method: 'get',
      params: params
    })
  }
}
