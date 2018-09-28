import axios from 'axios'
import {BASE_URL} from '../common/config'
axios.defaults.timeout = 30000
axios.defaults.withCredentials = false
axios.defaults.baseURL = BASE_URL
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求前做些什么
    config.data = JSON.stringify(config.data)
    // application/x-www-form-urlencoded
    // application/json
    config.headers = {
      'Content-Type': 'application/json;charset=utf-8'
    }
    if (localStorage.getItem('Authentication')) {
      config.headers['Authentication'] = localStorage.getItem('Authentication')
    }
    return config
  },
  err => {
    // 对请求错误做些什么
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    if (response.data.code !== '200') {
      if (response.data.code === '401' || response.data.code === '402') {
        window.location.href = '/login'
      } else {
        let data = {
          data: {
            error: {
              message: response.data.message,
              code: response.data.code
            }
          }
        }
        return Promise.reject(data)
      }
    }
    return response || null
  },
  err => {
    if (err.request.readyState === 4 && err.request.status === 0) {
      // 我在这里重新请求
      err.response = {data: {error: {message: '请求超时'}}}
      window.location.href = '/login'
      return Promise.reject(err.response)
    }
    // // 对响应数据错误做点什么
    // if (err.response) {
    //   if (err.response.status === 502) {
    //     err.response = {data: {error: {message: '服务器忙碌中'}}}
    //     return Promise.reject(err.response)
    //   }
    // } else if (err.request) {
    //   if (err.request.readyState === 4 && err.request.status === 0) {
    //   // 我在这里重新请求
    //     err.response = {data: {error: {message: '请求超时'}}}
    //     // window.location.href = '/login'
    //     return Promise.reject(err.response)
    //   }
    // }
    // if (err.response.status === 401) {
    //   // 未授权,需要重新定向
    //   window.location.href = err.response.data.error.message
    //   return false
    // }
    // if (err.response.status === 404) {
    //   // 未授权,需要重新定向
    //   err.response = {data: {error: {message: '请求出错'}}}
    //   return Promise.reject(err.response)
    // }
    // if (err.response.status === 500) {
    //   err.response = {data: {error: {message: err.response.data.message || '服务器出错，请联系我们'}}}
    //   return Promise.reject(err.response)
    // }
    // if (err.response.status === 503) {
    //   window.location.href = '/error'
    //   return false
    // }
    // if (err.response.data.error.message === '未知错误') {
    //   err.response.data.error.message = '服务器出错'
    // }
    return Promise.reject(err.response)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}, timeout) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, {timeout: timeout})
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'delete',
      url: url,
      data: data
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
  })
}
