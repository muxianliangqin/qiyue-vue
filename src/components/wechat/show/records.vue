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
    name: "records",
    props: ['params'],
    data () {
      return {
        findRecords: '/weChat/findRecords',
        pageNumber: 0,
        pageSize: 10,
        page: {},
        columns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '用户名',
            key: 'nickName'
          },
          {
            title: '用户群组显示名',
            key: 'actualNickName'
          },
          {
            title: '信息内容',
            key: 'textOrFilename'
          },
          {
            title: '记录时间',
            key: 'recordTime'
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
          groupNickName: self.params,
          page: this.pageNumber,
          size: this.pageSize
        }
        ajaxUtil.ajax(self.findRecords, param).done(function (response) {
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
