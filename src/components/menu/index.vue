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
        <Content :style="{padding: '0px 0', minHeight: '260px', background: '#fff'}">
          <Layout>
            <Sider hide-trigger :style="{background: '#fff'}">
              <cusMenu></cusMenu>
            </Sider>
            <Content :style="{padding: '0 .5rem', minHeight: '260px', background: '#fff'}">
              <!--
              此处不能使用v-model双向绑定，因为store的值不允许在除了mutation的地方修改
              error:Do not mutate vuex store state outside mutation handlers.
              -->
              <Tabs type="card"
                    closable
                    v-model="getActive"
                    @on-tab-remove="handleTabRemove">
                <template v-for="comp in getComponents">
                  <TabPane :label="comp.desc"
                           v-if="comp.show"
                           :key="comp.name"
                           :name="comp.name">
                    <keep-alive>
                      <component :is="comp.name" :params="comp.params"> </component>
                    </keep-alive>
                  </TabPane>
                </template>
              </Tabs>
            </Content>
          </Layout>
        </Content>
      </Layout>
      <Footer class="layout-footer-center">2019 &copy; AI-qiyue</Footer>
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
    }
  },
  computed: {
    getComponents: function () {
      return this.$store.getters.tabs.components
    },
    getActive: {
      get () {
        return this.$store.getters.tabs.active
      },
      set (value) {
        this.$store.dispatch('setTabsActive', value)
      }
    }
  },
  created () {
    this.$store.dispatch('getMenuRoot')
  },
  methods: {
    handleTabRemove (name) {
      this.$store.dispatch('delComponent', name)
    }
  },
  watch: {
  }
}
</script>
