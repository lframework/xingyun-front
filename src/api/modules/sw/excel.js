import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/sw/excel/query',
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
      url: '/sw/excel',
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
      url: '/sw/excel',
      region: 'common-api',
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
      url: '/sw/excel',
      region: 'common-api',
      method: 'put',
      params: params
    })
  },

  /**
   * 查询内容
   * @param id
   * @returns {AxiosPromise}
   */
  getContent: (id) => {
    return request({
      url: '/sw/excel/content',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },

  /**
   * 修改内容
   * @param params
   * @returns {AxiosPromise}
   */
  modifyContent: (params) => {
    return request({
      url: '/sw/excel/content',
      region: 'common-api',
      method: 'put',
      params: params
    })
  },

  /**
   * 发送文件给他人
   * @param params
   * @returns {AxiosPromise}
   */
  send: (params) => {
    return request({
      url: '/sw/excel/send',
      region: 'common-api',
      method: 'post',
      params: params
    })
  },

  /**
   * 批量发送文件给他人
   * @param params
   * @returns {AxiosPromise}
   */
  batchSend: (params) => {
    return request({
      url: '/sw/excel/send/batch',
      region: 'common-api',
      method: 'post',
      dataType: 'json',
      params: params
    })
  }
}
