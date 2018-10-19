import $ from 'jquery'
function ajax (url, params, method = 'post', async = true, dataType = 'json') {
  return $.ajax({
    type: method,
    url: url,
    dataType: dataType,
    async: async,
    data: params
  })
}
function ajaxSync (url, params, method = 'post', async = false, dataType = 'json') {
  let result = null
  ajax(url, params, method, async, dataType).done(function (response) {
    result = response
  }).fail(function (response) {
    alert('网络异常: ')
  })
  return result
}
function get (url, params, method = 'get', async = true, dataType = 'json') {
  return ajax (url, params, method, async, dataType)
}
export default {
  ajax,
  ajaxSync,
  get
}
