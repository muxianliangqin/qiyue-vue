import $ from 'jquery'
function getCrawlerMenu (url, params) {
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
function getNews (params) {
  let news = null
  $.ajax({
    type: 'post',
    url: 'http://localhost:8080/crawler/findNews',
    dataType: 'json',
    async: false,
    data: params
  }).done(function (response) {
    news = response
  }).fail(function (response) {
    alert('通讯异常')
  })
  return news
}
function getTotal (params) {
  let total = 0
  $.ajax({
    type: 'post',
    url: 'http://localhost:8080/crawler/totalNum',
    dataType: 'json',
    async: false,
    data: params
  }).done(function (response) {
    total = response
  }).fail(function (response) {
    alert('通讯异常')
  })
  return total
}
function deleteCategory (params) {
  let result = 0
  $.ajax({
    type: 'post',
    url: 'http://localhost:8080/crawler/deleteCategory',
    dataType: 'json',
    async: false,
    data: params
  }).done(function (response) {
    result = response
  }).fail(function (response) {
    alert('通讯异常')
  })
  return result
}
function MoCategory (params) {
  let result = 0
  $.ajax({
    type: 'post',
    url: 'http://localhost:8080/crawler/deleteCategory',
    dataType: 'json',
    async: false,
    data: params
  }).done(function (response) {
    result = response
  }).fail(function (response) {
    alert('通讯异常')
  })
  return result
}
export default {
  getCrawlerMenu,
  getNews,
  getTotal,
  deleteCategory
}
