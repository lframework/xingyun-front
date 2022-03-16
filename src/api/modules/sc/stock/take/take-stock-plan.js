import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/stock/take/plan/query',
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
      url: '/stock/take/plan',
      method: 'get',
      params: {
        id: id
      }
    })
  },

  /**
   * 导出列表
   * @param params
   * @returns {AxiosPromise}
   */
  exportList: (params) => {
    return request({
      url: '/stock/take/plan/export',
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
  getDetail: (id) => {
    return request({
      url: '/stock/take/plan/detail',
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
      url: '/stock/take/plan',
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
      url: '/stock/take/plan',
      method: 'put',
      params: params
    })
  },

  /**
   * 查询盘点任务中的商品信息
   * @param id
   * @returns {*}
   */
  getProducts: (id) => {
    return request({
      url: '/stock/take/plan/products',
      method: 'get',
      params: {
        id: id
      }
    })
  },

  /**
   * 差异生成
   * @param id
   * @returns {*}
   */
  createDiff: (id) => {
    return request({
      url: '/stock/take/plan/diff',
      method: 'patch',
      params: {
        id: id
      }
    })
  },

  /**
   * 差异处理
   * @param id
   * @returns {*}
   */
  handleDiff: (params) => {
    return request({
      url: '/stock/take/plan/handle',
      method: 'patch',
      dataType: 'json',
      params: params
    })
  },

  /**
   * 作废
   * @param id
   * @returns {*}
   */
  cancel: (id) => {
    return request({
      url: '/stock/take/plan/cancel',
      method: 'patch',
      params: {
        id: id
      }
    })
  },

  /**
   * 根据ID删除
   * @param id
   * @returns {*}
   */
  deleteById: (id) => {
    return request({
      url: '/stock/take/plan',
      method: 'delete',
      params: {
        id: id
      }
    })
  }
}
