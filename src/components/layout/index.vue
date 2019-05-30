<template>
  <div class="layout">
    <Layout>
      <Header>
        <!-- 顶部模块区 -->
        <Menu mode="horizontal"
              theme="dark"
              active-name="1"
              :ref="layout.module.ref"
              @on-select="changeModule">
          <div class="layout-logo">
            <!--<span>七月于我，惟梦之初</span>-->
          </div>
          <div class="layout-nav">
            <template v-for="(module, index) in layout.module.menus">
              <MenuItem :name="index"
                        :key="module.element.id">
                <Icon type="ios-navigate" :key="module.element.id"></Icon>
                {{module.element.name}}
              </MenuItem>
            </template>
          </div>
        </Menu>
      </Header>
      <Layout :style="{padding: '0 32px'}">
        <!-- 导航区 -->
        <Breadcrumb :ref="layout.breadcrumb.ref"
                    :style="{padding: '16px 0', 'text-align': 'left'}">
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
        <Content :style="{padding: '8px 0', minHeight: '300px', background: '#fff'}">
          <Layout>
            <!-- 侧边栏菜单区 -->
            <Sider hide-trigger
                   :ref="layout.side.ref"
                   :style="{background: '#fff', borderRight: '1px solid #dcdee2'}">
              <Menu :ref='layout.side.sideMenuRef'
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
                      <MenuItem :name="menuNamePrefix+index + '-' + index2"
                                :key="menu2.element.id"
                                @click.native.stop='linkToNext(menu2)'>
                        {{menu2.element.name}}
                      </MenuItem>
                    </template>
                  </Submenu>
                </template>
              </Menu>
            </Sider>
            <!-- 内容展示区 -->
            <Content :ref="layout.content.ref"
                     :style="layout.content.style">
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
      <Footer :ref="layout.foot.ref"
              class="layout-footer-center">
        2019 &copy; AI-qiyue
      </Footer>
    </Layout>
  </div>
</template>
<script>
import baseUtil from '@/assets/util/baseUtil'
import ajaxUtil from '@/assets/util/ajaxUtil'
import menuUtil from '@/assets/util/menuUtil'
import $ from 'jquery'
export default {
  data () {
    return {
      menuNamePrefix: 'm',
      getMenuNode: '/user/getMenuNode',
      layout: {               // 页面总体布局
        root: null,           // 总菜单树
        module: {             // 顶部模块区
          ref: 'module',
          menus: [],
          activeMenus: []     // 活动菜单
        },
        breadcrumb: {
          ref: 'breadcrumb',
          breadcrumbs: []     // 导航区
        },
        side: {               // 侧边菜单区
          ref: 'side',
          menus: [],
          activeMenus: [],    // 活动菜单
          openNames: [],      // 展开菜单
          initMenus: [],      // 初始化菜单
          sideMenuRef: 'sideMenu'
        },
        content: {
          ref: 'content',
          style: {
            padding: '0 8px',
            height: '300px',
            background: '#fff'
          }
        },
        foot: {
          ref: 'foot'
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
      return menuUtil.getBreadcrumbs(this.layout.root, this.layout.breadcrumb.breadcrumbs)
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
      this.layout.root = ajaxUtil.ajaxSync(this.getMenuNode, params).content
      this.initModule()
      this.initSide()
    },
    initModule () {
      let moduleMenus = this.layout.root.children
      this.layout.module.menus = moduleMenus
      let moduleActiveMenus = [1]
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
      this.layout.breadcrumb.breadcrumbs = activeMenus[0].breadcrumbs
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
    },
    contentHeight () {
      let clientHeight = document.documentElement.clientHeight
      let moduleHeight = this.$refs[this.layout.module.ref].$el.clientHeight
      let breadcrumbHeight = this.$refs[this.layout.breadcrumb.ref].$el.clientHeight
      let footHeight = this.$refs[this.layout.foot.ref].$el.clientHeight
      let contentHeight = clientHeight - moduleHeight - breadcrumbHeight - footHeight - 25
      this.layout.content.style.height = contentHeight + 'px'
      this.$store.dispatch('setTabsHeight', contentHeight)
    }
  },
  mounted () {
    this.initMenus()
    this.$nextTick(() => {
      this.$refs[this.layout.side.sideMenuRef].updateOpened()
      this.$refs[this.layout.side.sideMenuRef].updateActiveName()
    })
    this.contentHeight()
  },
  watch: {
    // 监听openNames值的变化，重新执行以下方法，openNames和activeMenu才会生效
    getSideActiveMenu () {
      this.$nextTick(() => {
        this.$refs[this.layout.side.sideMenuRef].updateOpened()
      })
    },
    getSideOpenNames () {
      this.$nextTick(() => {
        this.$refs[this.layout.side.sideMenuRef].updateActiveName()
      })
    }
  }
}
</script>
<style scoped>

</style>
