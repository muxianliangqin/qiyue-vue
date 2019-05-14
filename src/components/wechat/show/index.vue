<style>
  /* 对话框垂直居中 */
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vertical-center-modal .ivu-modal{
    top: 0;
  }
</style>
<template>
  <div>
    <Table :border="true"
           :columns="group.columns"
           :data="group.page.content"
           :show-header="true"
           :stripe="true"
           :highlight-row="true"
           size="small"
           :height="400">
    </Table>
    <Page :total='group.page.totalElements' show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
    <!--对话框显示群组信息记录-->
    <Modal v-model="modal"
           width="80"
           :footer-hide="true"
           class-name="vertical-center-modal">
      <p slot="header" style="color:black;text-align:left">
        <span>{{record.title}}</span>
      </p>
      <div style="text-align:center">
        <Table :border="true"
               :columns="record.columns"
               :data="record.page.content"
               :show-header="true"
               :stripe="true"
               :highlight-row="true"
               size="small"
               :height="400">
        </Table>
        <Page :total='record.page.totalElements' show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: 'cus_news',
    data () {
      return {
        findGroups: '/weChat/findGroups',
        findRecords: '/weChat/findRecords',
        modal: false,
        group: {
          page: {},
          columns: [
            {
              title: '序号',
              type: 'index'
            },
            {
              title: '群组名',
              key: 'groupNickName',
              render: (h, params) => {
                let self = this
                return h('a',{
                  on: {
                    click: function () {
                      self.record.title = params.row.groupNickName
                      let param = {'groupNickName':params.row.groupNickName}
                      ajaxUtil.ajax(self.findRecords,param).done(function (response) {
                        self.record.page = response
                      })
                      self.modal = true
                    }
                  }
                },params.row.groupNickName)
              }
            },
            {
              title: '状态',
              key: 'state'
            },
            {
              title: '时间',
              key: 'updateTime'
            }
          ]
        },
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
        },
      }
    },
    computed: {

    },
    methods: {
      init () {
        let self = this
        let params = {'userId': self.$store.getters.userInfo.id}
        ajaxUtil.ajax(this.findGroups,params).done(function (response) {
          self.group.page = response
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
