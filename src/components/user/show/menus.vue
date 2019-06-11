<template>
  <div>
    <SelfPage :url="page.url"
              :columns="page.columns"
              :ref="page.ref"
              v-bind="$attrs"
              v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <Button type="primary" size="small" style="margin-right: 80px" @click="addMenu">新增</Button>
        <divider style="margin: 4px 0px 0px 0px"></divider>
      </div>
    </SelfPage>
    <Modal v-model="form.modal">
      <p slot="header" style="text-align:center">
        <template v-if="form.action === 'add'">
          <Icon type="md-add-circle" />
          <span>新增记录</span>
        </template>
        <template v-if="form.action === 'modify'">
          <Icon type="md-analytics" />
          <span>修改记录</span>
        </template>
      </p>
      <Form ref="form" :model="form.items" :rules="form.rules" :label-width="150">
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
        <FormItem :label-width="0" style="text-align: center;margin-bottom: 0px;">
          <Button type="primary" @click="handleSubmit('form')">提交</Button>
          <Button @click="handleReset('form')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div slot="footer" style="display: none">
      </div>
    </Modal>
    <SelfModalState v-model="state.modal"
                  :url="state.url"
                  :params="state.params"
                  :title="state.title"
                  @self-cancel="del_cancel">
      <div slot="msg" style="text-align: center">
        <p>{{state.msg}}</p>
      </div>
    </SelfModalState>
  </div>
</template>

<script>
  import Divider from "iview/src/components/divider/divider";
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: "menus",
    components: {Divider},
    data () {
      return {
        form: {
          modal: false,
          action: 'add',
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
          url:　'user/menu/findAll',
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
                      self.form.action = 'modify';
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
                        menuId: params.row.id
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
                        menuId: params.row.id
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
                        menuId: params.row.id
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
      addMenu () {
        this.form.modal = true
        this.form.action = 'add'
        this.form.items.code = ''
        this.form.items.name = ''
        this.form.items.superCode = ''

      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = null
            let msgSuccess = null
            let msgFail = null
            let params = this.form.items
            if (this.form.action == 'add') {
              url = this.add.url
              msgSuccess = '新增记录成功'
              msgFail = '新增记录失败，原因:'
            } else if (this.form.action == 'modify') {
              url = this.modify.url
              msgSuccess = '修改记录成功'
              msgFail = '修改记录失败，原因:'
            }
            params = Object.assign(params, this.form.extraParams);
            let self = this
            ajaxUtil.ajax(url,params).done(function (response) {
              if (response.errorCode === '0000') {
                self.$Message.success(msgSuccess);
                self.form.modal = false
                self.$refs[self.page.ref].reload()
              } else {
                self.$Message.error(msgFail + response.errorMsg);
              }
            }).fail(function (response) {
              self.$Message.info('网络异常:' + response.responseJSON.message);
            })
          } else {
            this.$Message.error('校验不通过，请重新填写');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      del_cancel () {
        this.$refs[this.page.ref].reload()
      }
    }
  }
</script>

<style scoped>

</style>
