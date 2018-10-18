import $ from 'jquery'
function ajax (url, params, method = 'post', async = true, dataType = 'json') {
  $.ajax({
    type: method,
    url: url,
    dataType: dataType,
    async: async,
    data: params,
    success: function (response) {
      return response
    },
    error: function (response) {
      alert('网络异常')
    }
  })
}
export default {
  ajax
}
