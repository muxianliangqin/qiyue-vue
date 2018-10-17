import $ from 'jquery'
function getCrawlerMenu () {
  let crawlerMenu = null
  $.ajax({
    type: 'post',
    url: '/crawler/getMenuNode',
    dataType: 'json',
    async: false,
    data: {},
    success: function (response) {
      crawlerMenu = response
    },
    error: function (response) {
      console.log(response)
      alert('网络异常')
    }
  })
  return crawlerMenu
}
function getNews (param) {
  let news = null
  $.ajax({
    type: 'post',
    url: 'http://localhost:8080/crawler/findNews',
    dataType: 'json',
    async: false,
    data: param
  }).done(function (response) {
    news = response
  }).fail(function (response) {
    alert('通讯异常')
  })
  return news
}
function getTotal (param) {
  let total = 0
  $.ajax({
    type: 'post',
    url: 'http://localhost:8080/crawler/totalNum',
    dataType: 'json',
    async: false,
    data: param
  }).done(function (response) {
    total = response
  }).fail(function (response) {
    alert('通讯异常')
  })
  return total
}
export default {
  getCrawlerMenu,
  getNews,
  getTotal
}
