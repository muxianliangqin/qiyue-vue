import $ from 'jquery'
let root = {
  'breadcrumbs': [],
  'children': [{
    'breadcrumbs': ['module1'],
    'children': [{
      'breadcrumbs': ['module1', 'menu1'],
      'children': [{
        'breadcrumbs': ['module1', 'menu1', 'subMenu1'],
        'children': [{
          'breadcrumbs': ['module1', 'menu1', 'subMenu1', 'item1'],
          'children': [],
          'hasChild': false,
          'element': {'code': 'item1', 'supCode': 'subMenu1', 'name': 'item1', 'path': 'news', 'desc': 'null'},
          'height': 1
        }, {
          'breadcrumbs': ['module1', 'menu1', 'subMenu1', 'item2'],
          'children': [],
          'hasChild': false,
          'element': {'code': 'item2', 'supCode': 'subMenu1', 'name': 'item2', 'path': 'news', 'desc': 'null'},
          'height': 1
        }, {
          'breadcrumbs': ['module1', 'menu1', 'subMenu1', 'item3'],
          'children': [],
          'hasChild': false,
          'element': {'code': 'item3', 'supCode': 'subMenu1', 'name': 'item3', 'path': 'news', 'desc': 'null'},
          'height': 1
        }],
        'hasChild': true,
        'element': {'code': 'subMenu1', 'supCode': 'menu1', 'name': 'subMenu1', 'path': 'null', 'desc': 'null'},
        'height': 2
      }, {
        'breadcrumbs': ['module1', 'menu1', 'subMenu2'],
        'children': [],
        'hasChild': false,
        'element': {'code': 'subMenu2', 'supCode': 'menu1', 'name': 'subMenu2', 'path': 'webs', 'desc': 'null'},
        'height': 1
      }],
      'hasChild': true,
      'element': {'code': 'menu1', 'supCode': 'module1', 'name': 'menu1', 'path': 'null', 'desc': 'null'},
      'height': 3
    }, {
      'breadcrumbs': ['module1', 'menu2'],
      'children': [{
        'breadcrumbs': ['module1', 'menu2', 'subMenu3'],
        'children': [],
        'hasChild': false,
        'element': {'code': 'subMenu3', 'supCode': 'menu2', 'name': 'subMenu3', 'path': 'null', 'desc': 'null'},
        'height': 1
      }, {
        'breadcrumbs': ['module1', 'menu2', 'subMenu4'],
        'children': [],
        'hasChild': false,
        'element': {'code': 'subMenu4', 'supCode': 'menu2', 'name': 'subMenu4', 'path': 'null', 'desc': 'null'},
        'height': 1
      }],
      'hasChild': true,
      'element': {'code': 'menu2', 'supCode': 'module1', 'name': 'menu2', 'path': 'null', 'desc': 'null'},
      'height': 2
    }],
    'hasChild': true,
    'element': {'code': 'module1', 'supCode': '', 'name': 'module1', 'path': 'null', 'desc': 'null'},
    'height': 4
  }, {
    'breadcrumbs': ['module2'],
    'children': [{
      'breadcrumbs': ['module2', 'menu3'],
      'children': [{
        'breadcrumbs': ['module2', 'menu3', 'subMenu5'],
        'children': [],
        'hasChild': false,
        'element': {'code': 'subMenu5', 'supCode': 'menu3', 'name': 'subMenu5', 'path': 'null', 'desc': 'null'},
        'height': 1
      }, {
        'breadcrumbs': ['module2', 'menu3', 'subMenu6'],
        'children': [],
        'hasChild': false,
        'element': {'code': 'subMenu6', 'supCode': 'menu3', 'name': 'subMenu6', 'path': 'null', 'desc': 'null'},
        'height': 1
      }],
      'hasChild': true,
      'element': {'code': 'menu3', 'supCode': 'module2', 'name': 'menu3', 'path': 'null', 'desc': 'null'},
      'height': 2
    }, {
      'breadcrumbs': ['module2', 'menu4'],
      'children': [{
        'breadcrumbs': ['module2', 'menu4', 'subMenu7'],
        'children': [],
        'hasChild': false,
        'element': {'code': 'subMenu7', 'supCode': 'menu4', 'name': 'subMenu7', 'path': 'null', 'desc': 'null'},
        'height': 1
      }, {
        'breadcrumbs': ['module2', 'menu4', 'subMenu8'],
        'children': [],
        'hasChild': false,
        'element': {'code': 'subMenu8', 'supCode': 'menu4', 'name': 'subMenu8', 'path': 'null', 'desc': 'null'},
        'height': 1
      }],
      'hasChild': true,
      'element': {'code': 'menu4', 'supCode': 'module2', 'name': 'menu4', 'path': 'null', 'desc': 'null'},
      'height': 2
    }],
    'hasChild': true,
    'element': {'code': 'module2', 'supCode': '', 'name': 'module2', 'path': 'null', 'desc': 'null'},
    'height': 3
  }],
  'hasChild': true,
  'element': {'code': 'root', 'supCode': 'root'},
  'height': 5
}
function addBreadcrumbs (menuRoot, superBreadcrumbs) {
  for (let menu of menuRoot.children) {
    let breadcrumbs = superBreadcrumbs.concat(menu.breadcrumbs)
    menu.breadcrumbs = breadcrumbs
    addBreadcrumbs(menu, superBreadcrumbs)
  }
}
export default {
  getMenuRoot () {
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
      // alert('网络异常')
    })
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
        // alert('网络异常')
      }
    })
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
  },
  getBreadcrumbs (menuRoot, breadcrumbCodes) {
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
}
