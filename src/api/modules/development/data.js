import { request } from '@/utils/request'

const data = {
  query: (data) => {
    return request({
      url: '/gen/dataobj/query',
      region: 'common',
      method: 'get',
      params: data
    })
  },
  add: (data) => {
    return request({
      url: '/gen/dataobj',
      region: 'common',
      method: 'post',
      data
    })
  },
  get: (id) => {
    return request({
      url: '/gen/dataobj',
      region: 'common',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  modify: (data) => {
    return request({
      url: '/gen/dataobj',
      region: 'common',
      method: 'put',
      data
    })
  },
  deleteById: (id) => {
    return request({
      url: '/gen/dataobj',
      region: 'common',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  batchDelete: (ids) => {
    return request({
      url: '/gen/dataobj/batch',
      region: 'common',
      method: 'delete',
      dataType: 'json',
      data: ids
    })
  },
  batchEnable: (ids) => {
    return request({
      url: '/gen/dataobj/enable/batch',
      region: 'common',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  batchUnable: (ids) => {
    return request({
      url: '/gen/dataobj/unable/batch',
      region: 'common',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  getGenerate: (id) => {
    return request({
      url: '/gen/dataobj/generate',
      region: 'common',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  updateGenerate: (params) => {
    return request({
      url: '/gen/dataobj/generate',
      region: 'common',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  preView: (id) => {
    return request({
      url: '/gen/dataobj/preview',
      region: 'common',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  download: (id) => {
    return request({
      url: '/gen/dataobj/download',
      region: 'common',
      method: 'get',
      responseType: 'blob',
      params: {
        id: id
      }
    })
  }
}

export default data
