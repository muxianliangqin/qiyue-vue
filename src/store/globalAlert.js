/**
 * 错误等信息全局提示
 * @type {{alerts: {type: string, status: number, code: string, message: string}}}
 */
const state = {
  /**
   * 警示、警报信息
   */
  alerts: {
    type: 'error',      //提示类型，success、info、error、warning、loading
    status: 200,        //请求返回状态码
    code: '00000',      //请求返回自定义错误代码
    message: '请求成功' //请求返回自定义错误信息
  }
}

const actions = {
  /**
   * 警示、警报信息
   */
  alerts ({commit}, alerts) {
    commit('alerts', alerts)
  }
}

const getters = {
  alerts: (state) => state.alerts
}

const mutations = {
  /**
   * 警示、警报信息
   * 提示类型默认 `success`
   * 请求返回状态默认 200
   */
  alerts (state, alerts) {
    state.alerts = alerts
    if (undefined === state.alerts.type) {
      state.alerts.type = 'success'
    }
    if (undefined === state.alerts.status) {
      state.alerts.status = 200
    }
  },
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
