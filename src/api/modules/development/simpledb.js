import { request } from '@/utils/request'

const simpledb = {
  getTables: (data) => {
    return request({
      url: '/gen/simpledb/tables',
      region: 'common',
      method: 'get',
      params: data
    })
  },
  create: (data) => {
    return request({
      url: '/gen/simpledb/create',
      region: 'common',
      method: 'post',
      data: data
    })
  }
}

export default simpledb
