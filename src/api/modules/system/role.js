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
      url: '/system/role',
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
      url: '/system/role/enable/batch',
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
      method: 'post',
      dataType: 'json',
      data: params
    })
  }
}
