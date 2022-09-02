import { request } from '@/utils/request'

export default {
  /**
   * 部门树形数据
   * @returns {AxiosPromise}
   */
  trees: () => {
    return request({
      url: '/system/dept/trees',
      region: 'common-api',
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
      url: '/system/dept',
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
      url: '/system/dept',
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
      url: '/system/dept',
      region: 'common-api',
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
      url: '/system/dept/enable/batch',
      region: 'common-api',
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
      url: '/system/dept/unable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  }
}
