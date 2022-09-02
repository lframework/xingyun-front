import { request } from '@/utils/request'

const data = {
  query: (data) => {
    return request({
      url: '/gen/dataobj/query',
      region: 'common-api',
      method: 'get',
      params: data
    })
  },
  add: (data) => {
    return request({
      url: '/gen/dataobj',
      region: 'common-api',
      method: 'post',
      data
    })
  },
  get: (id) => {
    return request({
      url: '/gen/dataobj',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  modify: (data) => {
    return request({
      url: '/gen/dataobj',
      region: 'common-api',
      method: 'put',
      data
    })
  },
  deleteById: (id) => {
    return request({
      url: '/gen/dataobj',
      region: 'common-api',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  batchDelete: (ids) => {
    return request({
      url: '/gen/dataobj/batch',
      region: 'common-api',
      method: 'delete',
      dataType: 'json',
      data: ids
    })
  },
  batchEnable: (ids) => {
    return request({
      url: '/gen/dataobj/enable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  batchUnable: (ids) => {
    return request({
      url: '/gen/dataobj/unable/batch',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  getGenerate: (id) => {
    return request({
      url: '/gen/dataobj/generate',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  updateGenerate: (params) => {
    return request({
      url: '/gen/dataobj/generate',
      region: 'common-api',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  preView: (id) => {
    return request({
      url: '/gen/dataobj/preview',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  download: (id) => {
    return request({
      url: '/gen/dataobj/download',
      region: 'common-api',
      method: 'get',
      responseType: 'blob',
      params: {
        id: id
      }
    })
  }
}

export default data
