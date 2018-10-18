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
    <Page :total='getTotalNum' show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
  </div>
</template>

<script>
import crawlerHandler from '@/store/crawler'
export default {
  name: 'cus_news',
  data () {
    return {
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
      return crawlerHandler.getNews({'categoryUrl': this.$route.params.url})
    },
    getTotalNum () {
      return crawlerHandler.getTotal({'categoryUrl': this.$route.params.url})
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
  mounted () {
  },
  deactivated () {
  }
}
</script>

<style scoped>

</style>
