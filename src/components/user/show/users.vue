<template>
  <div>
    <SelfPage :url="page.url"
              :columns="page.columns"
              :ref="page.ref"
              v-bind="$attrs"
              v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <Button type="primary" size="small" style="margin-right: 80px" @click="addItem">新增</Button>
        <Divider style="margin: 4px 0px 0px 0px"></Divider>
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
        <FormItem :label="form.labels.username" prop="username">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.username"
                     :placeholder="form.labels.username"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="form.labels.mobile" prop="mobile">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.mobile"
                     :placeholder="form.labels.mobile"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="form.labels.password" prop="password" v-if="form.action === 'add'">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.password"
                     :placeholder="form.labels.password"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="form.labels.alias" prop="alias">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.alias"
                     :placeholder="form.labels.alias"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="form.labels.gender" prop="gender">
          <Row>
            <Col span="15">
              <Select v-model="form.items.gender">
                <Option v-for="option in form.options.gender" :value="option.value" :key="option.value">
                  {{ option.label }}
                </Option>
              </Select>
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
    name: "users",
    data () {
      return {
        form: {
          modal: false,
          title: '',
          url: '',
          labels: {
            username: '用户名称',
            mobile: '手机号码',
            alias: '昵称',
            gender: '性别',
            password: '密码'
          },
          items: {
            username: '',
            mobile: '',
            alias: '',
            gender: '',
            password: ''
          },
          rules: {
            username: [
              {required: true, message: '请输入用户名称', trigger: 'blur'}
            ],
            mobile: [
              {required: true, message: '请输入手机号码', trigger: 'blur'}
            ],
            alias: [
              {required: false, message: '请输入昵称', trigger: 'blur'}
            ],
            gender: [
              {required: true, message: '请选择性别', trigger: 'blur'}
            ],
            password: [
              {required: true, message: '请选择性别', trigger: 'blur'}
            ]
          },
          extraParams: {},
          options: {
            gender: [
              {
                value: 'm',
                label: '男'
              },
              {
                value: 'f',
                label: '女'
              }
            ]
          }
        },
        add: {
          url: 'user/user/add'
        },
        modify: {
          url: 'user/user/modify'
        },
        del: {
          url: 'user/user/del'
        },
        stop: {
          url: 'user/user/stop'
        },
        restart: {
          url: 'user/user/restart'
        },
        state: {
          modal: false,
          title: undefined,
          url: '',
          msg: '',
          params: null
        },
        page: {
          url:　'user/user/findAll',
          ref: 'selfPage',
          columns: [
            {
              title: '序号',
              type: 'index',
              width: 100
            },
            {
              title: '用户名',
              key: 'username'
            },
            {
              title: '手机',
              key: 'mobile'
            },
            {
              title: '昵称',
              key: 'alias'
            },
            {
              title: '性别',
              key: 'gender',
              render: (h,params) => {
                let gender = params.row.gender
                let genderCn = ''
                if (gender === 'm') {
                  genderCn = '男'
                } else if (gender === 'f') {
                  genderCn = '女'
                } else {
                  genderCn = '未知'
                }
                return h('span',genderCn)
              }
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
                  stateCn = '冻结'
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
                      self.form.items.username = params.row.username;
                      self.form.items.mobile = params.row.mobile;
                      self.form.items.alias = params.row.alias;
                      self.form.items.gender = params.row.gender;
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
                      self.state.modal = true;
                      self.state.url = self.stop.url;
                      self.state.msg = '用户：' + params.row.username;
                      self.state.title = '确定要停用以下记录吗？';
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
                      self.state.msg = '用户：' + params.row.username;
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
                      self.state.msg = '用户：' + params.row.username;
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
        }
      }
    },
    methods: {
      addItem () {
        this.form.modal = true;
        this.form.title = '新增记录';
        this.form.url = this.add.url;
        this.form.items.username = '';
        this.form.items.mobile = '';
        this.form.items.alias = '';
        this.form.items.gender = '';
        this.form.items.password = '';

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
