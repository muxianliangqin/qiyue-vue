function addBreadcrumbs (menuRoot, superBreadcrumbs) {
  for (let menu of menuRoot.children) {
    menu.breadcrumbs = superBreadcrumbs.concat(menu.breadcrumbs)
    addBreadcrumbs(menu, superBreadcrumbs)
  }
}
function addUserMenu (rootMenu, id, newMenu) {
  for (let item of rootMenu.children) {
    if (item.element.code === id) {
      addBreadcrumbs(newMenu, item.breadcrumbs)
      item.children = newMenu.children
      item.hasChild = true
      item.height = newMenu.height
      break
    } else {
      if (item.hasChild) {
        addUserMenu(item, id, newMenu)
      }
    }
  }
  return rootMenu
}
function getBreadcrumbs (menuRoot, breadcrumbs) {
  let items = menuRoot.children
  for (let index=0;index<breadcrumbs.length;index++) {
    for (let item of items) {
      if (breadcrumbs[index] === item.element.code) {
        breadcrumbs[index] = {
          code: item.element.code,
          name: item.element.name
        }
        items = item.children
        break
      }
    }
  }
  return breadcrumbs
}
function contain(rootMenu, node) {
  let flag = false
  for (let item of rootMenu.children) {
    if (item.element.code === node) {
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
