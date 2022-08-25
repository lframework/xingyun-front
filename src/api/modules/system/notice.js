import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/system/notice/query',
      region: 'system',
      method: 'get',
      params: params
    })
  },

  /**
   * 我的通知
   * @param params
   * @returns {AxiosPromise}
   */
  queryMy: (params) => {
    return request({
      url: '/system/notice/query/my',
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
      url: '/system/notice',
      region: 'system',
      method: 'get',
      params: {
        id: id
      }
    })
  },

  /**
   * 根据ID查询内容
   * @param id
   * @returns {AxiosPromise}
   */
  getContent: (id) => {
    return request({
      url: '/system/notice/content',
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
      url: '/system/notice',
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
      url: '/system/notice',
      region: 'system',
      method: 'put',
      params: params
    })
  }
}
