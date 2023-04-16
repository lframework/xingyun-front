import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/basedata/paytype/query',
      region: 'basedata-api',
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
      url: '/basedata/paytype',
      region: 'basedata-api',
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
      url: '/basedata/paytype',
      region: 'basedata-api',
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
      url: '/basedata/paytype',
      region: 'basedata-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 批量启用
   * @param ids
   * @returns {*}
   */
  batchEnable: (ids) => {
    return request({
      url: '/basedata/paytype/enable/batch',
      region: 'basedata-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  /**
   * 批量停用
   * @param ids
   * @returns {*}
   */
  batchUnable: (ids) => {
    return request({
      url: '/basedata/paytype/unable/batch',
      region: 'basedata-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  /**
   * 上传logo
   * @param params
   * @returns {*}
   */
  uploadLogo: (params) => {
    return request({
      url: '/basedata/paytype/upload/logo',
      region: 'basedata-api',
      method: 'post',
      dataType: 'file',
      data: params
    })
  }
}
