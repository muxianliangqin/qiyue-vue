import Vue from 'vue'
import Vuex from 'vuex'
import menus from './menus'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    menus
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
