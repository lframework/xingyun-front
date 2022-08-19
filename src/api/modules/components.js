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
  },
  /**
   * 富文本编辑器上传图片
   * @param file
   * @returns {*}
   */
  editorUploadImage: (file) => {
    return request({
      url: '/component/editor/upload/image',
      method: 'post',
      dataType: 'file',
      params: {
        file: file
      }
    })
  }
}
export default components
