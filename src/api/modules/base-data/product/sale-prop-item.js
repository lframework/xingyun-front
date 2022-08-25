import { request } from '@/utils/request'

export default {
  /**
   * 查询列表
   * @param params
   * @returns {AxiosPromise}
   */
  query: (params) => {
    return request({
      url: '/basedata/product/saleprop/item/query',
      region: 'basedata',
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
      url: '/basedata/product/saleprop/item',
      region: 'basedata',
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
      url: '/basedata/product/saleprop/item',
      region: 'basedata',
      method: 'post',
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
      url: '/basedata/product/saleprop/item',
      region: 'basedata',
      method: 'put',
      params: params
    })
  },
  /**
   * 批量启用
   * @param ids
   * @returns {*}
   */
  batchEnable: (ids) => {
    return request({
      url: '/basedata/product/saleprop/item/enable/batch',
      region: 'basedata',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  /**
   * 批量停用
   * @param ids
   * @returns {*}
   */
  batchUnable: (ids) => {
    return request({
      url: '/basedata/product/saleprop/item/unable/batch',
      region: 'basedata',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  /**
   * 根据规格组ID查询启用的规格
   * @param groupId
   * @returns {AxiosPromise}
   */
  getEnables: (groupId) => {
    return request({
      url: '/basedata/product/saleprop/item/enable',
      region: 'basedata',
      method: 'get',
      params: {
        groupId: groupId
      }
    })
  }
}
