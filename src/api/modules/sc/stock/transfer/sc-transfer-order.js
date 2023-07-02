import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/stock/transfer/sc/query',
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
      url: '/stock/transfer/sc/detail',
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
      url: '/stock/transfer/sc',
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
      url: '/stock/transfer/sc',
      region: 'cloud-api',
      method: 'put',
      dataType: 'json',
      data: params
    })
  },

  /**
   * 删除
   * @param params
   * @returns {AxiosPromise}
   */
  deleteById: (id) => {
    return request({
      url: '/stock/transfer/sc',
      region: 'cloud-api',
      method: 'delete',
      data: {
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
      url: '/stock/transfer/sc/product/search',
      region: 'cloud-api',
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
      url: '/stock/transfer/sc/product/list',
      region: 'cloud-api',
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
      url: '/stock/transfer/sc/export',
      region: 'cloud-api',
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
      url: '/stock/transfer/sc/approve/pass/direct',
      region: 'cloud-api',
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
      url: '/stock/transfer/sc/approve/pass',
      region: 'cloud-api',
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
      url: '/stock/transfer/sc/approve/refuse',
      region: 'cloud-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  // 批量删除订单
  batchDelete: (params) => {
    return request({
      url: '/stock/transfer/sc/batch',
      region: 'cloud-api',
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
      url: '/stock/transfer/sc/approve/pass/batch',
      region: 'cloud-api',
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
      url: '/stock/transfer/sc/approve/refuse/batch',
      region: 'cloud-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 收货
   * @param params
   * @returns {*}
   */
  receive: (params) => {
    return request({
      url: '/stock/transfer/sc/receive',
      region: 'cloud-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 收货记录
   * @param params
   * @returns {*}
   */
  queryDetailReceive: (params) => {
    return request({
      url: '/stock/transfer/sc/receive/detail',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  }
}
