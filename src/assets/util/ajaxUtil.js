import $ from 'jquery'
function ajax (url, params, config) {
  config = config || {};
  return $.ajax({
    url: url,
    data: params,
    type: config.type || 'post',
    dataType: config.dataType || 'json',
    async: config.async !== undefined ? config.async : true,
    traditional: config.traditional !== undefined ? config.traditional :  false
  })
}
function ajaxSync (url, params) {
  let result = null
  ajax(url, params, {async: false}).done(function (response) {
    result = response
  }).fail(function (response) {
    alert('网络异常: ')
  })
  return result
}

function ajaxArr (url, params) {
  return ajax(url, params, {traditional: true})
}

function get (url, params) {
  return ajax (url, params, {type: 'get'})
}

function initAfterAjax(_this, url, params, config) {
  let msgSuccess = '操作成功';
  let msgFail = '操作失败，原因:';
  ajax(url, params, config).done(function (response) {
    if (response.errorCode === '0000') {
      _this.init();
      _this.$Notice.success({
        title: msgSuccess
      });
    } else {
      _this.$Notice.error({
        title: msgFail,
        desc: response.errorMsg
      });
    }
  }).fail(function (response) {
    _this.$Notice.info({
      title: '网络异常:',
      desc: response.responseJSON.message
    });
  })
}
export default {
  ajax,
  ajaxSync,
  ajaxArr,
  get,
  initAfterAjax
}
