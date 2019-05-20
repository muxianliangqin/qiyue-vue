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
  .layout-footer-center{
    text-align: center;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <cusModule></cusModule>
      <Layout :style="{padding: '0 50px'}">
        <cusBreadcrumb></cusBreadcrumb>
        <Content :style="{padding: '0px 0', minHeight: '280px', background: '#fff'}">
          <Layout>
            <Sider hide-trigger :style="{background: '#fff'}">
              <cusMenu></cusMenu>
            </Sider>
            <Content :style="{padding: '0 1rem', minHeight: '280px', background: '#fff'}">
              <Tabs type="card"
                    closable
                    @on-tab-remove="handleTabRemove">
                <template v-for="comp in components">
                  <TabPane :label="comp.desc"
                           v-if="comp.show">
                    <keep-alive>
                      <component :is="comp.name" :params="comp.params"> </component>
                    </keep-alive>
                  </TabPane>
                </template>
              </Tabs>
              <!--<keep-alive :exclude="['news']">
                <router-view></router-view>
              </keep-alive>-->
            </Content>
          </Layout>
        </Content>
      </Layout>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>
  </div>
</template>
<script>

import cusModule from './modules'
import cusMenu from './menus'
import cusBreadcrumb from './breadcrumbs'

export default {
  name: 'cus_home',
  components: {
    cusModule,
    cusMenu,
    cusBreadcrumb
  },
  data () {
    return {
      components: this.$store.getters.components
    }
  },
  created () {
    this.$store.dispatch('getMenuRoot')
  },
  methods: {
    handleTabRemove (name) {
      this['tab' + name] = false;
    }
  }
}
</script>
