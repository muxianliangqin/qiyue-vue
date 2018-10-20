<style>
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>
<template>
  <Menu ref='moduleMenu'
        :active-name="activeMenu"
        theme="dark"
        width="auto"
        :open-names="openNames"
        accordion
        :class="menuItemClasses">
    <template v-for="menu in menus">
      <Submenu :name="menu.element.id"
               :key="'menu_' + menu.element.id"
               @click.native='setBreadcrumbs(menu.breadcrumbs)'>
        <template slot="title" style="{'text-align': 'left'}">
          <Icon type="ios-keypad" ></Icon>
          <span>{{menu.element.name}}</span>
        </template>
        <template v-for="menu2 in menu.children">
          <Submenu :name="menu.element.id + '-' + menu2.element.id"
                   v-if="menu2.hasChild"
                   :key="'menu2_' + menu2.element.id">
            <template slot="title" style="text-align: left">
              <Icon type="ios-navigate"></Icon>
              <span>{{menu2.element.name}}</span>
            </template>
            <template v-for="menu3 in menu2.children">
              <MenuItem :name="menu.element.id + '-' + menu2.element.id + '-' + menu3.element.id"
                        :key="'subMenu_' + menu3.element.id"
                        @click.native.stop='linkToNext(menu3)'
                        >
                <Icon :key="'icon_' + menu3.element.id" type="md-list" />
                <span :key="'text_' + menu3.element.id">{{menu3.element.name}}</span>
              </MenuItem>
            </template>
          </Submenu>
          <MenuItem :name="menu.element.id + '-' + menu2.element.id"
                    :key="'subMenu_' + menu2.element.id"
                    @click.native.stop='linkToNext(menu2)'
                    v-else>
            <Icon type="ios-settings" :key="'subMenu_' + menu2.element.id"></Icon>
            <span :key="'text_' + menu2.element.id">{{menu2.element.name}}</span>
          </MenuItem>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>
<script>
export default {
  name: 'cus_menus',
  data () {
    return {
    }
  },
  props: ['isCollapsed'],
  computed: {
    menus () {
      return this.$store.getters.menus
    },
    openNames () {
      return this.$store.getters.openNames
    },
    activeMenu () {
      return this.$store.getters.activeMenu
    },
    menuItemClasses () {
      // this.$emit('collapsed', true)
      return [
        'menu-item',
        // 'collapsed-menu',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
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
