import root from './root'
const state = {
  menuRoot: null,
  modules: [],
  menus: [],
  openNames: [],
  activeMenu: '',
  breadcrumbs: []
}

const actions = {
  getMenuRoot ({commit}) {
    let menuRoot = root.getMenuRoot()
    commit('setMenuRoot', menuRoot)
  },
  getModules ({commit, state}) {
    let modules = state.menuRoot.children
    commit('setModules', modules)
  },
  setModuleCode ({commit, state}, moduleCode) {
    let menus = []
    for (let module of state.menuRoot.children) {
      if (module.element.code === moduleCode) {
        menus = module.children
        break
      }
    }
    commit('setMenus', menus)
    if (menus.length > 0) {
      let menu1 = menus[0]
      let openName = menu1.element.code
      let openNames = [openName]
      let activeMenu = menu1.element.code
      while (menu1.hasChild) {
        activeMenu = activeMenu + '-' + menu1.children[0].element.code
        if (menu1.height > 2) {
          openName = openName + '-' + menu1.children[0].element.code
          openNames.push(openName)
        }
        menu1 = menu1.children[0]
      }
      commit('setOpenNames', openNames)
      commit('setActiveMenu', activeMenu)
      commit('setBreadcrumbs', menu1.breadcrumbs)
    }
  },
  setBreadcrumbs ({commit}, breadcrumbs) {
    commit('setBreadcrumbs', breadcrumbs)
  }
}

const getters = {
  modules: (state) => state.modules,
  menus: (state) => state.menus,
  openNames: (state) => state.openNames,
  activeMenu: (state) => state.activeMenu,
  breadcrumbs: (state) => root.getBreadcrumbs(state.menuRoot, state.breadcrumbs)
}

const mutations = {
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
