import $ from 'jquery'
function addBreadcrumbs (menuRoot, superBreadcrumbs) {
  for (let menu of menuRoot.children) {
    menu.breadcrumbs = superBreadcrumbs.concat(menu.breadcrumbs)
    addBreadcrumbs(menu, superBreadcrumbs)
  }
}
function getUserMenu () {
  let userMenu = null
  $.ajax({
    type: 'post',
    url: '/user/getMenuNode',
    dataType: 'json',
    async: false,
    data: {
      id: 1
    }
  }).done(function (response) {
    userMenu = response
  }).fail(function (response) {
    alert('网络异常')
  })
  return userMenu
}
function completeUserMenu (userMenu, crawlerMenu) {
  for (let module of userMenu.children) {
    if (module.element.code === 'n001') {
      for (let menu of module.children) {
        if (menu.element.code === 'n002') {
          addBreadcrumbs(crawlerMenu, menu.breadcrumbs)
          menu.children = crawlerMenu.children
          menu.hasChild = true
          menu.height = crawlerMenu.height
          break
        }
      }
    }
  }
  return userMenu
}
function getBreadcrumbs (menuRoot, breadcrumbCodes) {
  let index = 0
  let items = menuRoot.children
  while (index < breadcrumbCodes.length) {
    for (let item of items) {
      if (breadcrumbCodes[index] === item.element.code) {
        breadcrumbCodes[index] = item.element.name
        items = item.children
        break
      }
    }
    index++
  }
  return breadcrumbCodes
}
export default {
  // addBreadcrumbs,
  getUserMenu,
  completeUserMenu,
  getBreadcrumbs
}
