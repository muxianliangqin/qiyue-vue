<template>
  <div class="layout">
    <Layout>
      <Header>
        <!-- 顶部模块区 -->
        <Menu mode="horizontal"
              theme="dark"
              active-name="1"
              @on-select="changeModule">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <template v-for="(module, index) in layout.module.menus">
              <MenuItem :name="index"
                        :key="'module_'+ module.element.id">
                <Icon type="ios-navigate" :key="'icon_'+ module.element.id"></Icon>
                {{module.element.name}}
              </MenuItem>
            </template>
          </div>
        </Menu>
      </Header>
      <Layout :style="{padding: '0 2em'}">
        <!-- 导航区 -->
        <Breadcrumb :style="{margin: '16px 0', 'text-align': 'left'}">
          <template v-for="breadcrumb in getBreadcrumbs">
            <BreadcrumbItem :key="'breadcrumb_' + breadcrumb.url">
              <a :href="breadcrumb.url" v-if="breadcrumb.url">
                {{breadcrumb.name}}
              </a>
              <span v-else>
                {{breadcrumb.name}}
              </span>
            </BreadcrumbItem>
          </template>
        </Breadcrumb>
        <Content :style="{padding: '1em 0', minHeight: '280px', background: '#fff'}">
          <Layout>
            <!-- 侧边栏菜单区 -->
            <Sider hide-trigger :style="{background: '#fff'}">
              <Menu ref='sideMenu'
                    :active-name="getSideActiveMenu"
                    :open-names="getSideOpenNames"
                    theme="light"
                    width="auto"
                    accordion>
                <template v-for="(menu, index) in layout.side.menus">
                  <Submenu :name="menuNamePrefix+index"
                           :key="menu.element.id"
                           @click.native=''>
                    <template slot="title">
                      <Icon type="ios-keypad" ></Icon>
                      {{menu.element.name}}
                    </template>
                    <template v-for="(menu2, index2) in menu.children">
                      <Submenu :name="menuNamePrefix+index + '-' + index2"
                               v-if="menu2.hasChild">
                        <template slot="title">{{menu2.element.name}}</template>
                        <template v-for="(menu3, index3) in menu2.children">
                          <MenuItem :name="index + '-' + index2 + '-' + index3"
                                    :key="menu3.element.id"
                                    @click.native.stop='linkToNext(menu3)'>
                            {{menu3.element.name}}
                          </MenuItem>
                        </template>
                      </Submenu>
                      <MenuItem :name="menuNamePrefix+index + '-' + index2"
                                :key="menu2.element.id"
                                @click.native.stop='linkToNext(menu2)'
                                v-else>
                        {{menu2.element.name}}
                      </MenuItem>
                    </template>
                  </Submenu>
                </template>
              </Menu>
            </Sider>
            <!-- 内容展示区 -->
            <Content :style="{padding: '0 .5rem', minHeight: '280px', background: '#fff'}">
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
      <!-- 底部页脚区 -->
      <Footer class="layout-footer-center">2019 &copy; AI-qiyue</Footer>
    </Layout>
  </div>
</template>
<script>
import baseUtil from '@/assets/util/baseUtil'
import ajaxUtil from '@/assets/util/ajaxUtil'
import menuUtil from '@/assets/util/menuUtil'
export default {
  name: 'cus_home',
  data () {
    return {
      menuNamePrefix: 'm',
      layout: {               // 页面总体布局
        root: null,           // 总菜单树
        module: {             // 顶部模块区
          menus: [],
          activeMenus: []     // 活动菜单
        },
        breadcrumbs: [],      // 导航区
        side: {               // 侧边菜单区
          menus: [],
          activeMenus: [],    // 活动菜单
          openNames: [],      // 展开菜单
          initMenus: []       // 初始化菜单
        }
      },
    }
  },
  computed: {
    getSideActiveMenu: function () {
      return this.menuNamePrefix + this.layout.side.activeMenus.join('-')
    },
    getSideOpenNames: function () {
      let openNames = this.layout.side.openNames
      openNames.forEach((v,i)=>{openNames[i]=this.menuNamePrefix+v})
      return openNames
    },
    getBreadcrumbs: function () {
      return menuUtil.getBreadcrumbs(this.layout.root, this.layout.breadcrumbs)
    },
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
    this.initLayout()
  },
  methods: {
    initLayout () {
      let params = {userId: this.$store.getters.userInfo.id}
      let menuNode = ajaxUtil.ajaxSync('/user/getMenuNode', params)
      this.layout.root = menuNode
      this.initModule ()
      this.initSide ()
    },
    initModule () {
      let moduleMenus = this.layout.root.children
      this.layout.module.menus = moduleMenus
      let moduleActiveMenus = [0]
      this.layout.module.activeMenus = moduleActiveMenus
    },
    initSide () {
      let sideMenus = this.getSideMenusFromModule()
      this.layout.side.menus = sideMenus
      let sideActiveMenus = []
      sideActiveMenus.push(0)
      let activeMenus = sideMenus
      while (activeMenus[0].hasChild) {
        sideActiveMenus.push(0)
        activeMenus = activeMenus[0].children
      }
      this.layout.side.activeMenus = sideActiveMenus
      this.layout.side.initMenus.push(activeMenus[0])
      this.layout.breadcrumbs = activeMenus[0].breadcrumbs
      let sideOpenNames = []
      if (sideActiveMenus.length > 1) {
        sideOpenNames = sideActiveMenus.slice(-2, -1)
      } else {
        sideOpenNames = sideActiveMenus
      }
      this.layout.side.openNames = sideOpenNames
    },
    getSideMenusFromModule () {
      let moduleMenus = this.layout.module.menus
      let moduleActiveMenus = this.layout.module.activeMenus
      let sideMenus = []
      for (let i=0;i<moduleActiveMenus.length;i++) {
        let vi = moduleActiveMenus[i]
        sideMenus = moduleMenus[vi].children
        moduleMenus = sideMenus
      }
      return sideMenus
    },
    changeModule (name) {
      this.layout.module.activeMenus = [parseInt(name)]
      this.initSide()
    },
    handleTabRemove (name) {
      this.$store.dispatch('delComponent', name)
    },
    toComponent (menu) {
      let path = baseUtil.generateCompName(menu.element.xpath)
      let param = {
        name: path,
        desc: menu.element.name,
        show: true,
        new: false,
        params: menu.element
      }
      this.$store.dispatch('addComponent', param)
    },
    linkToNext (menu) {
      this.toComponent(menu)
      // this.setBreadcrumbs(menu.breadcrumbs)
    },
    initMenus () {
      this.layout.side.initMenus.forEach((v)=>{this.toComponent(v)})
    }
  },
  mounted () {
    this.initMenus()
    this.$nextTick(() => {
      this.$refs.sideMenu.updateOpened()
      this.$refs.sideMenu.updateActiveName()
    })
  },
  watch: {
    // 监听openNames值的变化，重新执行以下方法，openNames和activeMenu才会生效
    getSideActiveMenu () {
      this.$nextTick(() => {
        this.$refs.sideMenu.updateOpened()
      })
    },
    getSideOpenNames () {
      this.$nextTick(() => {
        this.$refs.sideMenu.updateActiveName()
      })
    }
  }
}
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-footer-center{
    text-align: center;
  }
  .layout-logo{
    width: 100px;
    height: 3rem;
    /*background: #5b6270;*/
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    position: relative;
    float: right;
    right: 4em;
    line-height: 64px;
  }
</style>
