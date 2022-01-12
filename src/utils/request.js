import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import settings from '@/settings'
import qs from 'qs'
import msg from '@/utils/msg'
import utils from '@/utils/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: settings.timeout // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers[settings.tokenKey] = getToken()
    }

    if (config.method !== 'get') {
      if (utils.isEmpty(config.data) && !utils.isEmpty(config.params)) {
        config.data = config.params
        config.params = undefined
      }
    }

    // 只有显示标注使用json传参时，才会使用json
    if (config.dataType === 'json') {
      config.headers['Content-Type'] = 'application/json'
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
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.config.responseType === 'blob') {
      const content = response.data
      const blob = new Blob([content])
      const fileName = decodeURIComponent(response.headers.filename)
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
  error => {
    const { data } = error.response || { data: {}}
    if (error.request.responseType === 'blob') {
      const reader = new FileReader() // 创建读取文件对象
      reader.addEventListener('loadend', function() { //
        try {
          const res = JSON.parse(reader.result) // 返回的数据
          handleErrorData(res)
        } catch (e) {
          handleErrorData({})
        }
      })
      reader.readAsText(data, 'utf-8')
      return Promise.reject({})
    }

    handleErrorData(data)

    return Promise.reject(data)
  }
)

const handleErrorData = (v) => {
  const data = Object.assign({
    code: 500,
    msg: '网络请求错误，请稍后重试！'
  }, v)

  const { code } = data
  // 业务错误
  if (code === 401) {
    msg.confirm('由于您长时间未操作，已经自动退出登录，您可以取消以停留在此页面，或重新登录', '确认重新登录', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 跳转登录页面
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    })
  } else {
    msg.error(data.msg)
  }
}
export default service
