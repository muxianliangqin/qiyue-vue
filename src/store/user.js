import ajaxUtil from '@/assets/util/ajaxUtil'
import menuUtil from '@/assets/util/menuUtil'
const state = {
  userInfo: JSON.parse(sessionStorage.getItem('userInfo'))||{}, // 用户信息
  menuRoot: null, // 总菜单树
  modules: [], // 模块列表
  menus: [], // 模块下菜单列表
  openNames: [], // 展开菜单
  activeMenu: '', // 活动菜单
  initMenu: null, // 初始化菜单
  breadcrumbs: [], // 导航栏
  tabs: {
    active: 'HomeIndex',
    components: [
      {
        name: 'HomeIndex',
        desc: '主页',
        show: true,
        new: false,
        params: null
      }
    ]
  } //展示区域组件
}

const actions = {
  checkLogin ({commit}, userInfo) {
    ajaxUtil.ajax('/user/login',userInfo).done(function (response) {
      commit('setUserInfo', response)
    })
  },
  getMenuRoot ({commit,state}) {
    let params = {userId:state.userInfo.id}
    let userMenu = ajaxUtil.ajaxSync('/user/getMenuNode', params)
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
  },
  addComponent ({commit,state}, component) {
    let components = state.tabs.components
    let flag = true
    for (let comp of components) {
      if (comp.name === component.name) {
        if (comp.new) {
          commit('updateComponent', component)
        }
        flag = false
      }
    }
    if (flag) {
      commit('addComponent', component)
    }
  },
  delComponent ({commit,state}, name) {
    commit('delComponent', name)
  },
  setTabsActive ({commit,state}, active) {
    commit('setTabsActive', active)
  }
}

const getters = {
  userInfo: (state) => state.userInfo,
  modules: (state) => state.modules,
  menus: (state) => state.menus,
  openNames: (state) => state.openNames,
  activeMenu: (state) => state.activeMenu,
  breadcrumbs: (state) => menuUtil.getBreadcrumbs(state.menuRoot, state.breadcrumbs),
  initMenu: (state) => state.initMenu,
  tabs: (state) => state.tabs
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
  },
  addComponent (state, component) {
    state.tabs.active = component.name
    state.tabs.components.push(component)
  },
  updateComponent (state, component) {
    state.tabs.components.forEach(function (value,index,array) {
      if (value.name === component.name) {
        array[index] = component
        state.tabs.active = component.name
      }
    })
  },
  delComponent (state, name) {
    state.tabs.components = state.tabs.components.filter(function (value) {
      return value.name !== name
    })
    state.tabs.active = state.tabs.components[state.tabs.components.length-1].name
  },
  setTabsActive (state, active) {
    state.tabs.active = active
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
