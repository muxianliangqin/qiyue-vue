import axios from 'axios'
import qs from 'qs'

function ajax (url, data, config) {
  url = url || 'http://localhost:7010/'
  data = data || {}
  config = config || {}
  let requestConfig = {
    url: url,
    responseType: 'json',
    responseEncoding: 'utf8',
    method: 'post',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type':'application/x-www-form-urlencoded'
    },
    transformRequest: [function (data, headers) {
      if (config.traditional === true) {
        return qs.stringify(data, {arrayFormat: 'brackets'})
      } else {
        return qs.stringify(data);
      }
    }],
  };
  if (data === {}) {
    requestConfig.method = 'get';
  } else {
    if (config.method === 'get') {
      requestConfig.method = 'get';
      requestConfig.params = data
    } else {
      requestConfig.data = data
    }
  }
  return axios(requestConfig)
}

function reloadAfterRequest (self, url, data, config) {
  let msgSuccess = '操作成功';
  let msgFail = '操作失败，原因:';
  ajaxCallback (url, data, config,
    (response) => {
      if (response.data.errorCode === '0000') {
        self.reload();
        self.$Notice.success({
          title: msgSuccess
        });
      } else {
        self.$Notice.error({
            title: msgFail,
            desc: response.errorMsg
        });
      }
    },
    (error) => {
      if (error.response) {
        self.$Notice.info({
          title: '网络异常:',
          desc: error.response.data
        });
      } else if (error.request) {
        self.$Notice.info({
          title: '请求异常:',
          desc: error.request
        });
      } else {
        self.$Notice.info({
          title: '未知异常:',
          desc: error.message
        });
      }
    })
}

export default {
  axios,
  qs,
  ajax,
  reloadAfterRequest
}
