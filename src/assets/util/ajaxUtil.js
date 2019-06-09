import $ from 'jquery'
function ajax (url, params, type = 'post', async = true, dataType = 'json', traditional= false) {
  return $.ajax({
    type: type,
    url: url,
    dataType: dataType,
    async: async,
    traditional: traditional,
    data: params
  })
}
function ajaxSync (url, params, type = 'post', async = false, dataType = 'json') {
  let result = null
  ajax(url, params, type, async, dataType).done(function (response) {
    result = response
  }).fail(function (response) {
    alert('网络异常: ')
  })
  return result
}

function ajaxArr (url, params, type = 'post', async = true, dataType = 'json', traditional= true) {
  return ajax(url, params, type, async, dataType, traditional)
}

function get (url, params, type = 'get', async = true, dataType = 'json') {
  return ajax (url, params, type, async, dataType)
}
export default {
  ajax,
  ajaxSync,
  ajaxArr,
  get
}
