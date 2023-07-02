import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/logistics/sheet/query',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 查询业务单据列表
   * @param params
   * @returns {*}
   */
  queryBizOrder: (params) => {
    return request({
      url: '/logistics/sheet/biz',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 详情
   * @param params
   * @returns {*}
   */
  get: (id) => {
    return request({
      url: '/logistics/sheet',
      region: 'cloud-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 计算重量
   * @param params
   * @returns {*}
   */
  calcWeight: (params) => {
    return request({
      url: '/logistics/sheet/calc/weight',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 计算体积
   * @param params
   * @returns {*}
   */
  calcVolume: (params) => {
    return request({
      url: '/logistics/sheet/calc/volume',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 创建
   * @param params
   * @returns {*}
   */
  create: (params) => {
    return request({
      url: '/logistics/sheet',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 修改
   * @param params
   * @returns {*}
   */
  modify: (params) => {
    return request({
      url: '/logistics/sheet',
      region: 'cloud-api',
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
      url: '/logistics/sheet',
      region: 'cloud-api',
      method: 'delete',
      data: params
    })
  },
  // 批量删除订单
  batchDeleteOrder: (params) => {
    return request({
      url: '/logistics/sheet/batch',
      region: 'cloud-api',
      method: 'delete',
      dataType: 'json',
      data: params
    })
  },
  // 查询发货信息
  queryDelivery: (id) => {
    return request({
      url: '/logistics/sheet/delivery',
      region: 'cloud-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  // 发货
  delivery: (params) => {
    return request({
      url: '/logistics/sheet/delivery',
      region: 'cloud-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 导出列表
   * @param params
   * @returns {AxiosPromise}
   */
  exportList: (params) => {
    return request({
      url: '/logistics/sheet/export',
      region: 'cloud-api',
      method: 'post',
      responseType: 'blob',
      params: params
    })
  }
}
