import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import alert from './globalAlert'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    alert
  },
  strict: process.env.NODE_ENV !== 'production'
});

export default store
