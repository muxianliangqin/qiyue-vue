<template>
  <div>
    <Button type="primary" @click="add" style="float: right">新增</Button>
    <Divider style="margin-bottom:0"/>
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
          show-sizer @on-change="pageChange"
          @on-page-size-change="pageSizeChange"/>
    <Modal
      v-model="modal.show"
      @on-ok="ok"
      @on-cancel="cancel"
      title="新增监控群组">
      <Input v-model="modal.groupNickName" placeholder="请输入群组名"/>
    </Modal>
  </div>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  import Cell from "iview/src/components/cell/cell";
  export default {
    name: 'cus_news',
    components: {Cell},
    props: ['params'],
    data () {
      return {
        modal: {
          show: false,
          groupNickName: ''
        },
        findGroups: '/weChat/findGroups',
        delGroup: '/weChat/delete',
        addGroup: '/weChat/add',
        pageNumber: 0,
        pageSize: 10,
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
              return h('a', {
                on: {
                  click: function () {
                    let component = {
                      name: 'WechatShowRecords',
                      desc: '消息记录[' + params.row.groupNickName + ']',
                      show: true,
                      new: true,
                      params: params.row.groupNickName
                    }
                    self.$store.dispatch('addComponent', component)
                  }
                }
              }, params.row.groupNickName)
            }
          },
          {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let state = params.row.state
              state = state === 0?'不可用':'可用'
              return h('span',state)
            }
          },
          {
            title: '时间',
            key: 'updateTime'
          },
          {
            title: '操作',
            render: (h, params) => {
              let self = this
              let del = h('a', {
                on: {
                  click: function () {
                    let param = {
                      groupId: params.row.id
                    }
                    ajaxUtil.ajax(self.delGroup, param).done(function (response) {
                      if (response === 1) {
                        self.$Message.info('删除成功');
                        self.init()
                      }
                    })
                  }
                }
              }, '删除')
              return [del]
            }
          }
        ]
      }
    },
    computed: {

    },
    methods: {
      init () {
        let self = this
        let params = {
          userId: self.$store.getters.userInfo.id,
          page: this.pageNumber,
          size: this.pageSize
        }
        ajaxUtil.ajax(this.findGroups,params).done(function (response) {
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
      },
      add: function () {
        this.modal.show = true
      },
      ok: function () {
        let self = this
        let params = {
          userId: self.$store.getters.userInfo.id,
          groupNickName: self.modal.groupNickName
        }
        ajaxUtil.ajax(self.addGroup, params).done(function (response) {
          if (response === 1) {
            self.modal.show = false
            self.$Message.info('新增成功');
            self.init()
          }
        })
      },
      cancel: function () {
        this.modal.show = false
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style scoped>

</style>
