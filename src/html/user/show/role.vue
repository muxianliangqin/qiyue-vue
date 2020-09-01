<template>
  <div>
    <TablePage :url="page.url"
               :columns="page.columns"
               :ref="page.ref"
               v-bind="$attrs"
               v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <Button type="primary" size="small" style="margin-right: 80px" @click="addItem">新增</Button>
        <divider style="margin: 4px 0px 0px 0px"></divider>
      </div>
    </TablePage>
    <ModalForm v-model="form.modal"
               :title="form.title"
               :url="form.url"
               :items="form.items"
               :rules="form.rules"
               :extraParams="form.extraParams"
               @self-done="reload">
      <div slot="fields">
        <FormItem :label="form.labels.code" prop="code">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.code"
                     :placeholder="form.labels.code"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="form.labels.name" prop="name">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.name"
                     :placeholder="form.labels.name"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="form.labels.desc" prop="desc">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.desc"
                     :placeholder="form.labels.desc"></Input>
            </Col>
          </Row>
        </FormItem>
      </div>
    </ModalForm>
    <ModalState v-model="state.modal"
                :url="state.url"
                :params="state.params"
                :title="state.title"
                @self-done="reload">
      <div slot="msg" style="text-align: center">
        <p>{{state.msg}}</p>
      </div>
    </ModalState>
  </div>
</template>

<script>
  export default {
    name: 'rights',
    data () {
      return {
        form: {
          modal: false,
          title: '',
          url: '',
          labels: {
            code: '权限编码',
            name: '权限名称',
            desc: '权限描述'
          },
          items: {
            code: '',
            name: '',
            desc: ''
          },
          rules: {
            code: [
              {required: true, message: '请输入权限编码', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '请输入权限名称', trigger: 'blur'}
            ],
            desc: [
              {required: false, message: '请输入权限描述', trigger: 'blur'}
            ]
          },
          extraParams: {}
        },
        add: {
          url: 'user/role/add'
        },
        modify: {
          url: 'user/role/modify'
        },
        del: {
          url: 'user/role/del'
        },
        stop: {
          url: 'user/role/stop'
        },
        restart: {
          url: 'user/role/restart'
        },
        state: {
          modal: false,
          title: undefined,
          url: '',
          msg: '',
          params: null
        },
        tree: {
          modal: false,
          url: 'user/role/menu'
        },
        page: {
          url: 'user/role/findAll',
          ref: 'Page',
          columns: [
            {
              title: '序号',
              type: 'index',
              align: 'center',
              width: 100
            },
            {
              title: '权限代码',
              align: 'center',
              key: 'code'
            },
            {
              title: '权限名称',
              align: 'center',
              key: 'name'
            },
            {
              title: '权限描述',
              align: 'center',
              key: 'desc'
            },
            {
              title: '状态',
              align: 'center',
              key: 'state',
              render: (h, params) => {
                let state = params.row.state
                let stateCn = ''
                if (state === '0') {
                  stateCn = '正常'
                } else if (state === '1') {
                  stateCn = '删除'
                } else {
                  stateCn = '未知'
                }
                return h('span', stateCn)
              }
            },
            {
              title: '权限设置',
              align: 'center',
              render: (h, params) => {
                let self = this
                let set = h('a', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.tree.modal = true
                    }
                  }
                }, '菜单权限设置')
                return [set]
              }
            },
            {
              title: '操作',
              align: 'center',
              width: 250,
              render: (h, params) => {
                let self = this
                let modify = h('a', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.form.modal = true
                      self.form.title = '修改记录'
                      self.form.url = self.modify.url
                      self.form.items.code = params.row.code
                      self.form.items.name = params.row.name
                      self.form.items.desc = params.row.desc
                      self.form.extraParams = {
                        id: params.row.id
                      }
                    }
                  }
                }, '修改')
                let stop = h('a', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.state.modal = true
                      self.state.url = self.stop.url
                      self.state.msg = '用户：' + params.row.name
                      self.state.title = '确定要停用以下记录吗？'
                      self.state.params = {
                        id: params.row.id
                      }
                    }
                  }
                }, '停用')
                let restart = h('a', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.state.modal = true
                      self.state.msg = '用户：' + params.row.name
                      self.state.url = self.restart.url
                      self.state.title = '确定要启用以下记录吗？'
                      self.state.params = {
                        id: params.row.id
                      }
                    }
                  }
                }, '启用')
                let del = h('a', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.state.modal = true
                      self.state.msg = '用户：' + params.row.name
                      self.state.url = self.del.url
                      self.state.params = {
                        id: params.row.id
                      }
                    }
                  }
                }, '删除')
                let ops = []
                if (params.row.state === '0') {
                  ops = [modify, stop, del]
                } else {
                  ops = [modify, restart, del]
                }
                return ops
              }
            }
          ]
        }
      }
    },
    methods: {
      addItem () {
        this.form.modal = true
        this.form.title = '新增记录'
        this.form.url = this.add.url
        this.form.items.code = ''
        this.form.items.name = ''
        this.form.items.desc = ''
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
