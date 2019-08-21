import axios from 'axios'
import qs from 'qs'

const instance = axios.create({
  baseURL: 'http://localhost:7000/',
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type':'application/x-www-form-urlencoded'
  },
  timeout: 3000,
});

instance.interceptors.request.use(
  (config) => {
    config.transformRequest = [(data) => {
      let traditional = false;
      for (let k in data) {
        if (data[k] instanceof Array) {
          traditional = true
        }
      }
      if (traditional === true) {
        return qs.stringify(data, {indices: false})
      } else {
        return qs.stringify(data);
      }
    }];
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) =>{
    return response.data;
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误';
          break;
        case 401:
          error.message = '未授权，请登录';
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = `服务器内部错误: ${error.response.data}`;
          break;
        case 501:
          error.message = '服务未实现';
          break;
        case 502:
          error.message = '网关错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网关超时';
          break;
        case 505:
          error.message = 'HTTP版本不受支持';
          break;
        default:
          error.message = '未知异常';
      }
      return Promise.reject(error);
    }
  }
);

function post(url, data, success, except) {
  instance.post(url, data)
          .then((response) => success(response))
          .catch((error) => except === undefined?{}:except(error))
}

/*
发送请求后处理成功和错误情况
 */
function postWithFull(url, data, _this) {
  let success = (response) => {
    if (response.errorCode === '0000') {
      _this.$Notice.success({
        title: '操作成功'
      });
    } else {
      _this.$Notice.error({
        title: '操作失败',
        desc: `errorCode: ${response.errorCode} \n errorMsg: ${response.errorMsg}`
      });
    }
  };
  let error = (error) => {
    if (error.message) {
      _this.$Notice.error({
        title: '网络异常:',
        desc: error.message
      });
    }
  };
  post(url, data, success, error)
}

function postWithError(url, data, _this, success) {
  let error = (error) => {
    if (error.message) {
      _this.$Notice.error({
        title: '网络异常:',
        desc: error.message
      });
    }
  };
  post(url, data, success, error)
}

export default {
  instance,
  qs,
  post,
  postWithFull,
  postWithError
}
