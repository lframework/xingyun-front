import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/basedata/product/property/query',
      region: 'basedata',
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
      url: '/basedata/product/property',
      region: 'basedata',
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
      url: '/basedata/product/property',
      region: 'basedata',
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
      url: '/basedata/product/property',
      region: 'basedata',
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
      url: '/basedata/product/property/enable/batch',
      region: 'basedata',
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
      url: '/basedata/product/property/unable/batch',
      region: 'basedata',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  /**
   * 根据类目查询
   * @param categoryId
   * @returns {AxiosPromise}
   */
  getModelorByCategory: (categoryId) => {
    return request({
      url: '/basedata/product/property/modelor/category',
      region: 'basedata',
      method: 'get',
      params: {
        categoryId: categoryId
      }
    })
  }
}
