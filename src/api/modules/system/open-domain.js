import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/system/open/domain/query',
      region: 'common-api',
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
      url: '/system/open/domain',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 新增
   * @param params
   * @returns {AxiosPromise}
   */
  create: (params) => {
    return request({
      url: '/system/open/domain',
      region: 'common-api',
      method: 'post',
      data: params
    })
  },
  /**
   * 修改
   * @param params
   * @returns {AxiosPromise}
   */
  modify: (params) => {
    return request({
      url: '/system/open/domain',
      region: 'common-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 修改Api密钥
   * @param ids
   * @returns {*}
   */
  modifyApiSecret: (params) => {
    return request({
      url: '/system/open/domain/secret',
      region: 'common-api',
      method: 'put',
      data: params
    })
  }
}
