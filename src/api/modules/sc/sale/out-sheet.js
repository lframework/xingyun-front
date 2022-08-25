import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/sale/out/sheet/query',
      region: 'sc',
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
      url: '/sale/out/sheet/export',
      region: 'sc',
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
      url: '/sale/out/sheet',
      region: 'sc',
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
      url: '/sale/out/sheet/print',
      region: 'sc',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 根据ID查询（销售退货业务）
   * @param id
   * @returns {AxiosPromise}
   */
  getWithReturn: (id) => {
    return request({
      url: '/sale/out/sheet/return',
      region: 'sc',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 根据客户ID查询付款日期
   * @param customerId
   */
  getPaymentDate: (customerId) => {
    return request({
      url: '/sale/out/sheet/paymentdate',
      region: 'sc',
      method: 'get',
      params: {
        customerId: customerId
      }
    })
  },
  /**
   * 创建
   * @param params
   * @returns {*}
   */
  createOrder: (params) => {
    return request({
      url: '/sale/out/sheet',
      region: 'sc',
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
      url: '/sale/out/sheet/approve/pass/direct',
      region: 'sc',
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
      url: '/sale/out/sheet/approve/pass',
      region: 'sc',
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
      url: '/sale/out/sheet/approve/refuse',
      region: 'sc',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 修改
   * @param params
   * @returns {*}
   */
  updateOrder: (params) => {
    return request({
      url: '/sale/out/sheet',
      region: 'sc',
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
      url: '/sale/out/sheet',
      region: 'sc',
      method: 'delete',
      params: params
    })
  },
  // 批量删除订单
  batchDeleteOrder: (params) => {
    return request({
      url: '/sale/out/sheet/batch',
      region: 'sc',
      method: 'delete',
      dataType: 'json',
      data: params
    })
  },
  // 批量审核通过订单
  batchApprovePassOrder: (params) => {
    return request({
      url: '/sale/out/sheet/approve/pass/batch',
      region: 'sc',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  // 批量审核拒绝订单
  batchApproveRefuseOrder: (params) => {
    return request({
      url: '/sale/out/sheet/approve/refuse/batch',
      region: 'sc',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  }
}
