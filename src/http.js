import axios from 'axios'
import qs from 'qs'

function ajax (url, data, config) {
  url = url || 'http://localhost:7010/';
  data = data || {};
  config = config || {};
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
  ajax (url, data, config).then((response) => {
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
    }).catch((error) => {
      if (error.response) {
        self.$Notice.error({
          title: '网络异常:',
          desc: error.response.data
        });
      } else if (error.request) {
        self.$Notice.error({
          title: '请求异常:',
          desc: error.request
        });
      } else {
        self.$Notice.error({
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
