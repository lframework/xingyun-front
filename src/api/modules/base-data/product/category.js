import { request } from '@/utils/request'

export default {
  /**
   * 类目树形数据
   * @returns {AxiosPromise}
   */
  query: () => {
    return request({
      url: '/basedata/product/category/query',
      region: 'basedata',
      method: 'get'
    })
  },
  /**
   * 根据ID查询
   * @param id
   * @returns {AxiosPromise}
   */
  get: (id) => {
    return request({
      url: '/basedata/product/category',
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
      url: '/basedata/product/category',
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
      url: '/basedata/product/category',
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
      url: '/basedata/product/category/enable/batch',
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
      url: '/basedata/product/category/unable/batch',
      region: 'basedata',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  }
}
