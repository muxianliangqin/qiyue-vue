import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login'
import index from '../components/index'
import home from '../components/home/index'
import news from '../components/news/index'

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
  children: [
    {
      path: '/news/:code',
      name: 'news',
      component: news
    },
    {
      path: '/webs',
      name: 'webs',
      component: news
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '',
      name: '',
      component: home
    }
  ]
}

export default new Router({
  mode: 'history',
  routes: [
    Login,
    Index
  ]
})
