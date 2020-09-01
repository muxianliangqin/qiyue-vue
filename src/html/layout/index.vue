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
          <Row>
            <Col span="20">
              <div style="float: left;">
                <template v-for="(module, index) in modules">
                  <MenuItem :name="index"
                            :key="module.element.data.menuId">
                    <Icon :custom="'icon-font icon-' + module.element.data.icon" :key="module.element.data.menuId"></Icon>
                    {{module.element.data.name}}
                  </MenuItem>
                </template>
              </div>
            </Col>
            <Col span="4">
              <div style="float: right">
                <span style="color: white">尊敬的:</span>
                <Dropdown style="margin-left: 8px" @on-click="logout">
                  <a href="javascript:void(0)">
                    {{userInfo.alias}}
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem v-if="userInfo.username === 'visitor'"
                                  name="sign">注册
                    </DropdownItem>
                    <DropdownItem name="logout">登出</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Menu>
      </Header>
      <Layout :style="{padding: '0 1rem'}">
        <Content :style="{padding: '8px 0', minHeight: '300px', background: '#fff'}">
          <Layout>
            <!-- 侧边栏菜单区 -->
            <Sider :ref="layout.side.ref"
                   collapsible :collapsed-width="78"
                   v-model="layout.side.isCollapsed"
                   :style="{background: '#fff', borderRight: '1px solid #dcdee2'}">
              <Menu :ref='layout.side.sideMenuRef'
                    :active-name="activeName"
                    :open-names="openNames"
                    @on-select="menuSelect"
                    theme="light"
                    width="auto"
                    :class="['menu-item', layout.side.isCollapsed ? 'collapsed-menu' : '']"
                    style="text-align: left"
                    accordion>
                <template v-for="(menu, index) in sideMenus">
                  <Submenu :name="menu.element.data.menuId"
                           :key="menu.element.data.menuId">
                    <template slot="title">
                      <Icon :custom="'icon-font icon-' + menu.element.data.icon" ></Icon>
                      <span>{{menu.element.data.name}}</span>
                    </template>
                    <template v-for="(menu2, index2) in menu.children">
                      <MenuItem :name="menu2.element.data.menuId"
                                :key="menu2.element.data.menuId">
                        <Icon :custom="'icon-font icon-' + menu2.element.data.icon" ></Icon>
                        <span>{{menu2.element.data.name}}</span>
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
                  <TabPane :label="comp.label"
                           v-if="comp.show"
                           :key="comp.name"
                           :style="layout.content.tabPaneStyle"
                           :name="comp.name">
                    <keep-alive>
                      <router-view :is="comp.name" :params="comp.params" :menuData="comp.menuData"></router-view>
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
  import baseUtil from '@/assets/utils/baseUtil'

  export default {
    data () {
      return {
        url: {
          getMenuNodeByUserId: '/user/menu/getMenuNodeByUserId',
          logout: '/user/logout',
        },
        layout: {               // 页面总体布局
          root: {},             // 总菜单树
          activeModule: 0,      // 活动模块,默认第一个
          module: {             // 顶部模块区
            ref: 'module',
          },
          breadcrumb: {
            ref: 'breadcrumb',
            breadcrumbs: []     // 导航区
          },
          side: {               // 侧边菜单区
            isCollapsed: false,
            ref: 'side',
            sideMenuRef: 'sideMenu'
          },
          content: {
            ref: 'content',
            style: {
              padding: '0 8px',
              height: '300px',
              background: '#fff'
            },
            tabPaneStyle: {
              height: '300px'
            }
          },
          foot: {
            ref: 'foot'
          }
        },
      }
    },
    computed: {
      modules () {
        if (JSON.stringify(this.layout.root) !== '{}') {
          return this.layout.root.children
        }
      },
      // 获得侧边栏菜单
      sideMenus () {
        return this.getSideMenus()
      },
      activeName () {
        let activeMenu = this.getActiveMenu()
        if (activeMenu) {
          return activeMenu.element.data.menuId
        }
      },
      openNames () {
        return this.getOpenNames()
      },
      getComponents () {
        return this.$store.getters.tabs.components
      },
      getActive: {
        get () {
          return this.$store.getters.tabs.active
        },
        set (value) {
          this.$store.dispatch('setTabsActive', value)
        }
      },
      userInfo () {
        return this.$store.getters.userInfo
      }
    },
    created () {
      const userInfo = this.$store.getters.userInfo
      if (!userInfo.username) {
        this.isVisitor()
      } else {
        this.initLayout()
      }
    },
    methods: {
      /**
       * 初始化页面布局
       * @returns {Promise<void>}
       */
      async initLayout () {
        this.layout.root = await this.getMenuNode()
        this.$store.dispatch('setMenuTree', this.layout.root).then(() => {
          console.log('获取菜单树成功')
        })
      },
      /**
       * 后台获取菜单树
       * @returns {Promise<*>}
       */
      async getMenuNode () {
        /*
        async + await 实现的同步，此方法等待，其他方法异步运行，并不是剩下的所有程序都等待
        */
        const response = await this.$http.post(this.url.getMenuNodeByUserId, this.$store.getters.userInfo.userId)
        return response.content
      },
      /**
       * 获取侧边栏菜单组
       * @returns {*}
       */
      getSideMenus () {
        if (JSON.stringify(this.layout.root) !== '{}') {
          // 模块组
          const modules = this.layout.root.children
          // 活动模块的所有子节点
          return modules[this.layout.activeModule].children
        }
      },
      /**
       * 获取活动菜单
       * @returns {*[]}
       */
      getActiveMenu () {
        const typeCodeArray = ['module', 'menuFolder', 'menu']
        if (JSON.stringify(this.layout.root) !== '{}') {
          const sideMenus = this.getSideMenus()
          let activeMenu = sideMenus[0]
          while (activeMenu.hasChild) {
            let firstMenu = activeMenu.children[0]
            if (typeCodeArray.includes(firstMenu.element.data.typeCode)) {
              activeMenu = firstMenu
            } else {
              return activeMenu
            }
          }
          return activeMenu
        }
      },
      /**
       *
       * 展开指定子菜单，默认第一组
       * @returns {*[]}
       */
      getOpenNames () {
        if (JSON.stringify(this.layout.root) !== '{}') {
          const sideMenus = this.getSideMenus()
          return [sideMenus[0].element.data.menuId]
        }
      },
      /**
       * 切换模块
       * @param name 模块的索引
       */
      changeModule (name) {
        this.layout.activeModule = name
        this.$store.dispatch('initTabs')
      },
      handleTabRemove (name) {
        /* 点击关闭标签时执行 */
        this.$store.dispatch('delComponent', name)
      },
      /**
       * 设置tab区打开的页面
       * @param menu
       */
      toComponent (menu) {
        if (!menu) {
          return
        }
        let htmlComponentName = menu.element.data.componentName
        let param = {
          name: htmlComponentName,
          label: menu.element.data.name,
          show: true,
          new: true,
          menuData: menu.element.data,
          params: {}
        }
        this.$store.dispatch('addComponent', param)
      },
      /**
       * 计算标签显示区的高度
       */
      contentHeight () {
        let clientHeight = document.documentElement.clientHeight
        let moduleHeight = this.$refs[this.layout.module.ref].$el.clientHeight
        let breadcrumbHeight = 0//this.$refs[this.layout.breadcrumb.ref].$el.clientHeight;
        let footHeight = this.$refs[this.layout.foot.ref].$el.clientHeight
        let contentHeight = clientHeight - moduleHeight - breadcrumbHeight - footHeight - 25
        this.layout.content.style.height = contentHeight + 'px'
        this.layout.content.tabPaneStyle.height = contentHeight - 48 + 'px'
        this.$store.dispatch('setTabsHeight', contentHeight)
      },
      /**
       * 根据menuId从menus数组中获得menu
       * @param menus 侧边栏的菜单组
       * @param menuId 选中的菜单menuId
       * @returns {*|*|void}
       */
      getMenuByName (menus, menuId) {
        let result = undefined
        for (let menu of menus) {
          if (menu.element.data.menuId === menuId) {
            result = menu
          } else if (menu.hasChild) {
            result = this.getMenuByName(menu.children, menuId)
          }
          if (result) {
            return result
          }
        }
      },
      /**
       * 点击选择菜单
       * @param name 菜单name，此处是menuId
       */
      menuSelect (name) {
        const sideMenus = this.getSideMenus()
        let selectedMenu = this.getMenuByName(sideMenus, name)
        // 跳转到标签
        this.toComponent(selectedMenu)
        // 更新活动标签
        let tabsActive = selectedMenu.element.data.componentName
        this.$store.dispatch('setTabsActive', tabsActive)
      },
      /**
       * 登出
       */
      logout (name) {
        if (name === 'logout') {
          this.$http.instance.get(this.url.logout, () => {
            this.$router.replace({path: 'login'})
          })
        } else if (name === 'sign') {
          this.$router.replace({path: 'sign'})
        }
      },
      isVisitor () {
        this.$http.post('/user/login', {
          username: 'visitor',
          password: '123'
        }).then((response) => {
          this.$store.dispatch('setUserInfo', response.content).then(() => {
            this.initLayout()
          })
        })
      }
    },
    mounted () {
      this.contentHeight()
    },
    watch: {
      // 监听 computed中sideMenus值的变化，重新执行以下方法，openNames和activeMenu才会生效
      sideMenus () {
        this.$nextTick(() => {
          this.toComponent(this.getActiveMenu())
          this.$refs[this.layout.side.sideMenuRef].updateOpened()
          this.$refs[this.layout.side.sideMenuRef].updateActiveName()
        })
      },
    }
  }
</script>
<style scoped>
  /deep/ .collapsed-menu i.ivu-menu-submenu-title-icon {
    display: none;
  }

  /deep/ .ivu-layout-sider-trigger {
    position: absolute;
    color: black;
    background: white;
    border-right: 1px solid rgb(220, 222, 226);
  }
</style>
