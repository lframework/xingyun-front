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
      url: '/system/user',
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
      url: '/system/user/enable/batch',
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
      method: 'patch',
      params: {
        id: id
      }
    })
  }
}
