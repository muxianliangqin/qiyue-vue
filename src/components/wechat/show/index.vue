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
    <Page :total='group.page.totalElements'
          show-sizer @on-change="pageChange"
          @on-page-size-change="pageSizeChange"/>
  </div>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: 'cus_news',
    props: ['params'],
    data () {
      return {
        findGroups: '/weChat/findGroups',
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
                      let component = {
                        name: 'WechatShowRecords',
                        desc: '消息记录',
                        show: true,
                        new: true,
                        params: params.row.groupNickName
                      }
                      self.$store.dispatch('setComponent', component)
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
