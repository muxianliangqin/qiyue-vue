import menuUtil from '@/assets/utils/menuUtil.js'
import http from '../http.js'

const saveMenuUrl = 'user/menu/add'
const initTabs = () => {
  return {                       // 内容展示标签区
    height: 300,                // 标签区的高度
    contentHeight: 0,           // 标签区内容的高度
    active: 'HomeWelcome',      // 活动标签
    activeMenu: undefined,      // 活动标签的菜单详情
    components: [               // 展示区域组件
      {
        name: 'HomeWelcome',
        label: '主页',
        show: true,
        new: false,
        isMenu: true,
        menuData: undefined,
        params: undefined
      }
    ]
  }
}

const state = {
  userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {}, // 用户信息
  tabs: initTabs(),
  menuTree: {},
  // 新增鉴权组件时，标记已经保存到数据库，以免重复保存
  newAuthMenus: {}
}

const actions = {
  setUserInfo ({commit}, userInfo) {
    commit('setUserInfo', userInfo)
    commit('refreshTabs')
  },
  addComponent ({commit, dispatch, state, rootState}, component) {
    // 组件默认显示
    if (undefined === component.show) {
      component.show = true
    }
    // 组件默认为菜单
    if (undefined === component.isMenu) {
      component.isMenu = true
    }
    // 组件默认为新增
    if (undefined === component.new) {
      component.new = true
    }
    let components = state.tabs.components
    for (let comp of components) {
      if (comp.name === component.name) {
        if (!component.new) {
          commit('updateComponent', component)
        }
      }
    }
    /**
     * 如果组件不是菜单，判定是从菜单页面进入的二级页面
     * 设定菜单页面为此html页面父页面
     * 更新菜单数据
     */
    if (!component.isMenu) {
      const superMenu = menuUtil.findByNodeId(state.menuTree, component.menuData.menuId)
      const menu = superMenu.children.find((k) => {
        return k.element.data.componentName === component.name
      })
      if (menu) {
        component.menuData = menu.element.data
      } else {
        commit('saveComponent', component)
      }
    }
    /**
     * 如果是新组件，tab新增，展示
     * 保存新页面
     */
    if (component.new) {
      commit('addComponent', component)
    }
  },
  delComponent ({commit}, name) {
    commit('delComponent', name)
  },
  initTabs ({commit}) {
    commit('initTabs')
  },
  setTabsActive ({commit}, active) {
    commit('setTabsActive', active)
  },
  setTabsHeight ({commit}, height) {
    commit('setTabsHeight', height)
  },
  setMenuTree ({commit}, menuNode) {
    commit('setMenuTree', menuNode)
  },
  saveNewAuthMenu ({commit}, config) {
    commit('saveNewAuthMenu', config)
  },
  refreshTabs ({commit}) {
    commit('refreshTabs')
  }
}

const getters = {
  userInfo: (state) => state.userInfo,
  tabs: (state) => state.tabs,
  menuRoot: (state) => state.menuTree,
  activeMenu: (state) => state.tabs.activeMenu,
  findMenuByMenuId: (state) => (menuId) => {
    return menuUtil.findByNodeId(state.menuTree, menuId)
  },
  newAuthHasSave: (state) => (menuId, name) => {
    if (state.newAuthMenus[menuId]) {
      return state.newAuthMenus[menuId][name]
    }
    return false
  },
}

const mutations = {
  setUserInfo (state, userInfo) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    state.userInfo = userInfo
  },
  addComponent (state, component) {
    if (state.tabs.active === component.name) {
      return
    }
    state.tabs.active = component.name
    state.tabs.activeMenu = component
    state.tabs.components.push(component)
  },
  updateComponent (state, component) {
    state.tabs.components.forEach(function (value, index, array) {
      if (value.name === component.name) {
        array.splice(index, 1, component)
        state.tabs.active = component.name
      }
    })
  },
  /**
   * 判断是否需要保存新组件信息到数据库
   * @param state
   * @param component
   */
  saveComponent (state, component) {
    const isSuperAdmin = true
    // 非管理员
    if (!isSuperAdmin) {
      return
    }
    // 无菜单数据
    if (!component.menuData) {
      return
    }
    const superMenuId = component.menuData.menuId
    const componentName = component.name
    // 来源页面不存在
    let superMenu = menuUtil.findByNodeId(state.menuTree, superMenuId)
    if (!superMenu) {
      return
    }
    let menu = undefined
    menu = superMenu.children.find((k) => {
      return k.element.data.componentName === componentName
    })
    // 页面已注册
    if (menu) {
      return
    }
    http.post(saveMenuUrl, {
      superMenuId: superMenuId,
      name: componentName,
      componentName: componentName,
      rankNo: superMenu.element.data.rankNo + 1,
      sortNo: superMenu.children.length + 1,
      typeCode: 'html',
      operateCode: 'select',
    }).then((response) => {
      component.menuData = response.content
      state.tabs.active = component.name
      state.tabs.activeMenu = component
      state.tabs.components.push(component)
    })
  },
  delComponent (state, name) {
    state.tabs.components = state.tabs.components.filter(function (value) {
      return value.name !== name
    })
    if (state.tabs.components.length > 0) {
      state.tabs.active = state.tabs.components[state.tabs.components.length - 1].name
    }
  },
  initTabs (state) {
    state.tabs.components = state.tabs.components.slice(0, 1)
  },
  setTabsActive (state, active) {
    state.tabs.active = active
  },
  setTabsHeight (state, height) {
    state.tabs.height = height
    state.tabs.contentHeight = height - 50
  },
  setMenuTree (state, menuTree) {
    state.menuTree = menuTree
  },
  /**
   * 每新增一个新鉴权组件，在此做个标记，防止重复提交。
   * @param state
   * @param config
   */
  saveNewAuthMenu (state, config) {
    const superMenuId = config.superMenuId
    const name = config.name
    if (undefined === state.newAuthMenus[superMenuId]) {
      state.newAuthMenus[superMenuId] = {}
    }
    state.newAuthMenus[superMenuId][name] = true
  },
  refreshTabs (state) {
    state.tabs = initTabs()
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
