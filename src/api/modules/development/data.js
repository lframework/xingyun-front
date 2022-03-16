import { request } from '@/utils/request'

const data = {
  query: (data) => {
    return request({
      url: '/gen/dataobj/query',
      method: 'get',
      params: data
    })
  },
  add: (data) => {
    return request({
      url: '/gen/dataobj',
      method: 'post',
      data
    })
  },
  get: (id) => {
    return request({
      url: '/gen/dataobj',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  modify: (data) => {
    return request({
      url: '/gen/dataobj',
      method: 'put',
      data
    })
  },
  deleteById: (id) => {
    return request({
      url: '/gen/dataobj',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  batchDelete: (ids) => {
    return request({
      url: '/gen/dataobj/batch',
      method: 'delete',
      dataType: 'json',
      data: ids
    })
  },
  batchEnable: (ids) => {
    return request({
      url: '/gen/dataobj/enable/batch',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  batchUnable: (ids) => {
    return request({
      url: '/gen/dataobj/unable/batch',
      method: 'patch',
      dataType: 'json',
      data: ids
    })
  },
  getGenerate: (id) => {
    return request({
      url: '/gen/dataobj/generate',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  updateGenerate: (params) => {
    return request({
      url: '/gen/dataobj/generate',
      method: 'patch',
      dataType: 'json',
      data: params
    })
  },
  preView: (id) => {
    return request({
      url: '/gen/dataobj/preview',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  download: (id) => {
    return request({
      url: '/gen/dataobj/download',
      method: 'get',
      responseType: 'blob',
      params: {
        id: id
      }
    })
  }
}

export default data
