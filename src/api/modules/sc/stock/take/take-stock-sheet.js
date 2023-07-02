import { request } from '@/utils/request'

export default {

  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/stock/take/sheet/query',
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
      url: '/stock/take/sheet/export',
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
      url: '/stock/take/sheet/detail',
      region: 'cloud-api',
      method: 'get',
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
  searchProduct: (planId, condition) => {
    return request({
      url: '/stock/take/sheet/product/search',
      region: 'cloud-api',
      method: 'get',
      params: {
        planId: planId,
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
      url: '/stock/take/sheet/product/list',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  },

  /**
   * 新增
   * @param params
   * @returns {AxiosPromise}
   */
  create: (params) => {
    return request({
      url: '/stock/take/sheet',
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
      url: '/stock/take/sheet',
      region: 'cloud-api',
      method: 'put',
      dataType: 'json',
      data: params
    })
  },

  /**
   * 审核通过
   * @param params
   */
  approvePass: (params) => {
    return request({
      url: '/stock/take/sheet/approve/pass',
      region: 'cloud-api',
      method: 'patch',
      data: params
    })
  },

  /**
   * 直接审核通过
   * @param params
   */
  directApprovePass: (params) => {
    return request({
      url: '/stock/take/sheet/approve/direct',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  },

  /**
   * 审核拒绝
   * @param params
   */
  approveRefuse: (params) => {
    return request({
      url: '/stock/take/sheet/approve/refuse',
      region: 'cloud-api',
      method: 'patch',
      data: params
    })
  },

  /**
   * 取消审核
   * @param params
   */
  cancelApprove: (params) => {
    return request({
      url: '/stock/take/sheet/approve/cancel',
      region: 'cloud-api',
      method: 'patch',
      data: params
    })
  },

  /**
   * 批量审核通过
   * @param params
   * @returns {*}
   */
  batchApprovePass: (params) => {
    return request({
      url: '/stock/take/sheet/approve/pass/batch',
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
      url: '/stock/take/sheet/approve/refuse/batch',
      region: 'cloud-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },

  /**
   * 删除
   * @param id
   * @returns {*}
   */
  deleteById: (id) => {
    return request({
      url: '/stock/take/sheet',
      region: 'cloud-api',
      method: 'delete',
      data: {
        id: id
      }
    })
  },

  /**
   * 批量删除
   * @param params
   * @returns {*}
   */
  batchDelete: (params) => {
    return request({
      url: '/stock/take/sheet/batch',
      region: 'cloud-api',
      method: 'delete',
      dataType: 'json',
      data: params
    })
  }
}
