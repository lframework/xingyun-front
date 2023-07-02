import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/stock/take/pre/query',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  },

  /**
   * 导出列表
   * @param params
   * @returns {AxiosPromise}
   */
  exportList: (params) => {
    return request({
      url: '/stock/take/pre/export',
      region: 'cloud-api',
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
      url: '/stock/take/pre',
      region: 'cloud-api',
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
      url: '/stock/take/pre',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
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
      url: '/stock/take/pre',
      region: 'cloud-api',
      method: 'put',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 根据关键字查询商品
   * @param params
   * @returns {AxiosPromise}
   */
  searchProduct: (condition) => {
    return request({
      url: '/stock/take/pre/product/search',
      region: 'cloud-api',
      method: 'get',
      params: {
        condition: condition
      }
    })
  },
  /**
   * 查询商品列表
   * @param params
   * @returns {AxiosPromise}
   */
  queryProduct: (params) => {
    return request({
      url: '/stock/take/pre/product/list',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 根据ID删除
   * @param id
   * @returns {*}
   */
  deleteById: (id) => {
    return request({
      url: '/stock/take/pre/',
      region: 'cloud-api',
      method: 'delete',
      data: {
        id: id
      }
    })
  },
  /**
   * 根据ID批量删除
   * @param id
   * @returns {*}
   */
  batchDelete: (params) => {
    return request({
      url: '/stock/take/pre/batch',
      region: 'cloud-api',
      method: 'delete',
      dataType: 'json',
      data: params
    })
  },

  /**
   * 根据预先盘点单、盘点任务查询商品信息
   * @param params
   * @returns {*}
   */
  getProducts: (params) => {
    return request({
      url: '/stock/take/pre/products',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  }
}
