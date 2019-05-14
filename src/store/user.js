import ajaxUtil from '@/assets/util/ajaxUtil'
import menuUtil from '@/assets/util/menuUtil'
const state = {
  userInfo: JSON.parse(sessionStorage.getItem('userInfo'))||{}, // 用户信息
  menuRoot: null, // 总菜单树
  modules: [], // 模块列表
  menus: [], // 模块下菜单列表
  openNames: [], // 展开菜单
  activeMenu: '', // 活动菜单
  initMenu: null, // 初始化是news组件传的参数
  breadcrumbs: [] // 所在位置栏
}

const actions = {
  checkLogin ({commit}, userInfo) {
    ajaxUtil.ajax('/user/login',userInfo).done(function (response) {
      commit('setUserInfo', response)
    })
  },
  getMenuRoot ({commit}) {
    let params = {userId:3}
    let userMenu = ajaxUtil.ajaxSync('/user/getMenuNode', params)
    // // 如果用户菜单出现'n002'爬虫网站列表，则从crawler获取数据
    // const crawlerId = 'n002'
    // const crawlerUrl = '/crawler/getMenuNode'
    // if (menuUtil.contain(userMenu, crawlerId)) {
    //   let crawlerMenu = ajaxUtil.ajaxSync(crawlerUrl)
    //   userMenu = menuUtil.addUserMenu(userMenu, crawlerId, crawlerMenu)
    // }
    // const weChatId = 'w002'
    // const weChatUrl = '/weChat/getMenuNode'
    // if (menuUtil.contain(userMenu, weChatId)) {
    //   let weChatMenu = ajaxUtil.ajaxSync(weChatUrl, {userId:3})
    //   userMenu = menuUtil.addUserMenu(userMenu, weChatId, weChatMenu)
    // }
    commit('setMenuRoot', userMenu)
  },
  getModules ({commit, state}) {
    let modules = state.menuRoot.children
    commit('setModules', modules)
  },
  setModuleId ({commit, state}, moduleId) {
    let user = []
    for (let module of state.menuRoot.children) {
      if (module.element.id === moduleId) {
        user = module.children
        break
      }
    }
    commit('setMenus', user)
    if (user.length > 0) {
      let menu1 = user[0]
      let openName = menu1.element.id
      let openNames = [openName]
      let activeMenu = menu1.element.id
      while (menu1.hasChild) {
        activeMenu = activeMenu + '-' + menu1.children[0].element.id
        if (menu1.height > 2) {
          openName = openName + '-' + menu1.children[0].element.id
          openNames.push(openName)
        }
        menu1 = menu1.children[0]
      }
      commit('setOpenNames', openNames)
      commit('setActiveMenu', activeMenu)
      commit('initMenu', menu1)
      commit('setBreadcrumbs', menu1.breadcrumbs)
    }
  },
  setBreadcrumbs ({commit}, breadcrumbs) {
    commit('setBreadcrumbs', breadcrumbs)
  }
}

const getters = {
  userInfo: (state) => state.userInfo,
  modules: (state) => state.modules,
  menus: (state) => state.menus,
  openNames: (state) => state.openNames,
  activeMenu: (state) => state.activeMenu,
  breadcrumbs: (state) => menuUtil.getBreadcrumbs(state.menuRoot, state.breadcrumbs),
  initMenu: (state) => state.initMenu
}

const mutations = {
  setUserInfo (state, userInfo) {
    sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
    state.userInfo = userInfo
  },
  setMenuRoot (state, menuRoot) {
    state.menuRoot = menuRoot
  },
  setModules (state, modules) {
    state.modules = modules
  },
  setMenus (state, menus) {
    state.menus = menus
  },
  setOpenNames (state, openNames) {
    state.openNames = openNames
  },
  setActiveMenu (state, activeMenu) {
    state.activeMenu = activeMenu
  },
  setBreadcrumbs (state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs
  },
  initMenu (state, menu) {
    state.initMenu = menu
  }
}

export default {
  // 定义变量
  state,
  // 外部调用方法入口,异步处理数据等
  actions,
  // 对变量进行校验等处理
  getters,
  // 改变变量的值
  mutations
}
