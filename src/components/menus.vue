<template>
  <Menu ref='moduleMenu'
        :active-name="activeMenu"
        theme="dark"
        width="auto"
        :open-names="openNames"
        accordion>
    <template v-for="menu in menus">
      <Submenu :name="menu.element.code"
               :key="'menu_' + menu.element.code"
               @click.native='setBreadcrumb(menu.breadcrumbs)'>
        <template slot="title">
          <Icon type="ios-keypad" ></Icon>
          {{menu.element.name}}
        </template>
        <template v-for="menu2 in menu.children">
          <Submenu :name="menu.element.code + '-' + menu2.element.code"
                   v-if="menu2.hasChild">
            <template slot="title">{{menu2.element.name}}</template>
            <template v-for="menu3 in menu2.children">
              <MenuItem :name="menu.element.code + '-' + menu2.element.code + '-' + menu3.element.code"
                        :key="'subMenu_' + menu3.element.code"
                        @click.native.stop='linkToNews(menu3)'
                        >
                {{menu3.element.name}}
              </MenuItem>
            </template>
          </Submenu>
          <MenuItem :name="menu.element.code + '-' + menu2.element.code"
                    :key="'subMenu_' + menu2.element.code"
                    @click.native.stop='linkToNews(menu2.breadcrumbs)'
                    v-else>
            {{menu2.element.name}}
          </MenuItem>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>
<script>
export default {
  name: 'cus_menus',
  computed: {
    menus () {
      return this.$store.getters.menus
    },
    openNames () {
      return this.$store.getters.openNames
    },
    activeMenu () {
      return this.$store.getters.activeMenu
    }
  },
  methods: {
    linkToNews (menu) {
      this.$store.dispatch('setBreadcrumbs', menu.breadcrumbs)
      this.$router.push({name: 'news', params: {code: menu.element.code, categoryUrl: menu.element.url}})
    },
    init () {
      let initMenu = this.$store.getters.initMenu
      this.$router.push({name: 'news', params: {code: initMenu.element.code, categoryUrl: initMenu.element.url}})
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    // 监听openNames值得变化，重新执行以下方法，openNames和activeMenu才会生效
    openNames () {
      this.$nextTick(() => {
        this.$refs.moduleMenu.updateOpened()
      })
    },
    activeMenu () {
      this.$nextTick(() => {
        this.$refs.moduleMenu.updateActiveName()
      })
    }
  }
}
</script>
<style scoped>

</style>
