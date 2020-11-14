import axios from 'axios'
import router from './router/index'
import store from './store/index'

const AUTHENTICATION_TOKEN = 'token'

const instance = axios.create({
  baseURL: process.env.BABEL_ENV,
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    // 默认json格式参数
    'Content-Type': 'application/json'
  },
  timeout: 10000,
})

/**
 * 请求参数模板
 * {
 *   params: {
 *
 *   },
 *   page: {
 *     size: 10,
 *     page: 0
 *   }
 * }
 *
 * params 请求参数主体，
 * page 分页参数
 */
instance.interceptors.request.use(
  (config) => {
    config.transformRequest = [
      (data) => {
        // 非对象类型，包装一层params
        if (!(data instanceof Object)) {
          data = {
            params: data
          }
        }
        // 无params属性，包装一层params
        if (!data.hasOwnProperty('params')) {
          data = {
            params: data
          }
        }
        // 如果已包装成{params:...}样式的参数，就不处理。
        // 将参数转为json字符串
        return JSON.stringify(data)
      }
    ]
    let token = store.getters.token()
    if (token) {
      config.headers[AUTHENTICATION_TOKEN] = token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    let token = response.headers[AUTHENTICATION_TOKEN]
    if (token) {
      store.dispatch('setToken', token).then(() => {
        // 对象里的属性不能用变量
        window.postMessage({'token': token}, '*')
      })
    }
    if (response.config.responseType === 'json' && response.data.code !== '00000') {
      store.dispatch('alerts', {
        code: response.data.code,
        message: response.data.message
      })
    }
    return response.data
  },
  (error) => {
    if (error && error.response) {
      error.status = error.response.status
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '未授权，请登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = `服务器内部错误: ${error.response.data.message}`
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        case 511:
          // 用户没有权限 Network Authentication Required
          get('/user/logout').catch(() => {
            store.dispatch('alerts', {
              status: error.status,
              message: error.message
            })
          }).finally(() => {
            store.dispatch('clearAuthInfo').then(() => {
              router.replace({path: 'login'})
            })
          })
          break
        case 700:
          // 主动登出
          store.dispatch('clearAuthInfo').then(() => {
            router.replace({path: 'login'})
          })
          break
        default:
          error.message = '未知异常'
      }
      if (error.status !== 700) {
        store.dispatch('alerts', {
          type: 'error',
          status: error.status,
          message: error.message
        })
      }
      return Promise.reject(error)
    }
  }
)

function post (url, data) {
  return instance.post(url, data)
}

function get (url) {
  return instance.get(url)
}

function download (url, data, fileName) {
  const config = {responseType: 'blob'}
  instance.post(url, data, config).then((response) => {
    const blob = new Blob([response]) // 构造一个blob对象来处理数据
    // 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
    // IE10以上支持blob但是依然不支持download
    const link = document.createElement('a') // 创建a标签
    if ('download' in link) { // 支持a标签download的浏览器
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
  })
}

export default {
  instance,
  post,
  get,
  download
}
