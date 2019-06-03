<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="divStyle">
    <Collapse v-model="unfold"
              accordion
              @on-change="computeCollapseStyle"
              :style="collapseStyle">
      <template v-for="(web, index) of page.content">
        <Panel style="text-align: left;"
               :key="web.url">
            <span>{{web.title}}</span>
          <Button type="primary"
                  @click.native="category_handleSubmit('categoryForm')"
                  size='small'
                  class="self-button">新增</Button>
          <div slot="content">
            <Table :border="true"
                   :columns="columns"
                   :data="web.categories"
                   :show-header="true"
                   :stripe="true"
                   :highlight-row="true"
                   size="small">
            </Table>
          </div>
        </Panel>
      </template>
    </Collapse>
    <Page :total='page.totalElements'
          :ref="ref.page"
          class="self-page"
          show-sizer
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"/>
    <Modal v-model="category.form.modal">
      <p slot="header" style="text-align:center">
        <template v-if="category.form.action === 'add'">
          <Icon type="md-add-circle" />
          <span>新增记录</span>
        </template>
        <template v-if="category.form.action === 'modify'">
          <Icon type="md-analytics" />
          <span>修改记录</span>
        </template>
      </p>
      <Form ref="categoryForm" :model="category.form.items" :rules="category.form.rules" :label-width="150">
        <FormItem :label="category.form.labels.title" prop="title">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="category.form.items.title"
                     :placeholder="category.form.labels.title"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="category.form.labels.url" prop="url">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="category.form.items.url"
                     :placeholder="category.form.labels.url"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="category.form.labels.xpath" prop="xpath">
          <Row>
            <Col span="15">
              <Input type="text"
                     clearable
                     v-model="category.form.items.xpath"
                     :placeholder="category.form.labels.xpath"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label-width="0" style="text-align: center;margin-bottom: 0px;">
          <Button type="primary" @click="category_handleSubmit('categoryForm')">提交</Button>
          <Button @click="category_handleReset('categoryForm')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div slot="footer" style="display: none">
      </div>
    </Modal>
    <SelfModalDel v-model="category.del.modal"
                  :url="category.del.url"
                  :params="category.del.params"
                  @self-cancel="category_del_cancel">
      <div slot="msg" style="text-align: center">
        <p>{{category.del.msg}}</p>
      </div>
    </SelfModalDel>
  </div>
</template>
<script>
import ajaxUtil from '@/assets/util/ajaxUtil'
export default {
  props: ['params'],
  data () {
    return {
      unfold: '1',
      panelNamePrefix: 'p',
      findWebsUrl: '/crawler/findWebs',
      pageNumber: 0,
      pageSize: 10,
      page: {},
      collapseStyle: {},
      ref: {
        rootDiv: 'rootDiv',
        page: 'page'
      },
      category: {
        webUrl : '',
        form: {
          modal: false,
          action: 'add',
          labels: {
            title: '标题',
            url: '链接',
            xpath: '抓取路径'
          },
          items: {
            title: '',
            url: '',
            xpath: ''
          },
          rules: {
            title: [
              {required: true, message: '请输入标题', trigger: 'blur'}
            ],
            url: [
              {required: true, message: '请输入链接', trigger: 'blur'}
            ],
            xpath: [
              {required: true, message: '请输入抓取路径', trigger: 'blur'}
            ]
          },
          extraParams: {}
        },
        add: {
          url: '/crawler/addCategory'
        },
        modify: {
          url: '/crawler/modifyCategory'
        },
        del: {
          modal: false,
          url: '/crawler/deleteCategory',
          msg: null,
          params: null
        },
      },
      columns: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 100
        },
        {
          title: '标题',
          key: 'title',
          render: (h, params) => {
            let self = this
            return h('a', {
              on: {
                click: function () {
                  let component = {
                    name: 'CrawlerShowNews',
                    desc: '新闻列表[' + params.row.title + ']',
                    show: true,
                    new: true,
                    params: {
                      categoryUrl: params.row.url
                    }
                  }
                  self.$store.dispatch('addComponent', component)
                }
              }
            }, params.row.title)
          }
        },
        {
          title: '网址链接',
          key: 'url'
        },
        {
          title: '抓取路径:xpath',
          key: 'xpath'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            let self = this
            let modify = h('Button', {
              attrs: {
                type: 'primary',
                size: 'small',
                style: 'margin-right: 2em;'
              },
              on: {
                click: function () {
                  self.category.form.modal = true
                  self.category.form.action = 'modify'
                  self.category.form.items.title = params.row.title
                  self.category.form.items.url = params.row.url
                  self.category.form.items.xpath = params.row.xpath
                  self.category.form.extraParams = {
                    id: params.row.id,
                    webUrl: self.category.webUrl
                  }
                }
              }
            }, '修改')
            let del = h('Button', {
              attrs: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: function () {
                  self.category.del.modal = true
                  self.category.del.msg = '分类标题：' + params.row.title
                  self.category.del.params = {
                    categoryId: params.row.id
                  }
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
    divStyle: function () {
      return {
        height: (this.$store.getters.tabs.height - 48) + 'px'
      }
    }
  },
  methods: {
    init: function () {
      let self = this
      let params = {'userId': this.$store.getters.userInfo.id}
      ajaxUtil.ajax(self.findWebsUrl, params).done(function (response) {
        self.page = response.content
      })
    },
    pageChange (page) {
      this.pageNumber = page - 1
      this.init()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.init()
    },
    category_del_cancel: function () {
      this.init()
    },
    computeCollapseStyle (keys) {
      if (keys.length !== 0) {
        this.category.webUrl = this.page.content[keys[0]].url
        let divHeight = this.$refs[this.ref.rootDiv].clientHeight
        let pageHeight = this.$refs[this.ref.page].$el.clientHeight
        let contentHeight = divHeight - pageHeight
        contentHeight = (contentHeight - 16) + 'px'
        this.collapseStyle = {
          overflowY: 'scroll',
          height: contentHeight
        }
      } else {
        this.collapseStyle = {}
      }
    },
    category_handleSubmit (name) {
      let self = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          self.handleForm(self.category)
        }
      })
    },
    category_handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleForm (src) {
      let url = null
      let msgSuccess = null
      let msgFail = null
      if (src.form.action == 'add') {
        url = src.add.url
        msgSuccess = '新增记录成功'
        msgFail = '新增记录失败，原因:'
      } else if (src.form.action == 'modify') {
        url = src.modify.url
        msgSuccess = '修改记录成功'
        msgFail = '修改记录失败，原因:'
      }
      let params = src.form.items
      params = Object.assign(params, src.form.extraParams);
      let self = this
      ajaxUtil.ajax(url,params).done(function (response) {
        if (response.errorCode === '0000') {
          self.$Message.success(msgSuccess);
          src.form.modal = false
          self.reload()
        } else {
          self.$Message.error(msgFail + response.errorMsg);
        }
      }).fail(function (response) {
        self.$Message.info('网络异常:' + response.responseJSON.message);
      })
    },
    reload () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // this.computeContentHeight()
  },
  watch: {
    'params': function () {
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
