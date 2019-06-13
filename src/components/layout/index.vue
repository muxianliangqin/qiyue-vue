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
                        :key="module.element.code">
                <Icon type="ios-navigate" :key="module.element.code"></Icon>
                {{module.element.name}}
              </MenuItem>
            </template>
          </div>
        </Menu>
      </Header>
      <Layout :style="{padding: '0 32px'}">
        <!-- 导航区 -->
        <Breadcrumb :ref="layout.breadcrumb.ref"
                    :style="{padding: '8px 0', 'text-align': 'left'}">
          <template v-for="breadcrumb in getBreadcrumbs">
            <BreadcrumbItem :key="'breadcrumb_' + breadcrumb.code">
              <span>
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
                    @on-select="menuSelect"
                    theme="light"
                    width="auto"
                    accordion>
                <template v-for="(menu, index) in layout.side.menus">
                  <Submenu :name="menuNamePrefix + index"
                           :key="menu.element.code"
                           @click.native=''>
                    <template slot="title">
                      <Icon type="ios-keypad" ></Icon>
                      {{menu.element.name}}
                    </template>
                    <template v-for="(menu2, index2) in menu.children">
                      <MenuItem :name="menuNamePrefix + index + '-' + index2"
                                :key="menu2.element.code">
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
      menuNameSeparator: '-',
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
      return this.menuNamePrefix + this.layout.side.activeMenus.join(this.menuNameSeparator)
    },
    getSideOpenNames: function () {
      let openNames = this.layout.side.openNames
      openNames.forEach((v,i) => {openNames[i]=this.menuNamePrefix + v })
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
      /* 初始化页面布局 */
      let params = {userId: this.$store.getters.userInfo.id}
      this.layout.root = ajaxUtil.ajaxSync(this.getMenuNode, params).content
      this.$store.dispatch('setMenuRoot', this.layout.root)
      this.initModule()
      this.initSide()
    },
    initModule () {
      /* 初始化模块区 */
      let moduleMenus = this.layout.root.children
      this.layout.module.menus = moduleMenus
      let moduleActiveMenus = [1]
      this.layout.module.activeMenus = moduleActiveMenus
    },
    initSide () {
      /* 初始化侧边栏菜单区 */
      let sideModule = this.getSideModuleFromModule()
      let sideMenus = sideModule.menus
      this.layout.side.menus = sideMenus
      // 设定MenuItem的name前缀
      this.menuNamePrefix = sideModule.element.code + this.menuNameSeparator
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
    getSideModuleFromModule () {
      /* 切换模块时获取侧边栏菜单组以及模块详情 */
      let moduleMenus = this.layout.module.menus
      let moduleActiveMenus = this.layout.module.activeMenus
      let sideMenus = []
      let moduleElement = {}
      for (let i=0;i<moduleActiveMenus.length;i++) {
        let vi = moduleActiveMenus[i]
        sideMenus = moduleMenus[vi].children
        moduleElement = moduleMenus[vi].element
        moduleMenus = sideMenus
      }
      return {
        menus: sideMenus,
        element: moduleElement
      }
    },
    changeModule (name) {
      /* 切换模块 */
      this.layout.module.activeMenus = [parseInt(name)]
      this.initSide()
      this.initMenus()
      let activeName = this.menuNamePrefix + this.layout.side.activeMenus.join(this.menuNameSeparator)
      this.menuSelect(activeName)
    },
    handleTabRemove (name) {
      /* 点击关闭标签时执行 */
      this.$store.dispatch('delComponent', name)
    },
    toComponent (menu) {
      /* 跳转标签 */
      let path = baseUtil.generateCompName(menu.element.url)
      let param = {
        name: path,
        desc: menu.element.name,
        show: true,
        new: false,
        params: menu.element
      }
      this.$store.dispatch('addComponent', param)
    },
    initMenus () {
      /* 页面加载后打开初始化页面 */
      this.layout.side.initMenus.forEach((v)=>{this.toComponent(v)})
    },
    contentHeight () {
      /* 计算标签显示区的高度 */
      let clientHeight = document.documentElement.clientHeight
      let moduleHeight = this.$refs[this.layout.module.ref].$el.clientHeight
      let breadcrumbHeight = this.$refs[this.layout.breadcrumb.ref].$el.clientHeight
      let footHeight = this.$refs[this.layout.foot.ref].$el.clientHeight
      let contentHeight = clientHeight - moduleHeight - breadcrumbHeight - footHeight - 25
      this.layout.content.style.height = contentHeight + 'px'
      this.$store.dispatch('setTabsHeight', contentHeight)
    },
    getMenuByName (menus, name) {
      /* 根据name从menus数组中获得menu */
      let indices = name.slice(this.menuNamePrefix.length).split(this.menuNameSeparator)
      let selectedMenu = []
      for (let i=0;i<indices.length;i++) {
        let index = parseInt(indices[i])
        selectedMenu = menus[index]
        menus = selectedMenu.children
      }
      return selectedMenu
    },
    menuSelect (name) {
      /* 点击选择菜单 */
      let sideMenus = this.layout.side.menus
      let selectedMenu = this.getMenuByName(sideMenus, name)
      // 更新导航区
      this.layout.breadcrumb.breadcrumbs = selectedMenu.breadcrumbs
      // 跳转到标签
      this.toComponent(selectedMenu)
      // 更新活动标签
      let tabsActive = baseUtil.generateCompName(selectedMenu.element.url);
      this.$store.dispatch('setTabsActive',tabsActive)
    }
  },
  mounted () {
    this.initMenus()
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
