<template>
  <div>
    <Table :border="true"
           :columns="record.columns"
           :data="record.page.content"
           :show-header="true"
           :stripe="true"
           :highlight-row="true"
           size="small"
           :height="400">
    </Table>
    <Page :total='record.page.totalElements'
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
        record: {
          title: '',
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
      }
    },
    methods: {
      init: function () {
        let self = this
        let groupNickName = self.params
        self.record.title = groupNickName
        let param = {'groupNickName': groupNickName}
        ajaxUtil.ajax(self.findRecords, param).done(function (response) {
          self.record.page = response
        })
      },
      pageChange (page) {
        console.log(page)
      },
      pageSizeChange (pageSize) {
        console.log(pageSize)
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style scoped>

</style>
