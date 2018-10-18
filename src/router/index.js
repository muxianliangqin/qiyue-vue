import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/menu/login'
import index from '../components/menu/index'
import home from '../components/home/index'
import newsShow from '../components/news/show/index'
import newSet from '../components/news/set/index'

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
      path: '/news_show/:id',
      name: 'news_show',
      component: newsShow
    },
    {
      path: '/news_set',
      name: 'news_set',
      component: newSet
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/',
      name: 'home',
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
