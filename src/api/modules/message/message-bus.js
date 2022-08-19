import { request } from '@/utils/request'

export default {

  /**
   * 查询
   * @param params
   * @returns {AxiosPromise}
   */
  query: () => {
    return request({
      url: '/message/bus/query',
      hiddenError: true,
      method: 'get'
    })
  }
}
