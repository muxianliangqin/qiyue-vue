import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/home/login'
import index from '@/components/layout/index'
import components from '@/component.js'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      title: '登陆',
      component: login
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: components
    }
  ]
})
