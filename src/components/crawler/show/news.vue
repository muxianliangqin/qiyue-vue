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
            key: 'title',
            render: (h, params) => {
              return h('a', {
                attrs: {
                  href: params.row.url,
                  target: '_blank'
                }
              }, params.row.title)
            }
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
