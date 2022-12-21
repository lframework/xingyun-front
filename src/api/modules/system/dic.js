import { request } from '@/utils/request'

export default {
  /**
   * 数据字典分类
   * @returns {AxiosPromise}
   */
  queryCategories: () => {
    return request({
      url: '/system/dic/category/query',
      region: 'common-api',
      method: 'get'
    })
  },
  /**
   * 新增数据字典分类
   * @param params
   * @returns {AxiosPromise}
   */
  createCategory: (params) => {
    return request({
      url: '/system/dic/category',
      region: 'common-api',
      method: 'post',
      data: params
    })
  },
  /**
   * 修改数据字典分类
   * @param params
   * @returns {AxiosPromise}
   */
  modifyCategory: (params) => {
    return request({
      url: '/system/dic/category',
      region: 'common-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 根据ID查询数据字典分类
   * @param id
   * @returns {AxiosPromise}
   */
  getCategory: (id) => {
    return request({
      url: '/system/dic/category',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 删除数据字典分类
   * @param id
   * @returns {*}
   */
  removeCategory: (id) => {
    return request({
      url: '/system/dic/category',
      region: 'common-api',
      method: 'delete',
      data: {
        id: id
      }
    })
  },
  /**
   * 数据字典
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/system/dic/query',
      region: 'common-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 新增数据字典
   * @param params
   * @returns {AxiosPromise}
   */
  create: (params) => {
    return request({
      url: '/system/dic',
      region: 'common-api',
      method: 'post',
      data: params
    })
  },
  /**
   * 根据ID查询数据字典
   * @param id
   * @returns {AxiosPromise}
   */
  get: (id) => {
    return request({
      url: '/system/dic',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 修改数据字典
   * @param params
   * @returns {AxiosPromise}
   */
  modify: (params) => {
    return request({
      url: '/system/dic',
      region: 'common-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 删除数据字典分类
   * @param id
   * @returns {*}
   */
  remove: (id) => {
    return request({
      url: '/system/dic',
      region: 'common-api',
      method: 'delete',
      data: {
        id: id
      }
    })
  },
  /**
   * 数据字典值
   * @returns {AxiosPromise}
   */
  queryItem: (params) => {
    return request({
      url: '/system/dic/item/query',
      region: 'common-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 新增数据字典值
   * @param params
   * @returns {AxiosPromise}
   */
  createItem: (params) => {
    return request({
      url: '/system/dic/item',
      region: 'common-api',
      method: 'post',
      data: params
    })
  },
  /**
   * 根据ID查询数据字典值
   * @param id
   * @returns {AxiosPromise}
   */
  getItem: (id) => {
    return request({
      url: '/system/dic/item',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 修改数据字典值
   * @param params
   * @returns {AxiosPromise}
   */
  modifyItem: (params) => {
    return request({
      url: '/system/dic/item',
      region: 'common-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 删除数据字典值
   * @param id
   * @returns {*}
   */
  removeItem: (id) => {
    return request({
      url: '/system/dic/item',
      region: 'common-api',
      method: 'delete',
      data: {
        id: id
      }
    })
  },
  /**
   * 根据
   * @param code
   * @returns {*}
   */
  getItemByDicCode: (code) => {
    return request({
      url: '/system/dic/item/bydic',
      region: 'common-api',
      method: 'get',
      params: {
        code: code
      }
    })
  }
}
