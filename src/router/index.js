import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/menu/login'
import index from '@/components/menu/index'
import components from '@/component.js'

Vue.use(Router)

const Login = {
  path: '/login',
  name: 'login',
  title: '登陆',
  component: login
}

const Index = {
  path: '/index',
  name: 'index',
  component: index,
  children : components
}

export default new Router({
  mode: 'history',
  routes: [
    Login,
    Index
  ]
})
