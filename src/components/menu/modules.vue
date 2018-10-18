<template>
  <Header style="height:4rem">
    <Menu mode="horizontal" theme="dark" active-name="1">
      <div class="layout-logo"></div>
      <div class="layout-nav">
        <template v-for="module in getModules">
          <MenuItem :name="module['element'].code" :key="'module_'+ module['element'].code" @click.native="setModuleCode(module['element'].code)">
            <Icon type="ios-navigate" :key="'icon_'+ module['element'].code"></Icon>
            {{module['element'].name}}
          </MenuItem>
        </template>
      </div>
    </Menu>
  </Header>
</template>

<script>
export default {
  name: 'cus_modules',
  created () {
    this.$store.dispatch('getModules')
  },
  computed: {
    getModules () {
      let modules = this.$store.getters.modules
      this.$store.dispatch('setModuleCode', modules[0]['element'].code)
      return modules
    }
  },
  methods: {
    setModuleCode (moduleCode) {
      // @click.native 组件绑定原生事件
      this.$store.dispatch('setModuleCode', moduleCode)
      this.$router.push({path: '/news', query: {code: this.$store.getters.menus[0].children[0].element.code}})
    }
  }
}
</script>

<style scoped>

</style>
