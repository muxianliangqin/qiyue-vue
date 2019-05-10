function addBreadcrumbs (menuRoot, superBreadcrumbs) {
  for (let menu of menuRoot.children) {
    menu.breadcrumbs = superBreadcrumbs.concat(menu.breadcrumbs)
    addBreadcrumbs(menu, superBreadcrumbs)
  }
}
function addUserMenu (rootMenu, id, newMenu) {
  for (let item of rootMenu.children) {
    if (item.element.id === id) {
      addBreadcrumbs(newMenu, item.breadcrumbs)
      item.children = newMenu.children
      item.hasChild = true
      item.height = newMenu.height
      break
    } else {
      if (item.hasChild) {
        addUserMenu (item, id, newMenu)
      }
    }
  }
  return rootMenu
}
function getBreadcrumbs (menuRoot, breadcrumbs) {
  let index = 0
  let items = menuRoot.children
  while (index < breadcrumbs.length) {
    for (let item of items) {
      if (breadcrumbs[index] === item.element.id) {
        let url = item.element.url
        if (!url || url === 'null') {
          url = null
        } else {
          if (index === 0) {
            url = '/' + url
          } else {
            url = breadcrumbs[index-1].url + '/' + url
          }
        }
        breadcrumbs[index] = {
          url: url,
          name: item.element.name
        }
        items = item.children
        break
      }
    }
    index++
  }
  return breadcrumbs
}
function contain(rootMenu, node) {
  let flag = false
  for (let item of rootMenu.children) {
    if (item.element.id === node) {
      flag = true
      break
    }
  }
  if (!flag) {
    for (let item of rootMenu.children) {
      flag = contain(item, node)
      if (flag) {
        break
      }
    }
  }
  return flag
}
export default {
  contain,
  addUserMenu,
  getBreadcrumbs
}
