import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/stock/adjust/cost/query',
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
      url: '/stock/adjust/cost/detail',
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
      url: '/stock/adjust/cost',
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
      url: '/stock/adjust/cost',
      method: 'put',
      dataType: 'json',
      params: params
    })
  },

  /**
   * 删除
   * @param params
   * @returns {AxiosPromise}
   */
  deleteById: (id) => {
    return request({
      url: '/stock/adjust/cost',
      method: 'delete',
      params: {
        id: id
      }
    })
  },

  /**
   * 根据关键字查询商品
   * @param params
   * @returns {AxiosPromise}
   */
  searchProduct: (params) => {
    return request({
      url: '/stock/adjust/cost/product/search',
      method: 'get',
      params: params
    })
  },
  /**
   * 查询商品列表
   * @param params
   * @returns {AxiosPromise}
   */
  queryProduct: (params) => {
    return request({
      url: '/stock/adjust/cost/product/list',
      method: 'get',
      params: params
    })
  },
  /**
   * 导出列表
   * @param params
   */
  exportList: (params) => {
    return request({
      url: '/stock/adjust/cost/export',
      method: 'post',
      responseType: 'blob',
      data: params
    })
  },
  /**
   * 直接审核通过
   * @param params
   * @returns {*}
   */
  directApprovePass: (params) => {
    return request({
      url: '/stock/adjust/cost/approve/pass/direct',
      method: 'post',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 审核通过
   * @param params
   * @returns {*}
   */
  approvePass: (params) => {
    return request({
      url: '/stock/adjust/cost/approve/pass',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 审核拒绝
   * @param params
   * @returns {*}
   */
  approveRefuse: (params) => {
    return request({
      url: '/stock/adjust/cost/approve/refuse',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  // 批量删除订单
  batchDelete: (params) => {
    return request({
      url: '/stock/adjust/cost/batch',
      method: 'delete',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 批量审核通过订单
   * @param params
   * @returns {*}
   */
  batchApprovePass: (params) => {
    return request({
      url: '/stock/adjust/cost/approve/pass/batch',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 批量审核拒绝
   * @param params
   * @returns {*}
   */
  batchApproveRefuse: (params) => {
    return request({
      url: '/stock/adjust/cost/approve/refuse/batch',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  }
}
