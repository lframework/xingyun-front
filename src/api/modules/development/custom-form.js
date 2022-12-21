import { request } from '@/utils/request'

const data = {
  /**
   * 自定义表单分类
   * @returns {AxiosPromise}
   */
  queryCategories: () => {
    return request({
      url: '/gen/custom/form/category/query',
      region: 'common-api',
      method: 'get'
    })
  },
  /**
   * 新增自定义表单分类
   * @param params
   * @returns {AxiosPromise}
   */
  createCategory: (params) => {
    return request({
      url: '/gen/custom/form/category',
      region: 'common-api',
      method: 'post',
      data: params
    })
  },
  /**
   * 修改自定义表单分类
   * @param params
   * @returns {AxiosPromise}
   */
  modifyCategory: (params) => {
    return request({
      url: '/gen/custom/form/category',
      region: 'common-api',
      method: 'put',
      data: params
    })
  },
  /**
   * 根据ID查询自定义表单分类
   * @param id
   * @returns {AxiosPromise}
   */
  getCategory: (id) => {
    return request({
      url: '/gen/custom/form/category',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 删除自定义表单分类
   * @param id
   * @returns {*}
   */
  removeCategory: (id) => {
    return request({
      url: '/gen/custom/form/category',
      region: 'common-api',
      method: 'delete',
      data: {
        id: id
      }
    })
  },
  query: (data) => {
    return request({
      url: '/gen/custom/form/query',
      region: 'common-api',
      method: 'get',
      params: data
    })
  },
  add: (data) => {
    return request({
      url: '/gen/custom/form',
      region: 'common-api',
      method: 'post',
      dataType: 'json',
      data
    })
  },
  get: (id) => {
    return request({
      url: '/gen/custom/form',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  modify: (data) => {
    return request({
      url: '/gen/custom/form',
      region: 'common-api',
      dataType: 'json',
      method: 'put',
      data
    })
  },
  deleteById: (id) => {
    return request({
      url: '/gen/custom/form',
      region: 'common-api',
      method: 'delete',
      data: {
        id: id
      }
    })
  },
  batchDelete: (ids) => {
    return request({
      url: '/gen/custom/form/batch',
      region: 'common-api',
      method: 'delete',
      dataType: 'json',
      data: ids
    })
  },
  batchEnable: (ids) => {
    return request({
      url: '/gen/custom/form/enable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  batchUnable: (ids) => {
    return request({
      url: '/gen/custom/form/unable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  }
}

export default data
