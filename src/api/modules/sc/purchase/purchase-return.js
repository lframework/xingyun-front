import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/purchase/return/query',
      region: 'sc-api',
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
      url: '/purchase/return/export',
      region: 'sc-api',
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
      url: '/purchase/return',
      region: 'sc-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 打印
   * @param id
   * @returns {AxiosPromise}
   */
  print: (id) => {
    return request({
      url: '/purchase/return/print',
      region: 'sc-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 创建订单
   * @param params
   * @returns {*}
   */
  createOrder: (params) => {
    return request({
      url: '/purchase/return',
      region: 'sc-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 直接审核通过
   * @param params
   * @returns {*}
   */
  directApprovePassOrder: (params) => {
    return request({
      url: '/purchase/return/approve/pass/direct',
      region: 'sc-api',
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
  approvePassOrder: (params) => {
    return request({
      url: '/purchase/return/approve/pass',
      region: 'sc-api',
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
  approveRefuseOrder: (params) => {
    return request({
      url: '/purchase/return/approve/refuse',
      region: 'sc-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 创建订单
   * @param params
   * @returns {*}
   */
  updateOrder: (params) => {
    return request({
      url: '/purchase/return',
      region: 'sc-api',
      method: 'put',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 删除订单
   * @param params
   * @returns {*}
   */
  deleteOrder: (params) => {
    return request({
      url: '/purchase/return',
      region: 'sc-api',
      method: 'delete',
      params: params
    })
  },
  // 批量删除订单
  batchDeleteOrder: (params) => {
    return request({
      url: '/purchase/return/batch',
      region: 'sc-api',
      method: 'delete',
      dataType: 'json',
      data: params
    })
  },
  // 批量审核通过订单
  batchApprovePassOrder: (params) => {
    return request({
      url: '/purchase/return/approve/pass/batch',
      region: 'sc-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  // 批量审核拒绝订单
  batchApproveRefuseOrder: (params) => {
    return request({
      url: '/purchase/return/approve/refuse/batch',
      region: 'sc-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  }
}
