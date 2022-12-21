import { request } from '@/utils/request'

const data = {
  /**
   * 查询列表
   * @param data
   * @returns {AxiosPromise}
   */
  query: (data) => {
    return request({
      url: '/qrtz/query',
      region: 'common-api',
      method: 'get',
      params: data
    })
  },
  /**
   * 创建
   * @param data
   * @returns {*}
   */
  create: (data) => {
    return request({
      url: '/qrtz',
      region: 'common-api',
      method: 'post',
      dataType: 'json',
      data
    })
  },
  /**
   * 查询
   * @param params
   * @returns {AxiosPromise}
   */
  get: (params) => {
    return request({
      url: '/qrtz',
      region: 'common-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 修改
   * @param data
   * @returns {*}
   */
  modify: (data) => {
    return request({
      url: '/qrtz',
      region: 'common-api',
      method: 'put',
      dataType: 'json',
      data
    })
  },
  /**
   * 删除
   * @param params
   * @returns {AxiosPromise}
   */
  remove: (params) => {
    return request({
      url: '/qrtz',
      region: 'common-api',
      method: 'delete',
      data: params
    })
  },
  /**
   * 恢复
   * @param params
   * @returns {AxiosPromise}
   */
  resume: (params) => {
    return request({
      url: '/qrtz/resume',
      region: 'common-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 暂停
   * @param params
   * @returns {AxiosPromise}
   */
  pause: (params) => {
    return request({
      url: '/qrtz/pause',
      region: 'common-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 触发
   * @param params
   * @returns {AxiosPromise}
   */
  trigger: (params) => {
    return request({
      url: '/qrtz/trigger',
      region: 'common-api',
      method: 'put',
      data: params
    })
  }
}

export default data
