<template>
  <div>
    <SelfPage :url="page.url"
              :columns="page.columns"
              :pageParams="page.params"
              :ref="page.ref"
              v-bind="$attrs"
              v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <Button type="primary" style="margin-right: 80px" @click="addGroup">新增</Button>
        <Divider style="margin: 4px 0px 0px 0px"></Divider>
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
        <FormItem :label="form.labels.groupNickName" prop="groupNickName">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="form.items.groupNickName"
                     :placeholder="form.labels.groupNickName"></Input>
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
    <SelfModalState v-model="del.modal"
                  :url="del.url"
                  :params="del.params"
                  @self-cancel="del_cancel">
      <div slot="msg" style="text-align: center">
        <p>群组: {{del.msg}}</p>
      </div>
    </SelfModalState>
  </div>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: 'groups',
    data () {
      return {
        form: {
          modal: false,
          action: 'add',
          labels: {
            groupNickName: '群组名'
          },
          items: {
            groupNickName: ''
          },
          rules: {
            groupNickName: [
              {required: true, message: '请输入群组名', trigger: 'blur'}
            ]
          },
          extraParams: {}
        },
        add: {
          url: '/weChat/add'
        },
        modify: {
          url: '/weChat/modify'
        },
        del: {
          modal: false,
          url: '/weChat/delete',
          msg: '',
          params: null
        },
        page: {
          ref: 'selfPage',
          url: '/weChat/findGroups',
          params: {
            userId: this.$store.getters.userInfo.id
          },
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
                      self.form.modal = true
                      self.form.action = 'modify'
                      self.form.items.groupNickName = params.row.groupNickName
                      self.form.extraParams = {
                        id: params.row.id
                      }
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
        },
      }
    },
    computed: {

    },
    methods: {
      addGroup () {
        this.form.modal = true
        this.form.action = 'add'
        this.form.items.groupNickName = ''
        this.form.extraParams = {
          userId: this.$store.getters.userInfo.id
        }
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
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
