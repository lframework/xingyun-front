import { request } from '@/utils/request'

const data = {
  getCustomListConfig: (id) => {
    return request({
      url: '/gen/api/custom/list/config',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  queryCustomListPage: (id, data) => {
    return request({
      url: '/gen/api/custom/list/query',
      region: 'common-api',
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
      region: 'common-api',
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
      region: 'common-api',
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
      region: 'common-api',
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
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  getCustomFormConfig: (id) => {
    return request({
      url: '/gen/api/custom/form/config',
      region: 'common-api',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  customFormGetData: (id, data) => {
    return request({
      url: '/gen/api/custom/form/get',
      region: 'common-api',
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
      region: 'common-api',
      method: 'post',
      dataType: 'json',
      params: {
        id: id
      },
      data: data
    })
  }
}

export default data
