<template>
  <Header style="height:4rem">
    <Menu mode="horizontal" theme="dark" active-name="1">
      <div class="layout-logo"></div>
      <div class="layout-nav">
        <template v-for="module in getModules">
          <MenuItem :name="module.element.id" :key="'module_'+ module.element.id" @click.native="setModuleId(module.element.id)">
            <Icon type="ios-navigate" :key="'icon_'+ module.element.id"></Icon>
            {{module.element.name}}
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
      this.$store.dispatch('setModuleId', modules[0]['element'].id)
      return modules
    }
  },
  methods: {
    setModuleId (moduleId) {
      // @click.native 组件绑定原生事件
      this.$store.dispatch('setModuleId', moduleId)
      this.$router.push({path: '/news', query: {id: this.$store.getters.menus[0].children[0].element.id}})
    }
  }
}
</script>

<style scoped>

</style>
