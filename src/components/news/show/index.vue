<template>
  <div>
    <Table :border="true"
           :columns="columns"
           :data="getNews"
           :show-header="false"
           :stripe="true"
           :highlight-row="true"
           size="small"
           :height="400">
    </Table>
    <Page :total='getTotal' :style="{margin: '20px 0'}" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
  </div>
</template>

<script>
import ajaxUtil from '@/assets/util/ajaxUtil'
export default {
  name: 'cus_news',
  data () {
    return {
      getNewsUrl: '/crawler/findNews',
      totalNumUrl: '/crawler/totalNum',
      columns: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 60
        },
        {
          title: '新闻',
          key: 'title',
          render: (h, params) => {
            return h('a', {
              attrs: {
                href: params.row.url,
                target: '_blank'
              }
            }, params.row.name)
          }
        }
      ]
    }
  },
  computed: {
    getNews () {
      let params = {'categoryUrl': this.$route.params.url}
      return ajaxUtil.ajaxSync(this.getNewsUrl, params)
    },
    getTotal () {
      let params = {'categoryUrl': this.$route.params.url}
      return ajaxUtil.ajaxSync(this.totalNumUrl, params)
    }
  },
  methods: {
    pageChange (page) {
      console.log(page)
    },
    pageSizeChange (pageSize) {
      console.log(pageSize)
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>

</style>
