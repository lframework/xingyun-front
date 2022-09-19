import { request } from '@/utils/request'

const simpledb = {
  getTables: (data) => {
    return request({
      url: '/gen/simpledb/tables',
      region: 'common-api',
      method: 'get',
      params: data
    })
  }
}

export default simpledb
