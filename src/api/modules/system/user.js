import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/system/user/query',
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
      url: '/system/user',
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
      url: '/system/user',
      region: 'common-api',
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
      url: '/system/user',
      region: 'common-api',
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
      url: '/system/user/enable/batch',
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
      url: '/system/user/unable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  /**
   * 查询用户的角色
   * @param params
   * @returns {AxiosPromise}
   */
  roles: (params) => {
    return request({
      url: '/system/user/role/roles',
      region: 'common-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 授权用户角色
   * @param params
   * @returns {*}
   */
  setting: (params) => {
    return request({
      url: '/system/user/role/setting',
      region: 'common-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 根据ID解锁
   * @param id
   * @returns {*}
   */
  unlock: (id) => {
    return request({
      url: '/system/user/unlock',
      region: 'common-api',
      method: 'patch',
      data: {
        id: id
      }
    })
  }
}
