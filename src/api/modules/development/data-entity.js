import { request } from '@/utils/request'

const data = {
  /**
   * 数据实体分类
   * @returns {AxiosPromise}
   */
  queryCategories: () => {
    return request({
      url: '/gen/data/entity/category/query',
      region: 'common-api',
      method: 'get'
    })
  },
  /**
   * 新增数据实体分类
   * @param params
   * @returns {AxiosPromise}
   */
  createCategory: (params) => {
    return request({
      url: '/gen/data/entity/category',
      region: 'common-api',
      method: 'post',
      params: params
    })
  },
  /**
   * 修改数据实体分类
   * @param params
   * @returns {AxiosPromise}
   */
  modifyCategory: (params) => {
    return request({
      url: '/gen/data/entity/category',
      region: 'common-api',
      method: 'put',
      params: params
    })
  },
  /**
   * 根据ID查询数据实体分类
   * @param id
   * @returns {AxiosPromise}
   */
  getCategory: (id) => {
    return request({
      url: '/gen/data/entity/category',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  /**
   * 删除数据实体分类
   * @param id
   * @returns {*}
   */
  removeCategory: (id) => {
    return request({
      url: '/gen/data/entity/category',
      region: 'common-api',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  query: (data) => {
    return request({
      url: '/gen/data/entity/query',
      region: 'common-api',
      method: 'get',
      params: data
    })
  },
  queryColumns: (data) => {
    return request({
      url: '/gen/data/entity/query/columns',
      region: 'common-api',
      method: 'get',
      params: data
    })
  },
  add: (data) => {
    return request({
      url: '/gen/data/entity',
      region: 'common-api',
      method: 'post',
      dataType: 'json',
      data
    })
  },
  get: (id) => {
    return request({
      url: '/gen/data/entity',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  modify: (data) => {
    return request({
      url: '/gen/data/entity',
      region: 'common-api',
      dataType: 'json',
      method: 'put',
      data
    })
  },
  deleteById: (id) => {
    return request({
      url: '/gen/data/entity',
      region: 'common-api',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  batchDelete: (ids) => {
    return request({
      url: '/gen/data/entity/batch',
      region: 'common-api',
      method: 'delete',
      dataType: 'json',
      data: ids
    })
  },
  batchEnable: (ids) => {
    return request({
      url: '/gen/data/entity/enable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  batchUnable: (ids) => {
    return request({
      url: '/gen/data/entity/unable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  getGenerate: (id) => {
    return request({
      url: '/gen/data/entity/generate',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  updateGenerate: (params) => {
    return request({
      url: '/gen/data/entity/generate',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  preView: (id) => {
    return request({
      url: '/gen/data/entity/preview',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  download: (id) => {
    return request({
      url: '/gen/data/entity/download',
      region: 'common-api',
      method: 'get',
      responseType: 'blob',
      params: {
        id: id
      }
    })
  },
  syncTable: (id) => {
    return request({
      url: '/gen/data/entity/sync/table',
      region: 'common-api',
      method: 'put',
      params: {
        id: id
      }
    })
  }
}

export default data
