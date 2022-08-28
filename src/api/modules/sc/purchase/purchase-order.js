import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/purchase/order/query',
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
      url: '/purchase/order/export',
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
      url: '/purchase/order',
      region: 'sc',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 根据ID查询（收货业务）
   * @param id
   * @returns {AxiosPromise}
   */
  getWithReceive: (id) => {
    return request({
      url: '/purchase/order/receive',
      region: 'sc',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 根据关键字查询商品
   * @param condition
   * @returns {AxiosPromise}
   */
  searchProduct: (scId, condition) => {
    return request({
      url: '/basedata/product/purchase/product/search',
      region: 'basedata',
      method: 'get',
      params: {
        scId: scId,
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
      url: '/basedata/product/purchase/product/list',
      region: 'basedata',
      method: 'get',
      params: params
    })
  },
  /**
   * 创建订单
   * @param params
   * @returns {*}
   */
  createOrder: (params) => {
    return request({
      url: '/purchase/order',
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
      url: '/purchase/order/approve/pass/direct',
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
      url: '/purchase/order/approve/pass',
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
      url: '/purchase/order/approve/refuse',
      region: 'sc',
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
      url: '/purchase/order',
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
      url: '/purchase/order',
      region: 'sc',
      method: 'delete',
      params: params
    })
  },
  // 批量删除订单
  batchDeleteOrder: (params) => {
    return request({
      url: '/purchase/order/batch',
      region: 'sc',
      method: 'delete',
      dataType: 'json',
      data: params
    })
  },
  // 批量审核通过订单
  batchApprovePassOrder: (params) => {
    return request({
      url: '/purchase/order/approve/pass/batch',
      region: 'sc',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  // 批量审核拒绝订单
  batchApproveRefuseOrder: (params) => {
    return request({
      url: '/purchase/order/approve/refuse/batch',
      region: 'sc',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 打印
   * @param id
   * @returns {AxiosPromise}
   */
  print: (id) => {
    return request({
      url: '/purchase/order/print',
      region: 'sc',
      method: 'get',
      params: {
        id: id
      }
    })
  }
}
