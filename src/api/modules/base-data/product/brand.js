import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/basedata/product/brand/query',
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
      url: '/basedata/product/brand',
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
      url: '/basedata/product/brand',
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
      url: '/basedata/product/brand',
      method: 'put',
      params: params
    })
  },
  /**
   * 批量启用
   * @param ids
   * @returns {*}
   */
  batchEnable: (ids) => {
    return request({
      url: '/basedata/product/brand/enable/batch',
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
      url: '/basedata/product/brand/unable/batch',
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
      url: '/basedata/product/brand/upload/logo',
      method: 'post',
      dataType: 'file',
      params: params
    })
  }
}
