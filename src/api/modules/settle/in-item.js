import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/settle/item/in/query',
      region: 'settle',
      method: 'get',
      params: params
    })
  },
  /**
   * 导出列表
   * @param params
   */
  exportList: (params) => {
    return request({
      url: '/settle/item/in/export',
      region: 'settle',
      method: 'post',
      responseType: 'blob',
      data: params
    })
  },
  /**
   * 根据ID查询
   * @param id
   * @returns {AxiosPromise}
   */
  get: (id) => {
    return request({
      url: '/settle/item/in',
      region: 'settle',
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
      url: '/settle/item/in',
      region: 'settle',
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
      url: '/settle/item/in',
      region: 'settle',
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
      url: '/settle/item/in/enable/batch',
      region: 'settle',
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
      url: '/settle/item/in/unable/batch',
      region: 'settle',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  }
}
