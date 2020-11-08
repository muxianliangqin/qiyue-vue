<template>
  <div>
    <TablePage :url="page.url"
               :columns="page.columns"
               :ref="page.ref"
               v-bind="$attrs"
               v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <SystemAuth version="0"
                    :superMenuId="menuData.menuId"
                    name="新增"
                    typeCode="button"
                    desc="新增用户"
                    operateCode="insert">
          <Button type="primary" size="small" style="margin-right: 80px" @click="add">新增</Button>
        </SystemAuth>
        <Divider style="margin: 4px 0 0 0"></Divider>
      </div>
    </TablePage>
    <ModalForm v-model="modalForm.modal"
               :title="modalForm.title"
               :url="modalForm.url"
               :fields="modalForm.fields"
               :extraParams="modalForm.extraParams"
               @modal-ok="reload">
    </ModalForm>
    <ModalState v-model="state.modal"
                :url="state.url"
                :params="state.params"
                :title="state.title"
                @modal-ok="reload">
      <div slot="msg" style="text-align: center">
        <p>{{ state.msg }}</p>
      </div>
    </ModalState>
  </div>
</template>

<script>
export default {
  name: 'users',
  props: {
    // 菜单数据
    menuData: Object,
    // 页面参数
    params: Object
  },
  data () {
    return {
      modalForm: {
        fields: {
          username: {label: '用户名称', value: ''},
          mobile: {label: '手机号码', value: ''},
          alias: {label: '昵称', value: ''},
          gender: {
            label: '性别', value: '', type: 'select',
            select: {
              data: [
                // 如果value是数字，form检测必填时，不能检测通过
                {value: '1', label: '男'}, {value: '2', label: '女'}, {value: '0', label: '未知'}
              ]
            }
          },
          password: {
            label: '密码', value: '', rule: {required: false}
          }
        },
        modal: false,
        title: '',
        url: '',
        extraParams: {}
      },
      url: {
        add: 'user/user/add',
        modify: 'user/user/modify',
        del: 'user/user/del',
        stop: 'user/user/stop',
        restart: 'user/user/restart',
        findUserMenus: 'user/user/findUserMenus'
      },
      state: {
        modal: false,
        title: undefined,
        url: '',
        msg: '',
        params: null
      },
      page: {
        url: 'user/user/findAllPage',
        ref: 'Page',
        columns: [
          {title: '序号', type: 'index', align: 'center', width: 100},
          {title: '用户名', align: 'center', key: 'username'},
          {title: '手机', align: 'center', key: 'mobile'},
          {title: '昵称', align: 'center', key: 'alias'},
          {title: '性别', align: 'center', key: 'genderName'},
          {title: '状态', align: 'center', key: 'stateName'},
          {
            title: '菜单权限', align: 'center',
            render: (h, params) => {
              const userSetMenuTree = h('a', {
                style: {
                  margin: '0 1em'
                },
                on: {
                  click: () => {
                    let component = {
                      name: 'UserSetMenuTree',
                      label: '菜单树【' + params.row.username + '】',
                      isMenu: false,
                      menuData: this.menuData,
                      params: params.row,
                    }
                    this.$store.dispatch('addComponent', component)
                  }
                }
              }, '权限')
              let authUserSetMenuTree = this.$auth.createAuth(h, this.menuData.menuId)
                .link('权限设置', '前往菜单树页面设置用户权限等', this.$auth.OPERATE.UPDATE).build(userSetMenuTree)
              return [authUserSetMenuTree]
            }
          },
          {
            title: '操作', align: 'center', width: 250,
            render: (h, params) => {
              const modify = h('a', {
                style: {
                  margin: '0 1em'
                },
                on: {
                  click: () => {
                    this.modify(params)
                  }
                }
              }, '修改')
              const stop = h('a', {
                style: {
                  margin: '0 1em'
                },
                on: {
                  click: () => {
                    this.stop(params)
                  }
                }
              }, '停用')
              const restart = h('a', {
                style: {
                  margin: '0 1em'
                },
                on: {
                  click: () => {
                    this.restart(params)
                  }
                }
              }, '启用')
              const del = h('a', {
                style: {
                  margin: '0 1em'
                },
                on: {
                  click: () => {
                    this.delete(params)
                  }
                }
              }, '删除')
              // 创建权限组件的class类
              const auth = this.$auth.createAuth(h, this.menuData.menuId)
              const authModify = auth.link('编辑', '修改用户信息', this.$auth.OPERATE.UPDATE).build(modify)
              const authStop = auth.link('停用', '停用用户', this.$auth.OPERATE.UPDATE).build(stop)
              const authRestart = auth.link('重启', '重新启用用户', this.$auth.OPERATE.UPDATE).build(restart)
              const authDelete = auth.link('删除', '删除用户', this.$auth.OPERATE.DELETE).build(del)
              let ops
              if (params.row.state === 0) {
                ops = [authModify, authStop, authDelete]
              } else {
                ops = [authModify, authRestart, authDelete]
              }
              return ops
            }
          }
        ]
      }
    }
  },
  computed: {
    // getSuperMenuId () {
    //   if (this.menuData) {
    //     return this.menuData.menuId
    //   }
    // }
  },
  methods: {
    add () {
      this.modalForm.modal = true
      this.modalForm.title = '新增记录'
      this.modalForm.url = this.url.add
      this.$utils.resetModalFields(this.modalForm.fields)
      this.modalForm.fields.password.rule = {required: true, message: `请输入用户密码`, trigger: 'blur'}
    },
    modify (params) {
      this.modalForm.modal = true
      this.modalForm.title = '修改记录'
      this.modalForm.url = this.url.modify
      this.$utils.initModalFields(this.modalForm.fields, params.row)
      this.modalForm.fields.password.rule = {required: false}
      this.modalForm.extraParams = {
        userId: params.row.userId
      }
    },
    stop (params) {
      this.state.modal = true
      this.state.url = this.url.stop
      this.state.msg = '用户：' + params.row.username
      this.state.title = '确定要停用以下记录吗？'
      this.state.params = {
        userId: params.row.userId
      }
    },
    restart (params) {
      this.state.modal = true
      this.state.msg = '用户：' + params.row.username
      this.state.url = this.url.restart
      this.state.title = '确定要启用以下记录吗？'
      this.state.params = {
        userId: params.row.userId
      }
    },
    delete (params) {
      this.state.modal = true
      this.state.msg = '用户：' + params.row.username
      this.state.url = this.url.del
      this.state.params = {
        userId: params.row.userId
      }
    },
    reload (value) {
      if (value) {
        this.$refs[this.page.ref].reload()
      }
    }
  }
}
</script>

<style scoped>

</style>
