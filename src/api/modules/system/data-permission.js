import { request } from '@/utils/request'

export default {
  /**
   * 根据模型ID查询
   * @returns {AxiosPromise}
   */
  getByModelId: (modelId) => {
    return request({
      url: '/system/data/permission/model/detail',
      region: 'cloud-api',
      method: 'get',
      params: {
        modelId: modelId
      }
    })
  },
  /**
   * 预览SQL
   * @param params
   * @returns {*}
   */
  preview: (params) => {
    return request({
      url: '/system/data/permission/model/detail/preview',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      data: params
    })
  },
  /**
   * 根据业务ID查询
   * @returns {AxiosPromise}
   */
  queryByBizId: (params) => {
    return request({
      url: '/system/data/permission/model/detail/query',
      region: 'cloud-api',
      method: 'get',
      params: params
    })
  },
  /**
   * 保存数据
   * @param data
   * @returns {*}
   */
  saveData: (data) => {
    return request({
      url: '/system/data/permission/data',
      region: 'cloud-api',
      method: 'post',
      dataType: 'json',
      data: data
    })
  }
}
