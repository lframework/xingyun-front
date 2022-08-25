import { request } from '@/utils/request'

const simpledb = {
  getTables: (data) => {
    return request({
      url: '/gen/simpledb/tables',
      region: 'common-api',
      method: 'get',
      params: data
    })
  },
  create: (data) => {
    return request({
      url: '/gen/simpledb/create',
      region: 'common-api',
      method: 'post',
      data: data
    })
  }
}

export default simpledb
