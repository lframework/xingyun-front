import { request } from '@/utils/request'

const components = {

  /**
   * 根据地址查询经纬度
   * @param params
   * @returns {AxiosPromise}
   */
  getMapLocation: (address) => {
    return request({
      url: '/component/map/location',
      method: 'get',
      params: {
        address: address
      }
    })
  }
}
export default components
