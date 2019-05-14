import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
