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
  }
}

export default data
