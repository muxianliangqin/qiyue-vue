<template>
  <Menu ref='moduleMenu'
        :active-name="activeMenu"
        theme="dark"
        width="auto"
        :open-names="openNames"
        accordion>
    <template v-for="menu in menus">
      <Submenu :name="menu.element.id"
               :key="'menu_' + menu.element.id"
               @click.native='setBreadcrumbs(menu.breadcrumbs)'>
        <template slot="title">
          <Icon type="ios-keypad" ></Icon>
          {{menu.element.name}}
        </template>
        <template v-for="menu2 in menu.children">
          <Submenu :name="menu.element.id + '-' + menu2.element.id"
                   v-if="menu2.hasChild">
            <template slot="title">{{menu2.element.name}}</template>
            <template v-for="menu3 in menu2.children">
              <MenuItem :name="menu.element.id + '-' + menu2.element.id + '-' + menu3.element.id"
                        :key="'subMenu_' + menu3.element.id"
                        @click.native.stop='linkToNext(menu3)'
                        >
                {{menu3.element.name}}
              </MenuItem>
            </template>
          </Submenu>
          <MenuItem :name="menu.element.id + '-' + menu2.element.id"
                    :key="'subMenu_' + menu2.element.id"
                    @click.native.stop='linkToNext(menu2)'
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
    setBreadcrumbs (breadcrumbs) {
      this.$store.dispatch('setBreadcrumbs', breadcrumbs)
    },
    toComponent (menu) {
      let re = /^\d+$/
      let id = menu.element.id
      let url = menu.element.url
      let path = menu.element.url
      if (re.test(id)) {
        path = 'news_show'
      }
      this.$router.push({name: path, params: {id: id, url: url}})
    },
    linkToNext (menu) {
      this.toComponent(menu)
      this.setBreadcrumbs(menu.breadcrumbs)
    },
    init () {
      this.toComponent(this.$store.getters.initMenu)
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
