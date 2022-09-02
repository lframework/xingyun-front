import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/sw/filebox/query',
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
      url: '/sw/filebox',
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
      url: '/sw/filebox',
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
      url: '/sw/filebox',
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
      url: '/sw/filebox/send',
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
      url: '/sw/filebox/send/batch',
      region: 'common-api',
      method: 'post',
      dataType: 'json',
      params: params
    })
  },

  /**
   * 上传文件
   * @param params
   * @returns {*}
   */
  upload: (params) => {
    return request({
      url: '/sw/filebox/upload',
      region: 'common-api',
      method: 'post',
      dataType: 'file',
      params: params
    })
  }
}
