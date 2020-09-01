import Vue from 'vue'
import Router from 'vue-router'
import login from '@/html/home/login'
import sign from '@/html/home/sign'
import index from '@/html/layout/index'
import components from '@/component.js'

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      title: '登陆',
      component: login
    },
    {
      path: '/sign',
      name: 'sign',
      title: '注册',
      component: sign
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: components
    }
  ]
})

export default router
