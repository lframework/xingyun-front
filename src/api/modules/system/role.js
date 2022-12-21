import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/system/role/query',
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
      url: '/system/role',
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
      url: '/system/role',
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
      url: '/system/role',
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
      url: '/system/role/enable/batch',
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
      url: '/system/role/unable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  /**
   * 查询角色的菜单
   * @param params
   * @returns {AxiosPromise}
   */
  menus: (params) => {
    return request({
      url: '/system/role/menu/menus',
      region: 'common-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 授权角色菜单
   * @param params
   * @returns {*}
   */
  setting: (params) => {
    return request({
      url: '/system/role/menu/setting',
      region: 'common-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  }
}
