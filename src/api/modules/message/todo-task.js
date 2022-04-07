import { request } from '@/utils/request'

export default {

  /**
   * 查询
   * @param params
   * @returns {AxiosPromise}
   */
  query: () => {
    return request({
      url: '/message/todo/query',
      hiddenError: true,
      method: 'get'
    })
  }
}
