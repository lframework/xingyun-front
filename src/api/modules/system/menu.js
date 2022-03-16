import { request } from '@/utils/request'

export default {
  /**
   * 系统菜单列表
   * @returns {AxiosPromise}
   */
  query: () => {
    return request({
      url: '/system/menu/query',
      method: 'get'
    })
  },
  /**
   * 新增系统菜单
   * @param data
   * @returns {AxiosPromise}
   */
  create: (data) => {
    return request({
      url: '/system/menu',
      method: 'post',
      data
    })
  },
  /**
   * 修改系统菜单
   * @param data
   * @returns {AxiosPromise}
   */
  modify: (data) => {
    return request({
      url: '/system/menu',
      method: 'put',
      data
    })
  },
  /**
   * 根据ID查询
   * @param id
   */
  get: (id) => {
    return request({
      url: '/system/menu',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 根据ID删除
   * @param id
   * @returns {AxiosPromise}
   */
  deleteById: (id) => {
    return request({
      url: '/system/menu',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  /**
   * 批量启用
   * @param ids
   * @returns {*}
   */
  batchEnable: (ids) => {
    return request({
      url: '/system/menu/enable/batch',
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
      url: '/system/menu/unable/batch',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  }
}
