<template>
  <div>
    <SelfPage :url="url"
              :columns="columns"
              :selfParams="selfParams"
              v-bind="$attrs"
              v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <Button type="primary" style="margin-right: 80px" @click="add_show">新增</Button>
        <Divider style="margin: 4px 0px 0px 0px"></Divider>
      </div>
    </SelfPage>
    <Modal
      v-model="add.modal"
      @on-ok="add_ok"
      title="新增记录">
      <Input v-model="add.groupNickName" placeholder="请输入群组名"/>
    </Modal>
    <Modal
      v-model="modify.modal"
      @on-ok="modify_ok"
      title="记录修改">
      <Input v-model="modify.groupNickName" placeholder="请输入群组名"/>
    </Modal>
    <Modal v-model="del.modal"
           @on-ok="del_ok">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle" style="color: red"></Icon>
        <span>确定删除以下记录吗？</span>
      </p>
      <div style="text-align:center">
        <p>群组：{{del.msg}}</p>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="error" size="large" @click="del_ok">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: 'weChatShow',
    data () {
      return {
        add: {
          modal: false,
          groupNickName: ''
        },
        modify: {
          modal: false,
        },
        del: {
          modal: false,
          id: null,
          msg: null
        },
        selfParams: {
          userId: this.$store.getters.userInfo.id
        },
        url: '/weChat/findGroups',
        delGroup: '/weChat/delete',
        addGroup: '/weChat/add',
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
                      params: {
                        groupId: params.row.id
                      }
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
            align: 'center',
            render: (h, params) => {
              let self = this
              let modify = h('a', {
                style: {
                  marginRight: '2em'
                },
                on: {
                  click: function () {
                    self.modify.modal = true
                    // self.modify.msg = params.row.groupNickName
                  }
                }
              }, '修改')
              let del = h('a', {
                on: {
                  click: function () {
                    self.del.modal = true
                    self.del.msg = params.row.groupNickName
                  }
                }
              }, '删除')
              return [modify, del]
            }
          }
        ]
      }
    },
    computed: {

    },
    methods: {
      add_show () {
        this.add.modal = true
      },
      add_ok () {
        let self = this
        let params = {
          userId: self.$store.getters.userInfo.id,
          groupNickName: self.add.groupNickName
        }
        ajaxUtil.ajax(self.addGroup, params).done(function (response) {
          if (response === 1) {
            self.modal.show = false
            self.$Message.info('新增成功');
            self.init()
          }
        })
      },
      modify_ok () {

      },
      del_ok () {
        let param = {
          groupId: params.row.id
        }
        ajaxUtil.ajax(self.delGroup, param).done(function (response) {
          if (response === 1) {
            self.$Message.info('删除成功');
          }
        })
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
