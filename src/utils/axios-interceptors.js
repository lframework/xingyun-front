import qs from 'qs'
import msg from '@/utils/msg'
import utils from '@/utils/utils'
import { METHOD, DATA_TYPE, RESP_TYPE, removeAuthorization, getAuthorization } from '@/utils/request'
import settings from '@/config'

const respCommon = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response) {
    if (response.config.responseType === RESP_TYPE.BLOB) {
      const content = response.data
      const blob = new Blob([content])
      const url = response.config.url
      const fileName = response.headers.filename ? decodeURIComponent(response.headers.filename) : url.substring(url.lastIndexOf('/') + 1, url.length)
      if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
        const link = document.createElement('a') // 创建a标签
        link.download = fileName // a标签添加属性
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click() // 执行下载
        URL.revokeObjectURL(link.href) // 释放url
        document.body.removeChild(link) // 释放标签
      } else { // 其他浏览器
        navigator.msSaveBlob(blob, fileName)
      }

      return {}
    }

    const { data } = response
    return data.data
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error) {
    const { data } = error.response || { data: {}}
    const hiddenError = error.response.config.hiddenError || false
    if (error.request.responseType === RESP_TYPE.BLOB) {
      const reader = new FileReader() // 创建读取文件对象
      reader.addEventListener('loadend', function() { //
        try {
          const res = JSON.parse(reader.result) // 返回的数据
          handleErrorData(res, hiddenError)
        } catch (e) {
          handleErrorData({}, hiddenError)
        }
      })
      reader.readAsText(data, 'utf-8')

      return Promise.reject({})
    }

    handleErrorData(data, hiddenError)

    return Promise.reject(data)
  }
}
const handleErrorData = (v, hiddenError) => {
  if (hiddenError) {
    return
  }
  if (utils.isEmpty(v.msg) && !utils.isEmpty(v.message)) {
    v.msg = v.message
  }

  const data = Object.assign({
    code: 500,
    msg: '网络请求错误，请稍后重试！'
  }, v)

  const { code } = data
  // 业务错误
  if (code === 401) {
    msg.confirm('由于您长时间未操作，已经自动退出登录，您可以取消以停留在此页面，或重新登录', '确认重新登录', {
      okText: '重新登录',
      cancelText: '取消'
    }).then(() => {
      removeAuthorization()

      window.location.reload()
    })
  } else {
    msg.error(data.msg)
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config) {
    const token = getAuthorization()

    config.headers[settings.tokenKey] = token || ''

    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error) {
    return Promise.reject(error)
  }
}

// 请求数据转换
const reqConvert = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config) {
    if (config.method !== METHOD.GET) {
      if (utils.isEmpty(config.data) && !utils.isEmpty(config.params)) {
        config.data = config.params
        config.params = undefined
      }
    }

    // 只有显示标注使用json传参时，才会使用json
    if (config.dataType === DATA_TYPE.JSON) {
      config.headers['Content-Type'] = 'application/json'
    } else if (config.dataType === DATA_TYPE.FILE) {
      config.headers['Content-Type'] = 'multipart/form-data'

      const uploadParams = new FormData()
      const data = config.data

      utils.keys(data).forEach(item => {
        uploadParams.append(item, data[item])
      })

      config.data = uploadParams
    } else {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      // 转为formData数据格式
      config.data = qs.stringify(config.data)
    }

    // 获取请求参数
    let requestData = config.data || {}
    if (utils.isEmpty(requestData)) {
      requestData = config.params || {}
    }

    // 请求参数摘要
    const hash = utils.md5(requestData)
    config.headers['Request-Id'] = hash

    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error) {
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon, reqConvert], // 请求拦截
  response: [respCommon] // 响应拦截
}
