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
      region: 'cloud-api',
      method: 'get',
      params: {
        address: address
      }
    })
  },
  /**
   * 通用上传图片
   * @param file
   * @returns {*}
   */
  uploadImage: (file) => {
    return request({
      url: '/component/upload/image',
      region: 'cloud-api',
      method: 'post',
      dataType: 'file',
      data: file
    })
  },
  /**
   * 通用上传视频
   * @param file
   * @returns {*}
   */
  uploadVideo: (file) => {
    return request({
      url: '/component/upload/video',
      region: 'cloud-api',
      method: 'post',
      dataType: 'file',
      data: file
    })
  }
}
export default components
