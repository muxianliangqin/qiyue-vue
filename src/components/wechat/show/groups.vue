<template>
  <div>
    <SelfPage :url="url"
              :columns="columns"
              :selfParams="selfParams"
              ref="selfPage"
              v-bind="$attrs"
              v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <Button type="primary" style="margin-right: 80px" @click="add_ok">新增</Button>
        <Divider style="margin: 4px 0px 0px 0px"></Divider>
      </div>
    </SelfPage>
    <SelfModalAdd v-model="add.modal"
                  :columns="columns"
                  :url="add.url">

    </SelfModalAdd>

    <!--<Modal-->
      <!--v-model="add.modal"-->
      <!--@on-ok="add_ok"-->
      <!--title="新增记录">-->
      <!--<Input v-model="add.groupNickName" placeholder="请输入群组名"/>-->
    <!--</Modal>-->
    <!--<Modal-->
      <!--v-model="modify.modal"-->
      <!--@on-ok="modify_ok"-->
      <!--title="记录修改">-->
      <!--<Input v-model="modify.groupNickName" placeholder="请输入群组名"/>-->
    <!--</Modal>-->
    <SelfModalDel v-model="del.modal"
                  :url="del.url"
                  :params="del.params"
                  @self-cancel="del_cancel">
      <div slot="msg" style="text-align: center">
        <p>群组: {{del.msg}}</p>
      </div>
    </SelfModalDel>
  </div>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: 'groups',
    data () {
      return {
        add: {
          modal: false,
          url: '/weChat/add',
          msg: null,
          params: null
        },
        modify: {
          modal: false,
        },
        del: {
          modal: false,
          url: '/weChat/delete',
          msg: null,
          params: null
        },
        selfParams: {
          userId: this.$store.getters.userInfo.id
        },
        url: '/weChat/findGroups',
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
                    self.del.params = {
                      groupId: params.row.id
                    }
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
      add_ok () {
        this.add.modal = true
      },
      add_cancel () {
        this.$refs.selfPage.reload()
      },
      modify_cancel () {
        this.$refs.selfPage.reload()
      },
      del_cancel () {
        this.$refs.selfPage.reload()
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
