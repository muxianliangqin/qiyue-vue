// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import '@/assets/css/self.css'
import '@/assets/icons/ali/iconfont.css'

Vue.use(iView);
// Vue.config.productionTip = false

import http from './http.js'
import md5 from 'js-md5'
import auth from './auth.js'
import constant from '@/assets/constant/constant.js'
Vue.prototype.$http = http;
Vue.prototype.$md5 = md5;
Vue.prototype.$auth = auth.Auth;
Vue.prototype.$const = constant;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
