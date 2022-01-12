import request from '@/utils/request'

export default {

  /**
   * 新增
   * @param params
   * @returns {AxiosPromise}
   */
  create: (params) => {
    return request({
      url: '/basedata/product/poly',
      method: 'post',
      dataType: 'json',
      data: params
    })
  }
}
