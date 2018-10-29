<template>
  <div>
    <Table :border="true"
           :columns="columns"
           :data="data"
           :show-header="false"
           :stripe="true"
           :highlight-row="true"
           size="small"
           :height="400">
    </Table>
    <Page :total='total' :style="{margin: '20px 0'}" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
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
      page: 0,
      size: 10,
      data: [],
      total: 0,
      categoryUrl: this.$route.params.url,
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
  computed: {},
  methods: {
    getNews () {
      let params = {
        'categoryUrl': this.categoryUrl,
        'page': this.page,
        'size': this.size,
        'sort': ['updateTime']
      }
      let result = ajaxUtil.ajaxSync(this.getNewsUrl, params)
      this.data = result.content
      this.total = result.totalElements
    },
    pageChange (page) {
      this.page = page - 1
      this.getNews()
    },
    pageSizeChange (pageSize) {
      this.size = pageSize
      this.getNews()
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.getNews()
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.categoryUrl = to.params.url
    this.getNews()
    next()
  },
  watch: {}
}
</script>

<style scoped>

</style>
