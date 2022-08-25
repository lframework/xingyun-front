import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/system/parameter/query',
      region: 'system',
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
      url: '/system/parameter',
      region: 'system',
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
      url: '/system/parameter',
      region: 'system',
      method: 'post',
      params: params
    })
  },

  /**
   * 修改
   * @param params
   * @returns {AxiosPromise}
   */
  modify: (params) => {
    return request({
      url: '/system/parameter',
      region: 'system',
      method: 'put',
      params: params
    })
  },

  /**
   * 删除
   * @param params
   * @returns {AxiosPromise}
   */
  deleteById: (id) => {
    return request({
      url: '/system/parameter',
      region: 'system',
      method: 'delete',
      params: {
        id: id
      }
    })
  }
}
