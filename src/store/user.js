const state = {
  userInfo: JSON.parse(sessionStorage.getItem('userInfo'))||{}, // 用户信息
  tabs: {                       // 内容展示标签区
    height: 300,                // 标签区的高度
    contentHeight: 0,           // 标签区内容的高度
    active: 'HomeWelcome',      // 活动标签
    components: [               // 展示区域组件
      {
        name: 'HomeWelcome',
        desc: '主页',
        show: true,
        new: false,
        params: null
      }
    ]
  },
  menuRoot: {}
};

const actions = {
  setUserInfo ({commit}, userInfo) {
    commit('setUserInfo', userInfo)
  },
  addComponent ({commit,state}, component) {
    let components = state.tabs.components;
    let flag = true;
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
  setMenuRoot ({commit}, menuRoot) {
    commit('setMenuRoot', menuRoot)
  },
};

const getters = {
  userInfo: (state) => state.userInfo,
  tabs: (state) => state.tabs,
  menuRoot: (state) => state.menuRoot
};

const mutations = {
  setUserInfo (state, userInfo) {
    sessionStorage.setItem('userInfo',JSON.stringify(userInfo));
    state.userInfo = userInfo
  },
  addComponent (state, component) {
    state.tabs.active = component.name;
    state.tabs.components.push(component)
  },
  updateComponent (state, component) {
    state.tabs.components.forEach(function (value, index, array) {
      if (value.name === component.name) {
        array[index] = component;
        state.tabs.active = component.name
      }
    })
  },
  delComponent (state, name) {
    state.tabs.components = state.tabs.components.filter(function (value) {
      return value.name !== name
    });
    state.tabs.active = state.tabs.components[state.tabs.components.length-1].name
  },
  initTabs (state) {
    state.tabs.components = state.tabs.components.slice(0, 1);
  },
  setTabsActive (state, active) {
    state.tabs.active = active
  },
  setTabsHeight (state, height) {
    state.tabs.height = height;
    state.tabs.contentHeight = height - 50
  },
  setMenuRoot (state, menuRoot) {
    state.menuRoot = menuRoot
  }
};

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
