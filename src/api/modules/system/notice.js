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
      method: 'put',
      params: params
    })
  }
}
