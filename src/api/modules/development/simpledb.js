import { request } from '@/utils/request'

const simpledb = {
  getTables: (data) => {
    return request({
      url: '/gen/simpledb/tables',
      method: 'get',
      params: data
    })
  },
  create: (data) => {
    return request({
      url: '/gen/simpledb/create',
      method: 'post',
      data: data
    })
  }
}

export default simpledb
