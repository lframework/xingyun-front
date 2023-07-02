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
      region: 'cloud-api',
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
      region: 'cloud-api',
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
      region: 'cloud-api',
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
      url: '/sw/filebox',
      region: 'cloud-api',
      method: 'put',
      data: params
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
      region: 'cloud-api',
      method: 'post',
      data: params
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
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      data: params
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
      region: 'cloud-api',
      method: 'post',
      dataType: 'file',
      data: params
    })
  }
}
