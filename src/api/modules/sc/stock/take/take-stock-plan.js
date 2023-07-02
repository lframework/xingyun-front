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
      region: 'cloud-api',
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
      region: 'cloud-api',
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
  getDetail: (id) => {
    return request({
      url: '/stock/take/plan/detail',
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
      url: '/stock/take/plan',
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
      url: '/stock/take/plan',
      region: 'cloud-api',
      method: 'put',
      data: params
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
      region: 'cloud-api',
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
      region: 'cloud-api',
      method: 'patch',
      data: {
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
      region: 'cloud-api',
      method: 'patch',
      dataType: 'json',
      data: params
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
      region: 'cloud-api',
      method: 'patch',
      data: {
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
      region: 'cloud-api',
      method: 'delete',
      data: {
        id: id
      }
    })
  }
}
