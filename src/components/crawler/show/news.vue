<template>
  <div>
    <Table :border="true"
           :columns="columns"
           :data="page.content"
           :show-header="true"
           :stripe="true"
           :highlight-row="true"
           size="small"
           :height="400">
    </Table>
    <Page :total='page.totalElements'
          show-sizer
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"/>
  </div>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: "news",
    props: ['params'],
    data () {
      return {
        findNews: '/crawler/findNews',
        pageNumber: 0,
        pageSize: 10,
        page: {},
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
    },
    computed: {

    },
    methods: {
      init: function () {
        let self = this
        let param = {
          categoryUrl: self.params,
          page: this.pageNumber,
          size: this.pageSize
        }
        ajaxUtil.ajax(self.findNews, param).done(function (response) {
          self.page = response
        })
      },
      pageChange (page) {
        this.pageNumber = page -1
        this.init()
      },
      pageSizeChange (pageSize) {
        this.pageSize = pageSize
        this.init()
      }
    },
    mounted () {
      this.init()
    },
    watch: {
      'params': function () {
        this.init()
      }
    }
  }
</script>

<style scoped>

</style>
