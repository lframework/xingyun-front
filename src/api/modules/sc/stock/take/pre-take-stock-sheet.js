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
      method: 'post',
      responseType: 'blob',
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
      url: '/stock/take/pre',
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
      method: 'post',
      dataType: 'json',
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
      url: '/stock/take/pre',
      method: 'put',
      dataType: 'json',
      params: params
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
      method: 'delete',
      params: {
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
      method: 'delete',
      dataType: 'json',
      params: params
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
      method: 'get',
      params: params
    })
  }
}
