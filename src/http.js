import axios from 'axios'
import qs from 'qs'
import router from './router/index'

const AUTHENTICATION_TOKEN = 'token'

const instance = axios.create({
  baseURL: process.env.BABEL_ENV,
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
    // 'Content-Type':'application/json'
  },
  timeout: 3000,
})

instance.interceptors.request.use(
  (config) => {
    config.transformRequest = [(data) => {
      if (data instanceof Array) {
        return qs.stringify(data, {indices: false})
      } else if (data instanceof Object) {
        let traditional = false
        for (let k in data) {
          if (data[k] instanceof Array) {
            traditional = true
          }
        }
        if (traditional === true) {
          return qs.stringify(data, {indices: false})
        } else {
          return qs.stringify(data)
        }
      } else {
        return qs.stringify(data)
      }
    }]
    let token = config.headers.common[AUTHENTICATION_TOKEN]
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
      instance.defaults.headers.common[AUTHENTICATION_TOKEN] = token
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
          get("/user/logout", () => {
            alert('退出登录')
            router.replace({path: 'login'})
          })
          break
        default:
          error.message = '未知异常'
      }
      return Promise.reject(error)
    }
  }
)

function post (url, data, success, except) {
  instance.post(url, data)
    .then((response) => success(response))
    .catch((error) => except === undefined ? {} : except(error))
}

function get (url, success, except) {
  instance.get(url)
    .then((response) => success(response))
    .catch((error) => except === undefined ? {} : except(error))
}

/*
发送请求后自动处理成功和错误情况
post4: postWithFull
 */
function post4 (url, data, _this) {
  let success = (response) => {
    if (response.errorCode === '0000') {
      _this.$Notice.success({
        title: '操作成功'
      })
    } else {
      _this.$Notice.error({
        title: '操作失败',
        desc: `errorCode: ${response.errorCode} \n errorMsg: ${response.errorMsg}`
      })
    }
  }
  let error = (error) => {
    if (error.message) {
      _this.$Notice.error({
        title: '网络异常:',
        desc: error.message
      })
    }
  }
  post(url, data, success, error)
}

/*
发送请求后自动处理错误情况
postE: postWithError
 */
function postE (url, data, _this, success) {
  let error = (error) => {
    if (error.message) {
      _this.$Notice.error({
        title: '网络异常:',
        desc: error.message
      })
    }
  }
  post(url, data, success, error)
}

export default {
  axios: instance,
  qs,
  post,
  get,
  post4,
  postE
}
