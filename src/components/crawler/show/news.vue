<template>
  <SelfPage :url="findNews"
            :columns="columns"
            v-bind="$attrs"
            v-on="$listeners">
  </SelfPage>
</template>

<script>
  export default {
    name: "news",
    data () {
      return {
        findNews: '/crawler/findNews',
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 100
          },
          {
            title: '标题',
            key: 'title'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
