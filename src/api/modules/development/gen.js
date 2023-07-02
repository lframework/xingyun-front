import { request } from '@/utils/request'

const data = {
  getCustomListConfig: (id) => {
    return request({
      url: '/gen/api/custom/list/config',
      region: 'cloud-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  queryCustomListPage: (id, data) => {
    return request({
      url: '/gen/api/custom/list/query',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      params: {
        id: id
      },
      data: data
    })
  },
  queryCustomListDatas: (id, data) => {
    return request({
      url: '/gen/api/custom/list/query/list',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      params: {
        id: id
      },
      data: data
    })
  },
  exportCustomListDatas: (id, data) => {
    return request({
      url: '/gen/api/custom/list/query/list/export',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      responseType: 'blob',
      params: {
        id: id
      },
      data: data
    })
  },
  queryCustomListTree: (id, data) => {
    return request({
      url: '/gen/api/custom/list/query/tree',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      params: {
        id: id
      },
      data: data
    })
  },
  getCustomSelectorConfig: (id) => {
    return request({
      url: '/gen/api/custom/selector/config',
      region: 'cloud-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  getCustomFormConfig: (id) => {
    return request({
      url: '/gen/api/custom/form/config',
      region: 'cloud-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  customFormGetData: (id, data) => {
    return request({
      url: '/gen/api/custom/form/get',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      params: {
        id: id
      },
      data: data
    })
  },
  customFormHandleData: (id, data) => {
    return request({
      url: '/gen/api/custom/form/handle',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      params: {
        id: id
      },
      data: data
    })
  },
  getCustomPageConfig: (id) => {
    return request({
      url: '/gen/api/custom/page/config',
      region: 'cloud-api',
      method: 'get',
      params: {
        id: id
      }
    })
  }
}

export default data
