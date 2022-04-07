import axios from 'axios'
import config from '@/config'
import store from '@/store'
// 跨域认证信息 header 名

// http method
const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete'
}

const DATA_TYPE = {
  JSON: 'json',
  // 默认为此类型
  FORM: 'form',
  FILE: 'file'
}

const RESP_TYPE = {
  // 文件
  BLOB: 'blob',
  // 普通 默认为此类型
  NORMAL: 'normal'
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: config.timeout // request timeout
})

/**
 * 设置认证信息
 * @param auth {Object}
 */
function setAuthorization(auth) {
  store.commit('auth/setToken', auth.token)
}

/**
 * 移除认证信息
 */
function removeAuthorization() {
  store.commit('auth/removeToken')
}

/**
 * 检查认证信息
 * @returns {boolean}
 */
function getAuthorization() {
  return store.getters['auth/token']
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const { request, response } = interceptors
  // 加载请求拦截器
  request.forEach(item => {
    let { onFulfilled, onRejected } = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = config => config
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    service.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    )
  })
  // 加载响应拦截器
  response.forEach(item => {
    let { onFulfilled, onRejected } = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = response => response
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    service.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    )
  })
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {}
  if (!url || url === '' || typeof url !== 'string') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
  }
  return params
}

export {
  METHOD,
  DATA_TYPE,
  RESP_TYPE,
  service as request,
  setAuthorization,
  removeAuthorization,
  getAuthorization,
  loadInterceptors,
  parseUrlParams
}
