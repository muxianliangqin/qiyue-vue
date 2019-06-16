<template>
  <div>
    <SelfPage :url="page.url"
              :columns="page.columns"
              :ref="page.ref"
              v-bind="$attrs"
              v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <Button type="primary" size="small" style="float: left;margin-left: 20px" @click="menuTree">菜单树展示</Button>
        <Button type="primary" size="small" style="margin-right: 80px" @click="addItem">新增</Button>
        <divider style="margin: 4px 0px 0px 0px"></divider>
      </div>
    </SelfPage>
    <SelfModalForm v-model="form.modal"
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
        <FormItem :label="form.labels.superCode" prop="superCode">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.superCode"
                     :placeholder="form.labels.superCode"></Input>
            </Col>
          </Row>
        </FormItem>
      </div>
    </SelfModalForm>
    <SelfModalState v-model="state.modal"
                  :url="state.url"
                  :params="state.params"
                  :title="state.title"
                  @self-done="reload">
      <div slot="msg" style="text-align: center">
        <p>{{state.msg}}</p>
      </div>
    </SelfModalState>
  </div>
</template>

<script>
  export default {
    name: "menus",
    data () {
      return {
        form: {
          modal: false,
          title: '',
          url: '',
          labels: {
            code: '菜单编码',
            name: '菜单名称',
            superCode: '上级菜单'
          },
          items: {
            code: '',
            name: '',
            superCode: ''
          },
          rules: {
            code: [
              {required: true, message: '请输入菜单编码', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '请输入菜单名称', trigger: 'blur'}
            ],
            superCode: [
              {required: false, message: '请输入上级菜单', trigger: 'blur'}
            ]
          },
          extraParams: {}
        },
        add: {
          url: 'user/menu/add'
        },
        modify: {
          url: 'user/menu/modify'
        },
        del: {
          url: 'user/menu/del'
        },
        stop: {
          url: 'user/menu/stop'
        },
        restart: {
          url: 'user/menu/restart'
        },
        state: {
          modal: false,
          title: undefined,
          url: '',
          msg: '',
          params: null
        },
        page: {
          url:　'user/menu/findAllPage',
          ref: 'selfPage',
          columns: [
            {
              title: '序号',
              type: 'index',
              width: 100
            },
            {
              title: '菜单代码',
              key: 'code'
            },
            {
              title: '菜单名称',
              key: 'name'
            },
            {
              title: '上级菜单',
              key: 'superCode'
            },
            {
              title: '状态',
              key: 'state',
              render: (h, params) => {
                let state = params.row.state
                let stateCn = ''
                if (state === '0') {
                  stateCn = '正常'
                } else if (state === '1') {
                  stateCn = '停用'
                } else {
                  stateCn = '未知'
                }
                return h('span',stateCn)
              }
            },
            {
              title: '操作',
              align: 'center',
              width: 250,
              render: (h, params) => {
                let self = this
                let modify = h('Button', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.form.modal = true;
                      self.form.title = '修改记录';
                      self.form.url = self.modify.url;
                      self.form.items.code = params.row.code;
                      self.form.items.name = params.row.name;
                      self.form.items.superCode = params.row.superCode;
                      self.form.extraParams = {
                        id: params.row.id
                      }
                    }
                  }
                }, '修改')
                let stop = h('Button', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.state.modal = true
                      self.state.url = self.stop.url;
                      self.state.msg = '菜单：' + params.row.name
                      self.state.title = '确定要停用以下记录吗？'
                      self.state.params = {
                        id: params.row.id
                      }
                    }
                  }
                }, '停用')
                let restart = h('Button', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.state.modal = true;
                      self.state.msg = '菜单：' + params.row.name;
                      self.state.url = self.restart.url;
                      self.state.title = '确定要启用以下记录吗？';
                      self.state.params = {
                        id: params.row.id
                      }
                    }
                  }
                }, '启用')
                let del = h('Button', {
                  attrs: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin: 0 1em;'
                  },
                  on: {
                    click: function () {
                      self.state.modal = true;
                      self.state.msg = '菜单：' + params.row.name;
                      self.state.url = self.del.url;
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
        },
      }
    },
    methods: {
      addItem () {
        this.form.modal = true
        this.form.title = '新增记录';
        this.form.url = this.add.url;
        this.form.items.code = ''
        this.form.items.name = ''
        this.form.items.superCode = ''
      },
      menuTree () {
        let component = {
          name: 'UserSetMenuTree',
          desc: '菜单树',
          show: true,
          new: true,
          params: {
            edit: true
          }
        };
        this.$store.dispatch('addComponent', component)
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
