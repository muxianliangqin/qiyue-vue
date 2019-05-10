<template>
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
</template>

<script>
export default {
  name: 'cus_breadcrumbs',
  computed: {
    getBreadcrumbs () {
      return this.$store.getters.breadcrumbs
    }
  }
}
</script>

<style scoped>

</style>
