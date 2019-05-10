<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 100px;
    height: 3rem;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    text-align: left;
    height: 3rem;
    line-height: 3rem;
  }
  .layout-footer-center{
    text-align: center;
  }
  .menu-icon{
    transition: all .3s;
  }
  .rotate-icon{
    transform: rotate(-90deg);
  }
  .sider-text-left{
    text-align: left;
    background: #fff;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <cusModule ref="module"></cusModule>
      <Layout :style="{padding: '0 20px'}">
        <cusBreadcrumb ref="breadcrumb"></cusBreadcrumb>
        <Content :style="{padding: '0px 0', background: '#fff'}">
          <Layout>
            <Sider ref="menu"
                   hide-trigger
                   collapsible
                   collapsed-width="150"
                   width="250"
                   v-model="isCollapsed"
                   class="sider-text-left"
                   :style="{height: menuHeight+'px', maxHeight: menuHeight+'px'}">
              <cusMenu :isCollapsed="isCollapsed"
                       @collapsed="collapsed">
              </cusMenu>
            </Sider>
            <Layout>
              <Header ref="collapse" :style="{padding: 0}" class="layout-header-bar">
                <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
              </Header>
              <Content :style="{padding: '0 1rem', background: '#fff',height:contentHeight+'px', maxHeight: contentHeight+'px'}">
                <keep-alive :exclude="['news']">
                  <router-view></router-view>
                </keep-alive>
              </Content>
            </Layout>
          </Layout>
        </Content>
      </Layout>
      <Footer ref="footer" class="layout-footer-center">2018 &copy; AI-qiyue</Footer>
    </Layout>
  </div>
</template>
<script>

import cusModule from './modules'
import cusMenu from './menus'
import cusBreadcrumb from './breadcrumbs'

export default {
  name: 'cus_home',
  data () {
    return {
      menuHeight: 520,
      contentHeight: 520,
      isCollapsed: false
    }
  },
  components: {
    cusModule,
    cusMenu,
    cusBreadcrumb
  },
  computed: {
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    }
  },
  methods: {
    collapsedSider () {
      this.$refs.menu.toggleCollapse()
    },
    collapsed (isCollapsed) {
      this.isCollapsed = isCollapsed
    }
  },
  created () {
    this.$store.dispatch('getMenuRoot')
  },
  mounted () {
    let moduleHeight = this.$refs.module.$el.clientHeight
    let breadcrumbHeight = this.$refs.breadcrumb.$el.clientHeight + 16 * 2
    let footerHeight = this.$refs.footer.$el.clientHeight
    let collapseHeight = this.$refs.collapse.$el.clientHeight
    let windowHeight = window.innerHeight
    this.menuHeight = windowHeight - moduleHeight - breadcrumbHeight - footerHeight - 5
    this.contentHeight = this.menuHeight - collapseHeight
  }
}
</script>
