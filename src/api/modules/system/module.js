import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/system/module/query',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 授权模块
   * @param id
   * @returns {AxiosPromise}
   */
  setting: (params) => {
    return request({
      url: '/system/module/setting',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  }
}
