<template>
  <Table :border="true"
         :columns="columns"
         :data="getData"
         :show-header="true"
         :stripe="true"
         :highlight-row="true"
         :style="{border: 'none'}"
         size="small">
  </Table>
</template>

<script>
  export default {
    name: "regexp_expand",
    props: {
      row: Object
    },
    data () {
      return {
        columns: [
          {title: '序号', type: 'index', width: 70},
          {title: '正则表达式', key: 'regexp', width: 150,
            render: (h,params) => {
              return h('span',{
                style:{
                  fontWeight:'bolder'
                }
              },params.row.regexp)
            }
          },
          { title: '标签', key: 'label'},
          { title: '说明', key: 'desc'}
        ]
      }
    },
    computed: {
      getData () {
        return this.row.children;
      }
    }
  }
</script>

<style scoped>

</style>
