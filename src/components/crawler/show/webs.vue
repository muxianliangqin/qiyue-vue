<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="divStyle">
    <!--展示区-->
    <div class="self-buttons" :ref="ref.buttons">
      <Button type="primary" size='small'
              style="margin-right: 45px" @click="web_add">
        新增网站
      </Button>
      <Divider style="margin: 4px 0px 0px 0px"></Divider>
    </div>
    <div :style="collapseStyle">
      <Collapse v-model="unfold"
                :ref="ref.collapse"
                accordion
                @on-change="collapseChange"
                v-for="(web, index) of page.content">
        <Panel style="text-align: left;"
               :name="panelNamePrefix + index"
               :ref="panelNamePrefix + index"
               :key="web.url">
          <span>{{web.title}}</span>
          <span style="position: absolute;left: 35%;">
            {{web.url}}
          </span>
          <div>
            <Button type="primary"
                    @click.stop="web_modify(web)"
                    size='small'
                    style="right: 150px"
                    class="self-button">修改</Button>
            <Button type="primary"
                    @click.stop="web_del(web)"
                    size='small'
                    style="right: 100px"
                    class="self-button">删除</Button>
            <Button type="primary"
                    @click.stop="category_add(web.id)"
                    size='small'
                    style="right: 25px"
                    class="self-button">新增分类</Button>
          </div>
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
      </Collapse>
    </div>
    <!--展示区-->
    <!--网站处理区-->
    <Modal v-model="web.form.modal">
      <p slot="header" style="text-align:center">
        <template v-if="web.form.action === 'add'">
          <Icon type="md-add-circle" />
          <span>新增记录</span>
        </template>
        <template v-if="web.form.action === 'modify'">
          <Icon type="md-analytics" />
          <span>修改记录</span>
        </template>
      </p>
      <Form ref="web" :model="web.form.items" :rules="web.form.rules" :label-width="150">
        <Input type="text" style="display: none;" v-model="web.form.items.userId"></Input>
        <FormItem :label="web.form.labels.title" prop="title">
          <Row>
            <Col span="15">
              <Input type="text" clearable v-model="web.form.items.title"
                     :placeholder="web.form.labels.title"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="web.form.labels.url" prop="url">
          <Row>
            <Col span="15">
              <Input type="text" clearable v-model="web.form.items.url"
                     :placeholder="web.form.labels.url"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label-width="0" style="text-align: center;margin-bottom: 0px;">
          <Button type="primary" @click="handleSubmit('web')">提交</Button>
          <Button @click="handleReset('web')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div slot="footer" style="display: none">
      </div>
    </Modal>
    <SelfModalDel v-model="web.del.modal"
                  :url="web.del.url"
                  :params="web.del.params"
                  @self-cancel="del_cancel">
      <div slot="msg" style="text-align: center">
        <p>{{web.del.msg}}</p>
      </div>
    </SelfModalDel>
    <!--网站处理区-->
    <!--分类处理区-->
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
      <Form ref="category" :model="category.form.items" :rules="category.form.rules" :label-width="150">
        <Input type="text" style="display: none" v-model="category.form.items.webId"></Input>
        <FormItem :label="category.form.labels.title" prop="title">
          <Row>
            <Col span="15">
              <Input type="text" clearable v-model="category.form.items.title"
                     :placeholder="category.form.labels.title"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="category.form.labels.url" prop="url">
          <Row>
            <Col span="15">
              <Input type="text" clearable v-model="category.form.items.url"
                     :placeholder="category.form.labels.url"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="category.form.labels.xpath" prop="xpath">
          <Row>
            <Col span="15">
              <Input type="text" clearable v-model="category.form.items.xpath"
                     :placeholder="category.form.labels.xpath"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label-width="0" style="text-align: center;margin-bottom: 0px;">
          <Button type="primary" @click="handleSubmit('category')">提交</Button>
          <Button @click="handleReset('category')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div slot="footer" style="display: none">
      </div>
    </Modal>
    <SelfModalDel v-model="category.del.modal"
                  :url="category.del.url"
                  :params="category.del.params"
                  @self-cancel="del_cancel">
      <div slot="msg" style="text-align: center">
        <p>{{category.del.msg}}</p>
      </div>
    </SelfModalDel>
    <!--分类处理区-->
    <!--分页区-->
    <Page :total='page.totalElements'
          :ref="ref.page"
          class="self-page"
          show-sizer
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"/>
    <!--分页区-->
  </div>
</template>
<script>
import ajaxUtil from '@/assets/util/ajaxUtil'
export default {
  props: ['params'],
  data () {
    return {
      unfold: 'p_0',
      panelNamePrefix: 'p_',
      findWebsUrl: '/crawler/findWebs',
      pageNumber: 0,
      pageSize: 10,
      page: {},
      collapseStyle: {},
      ref: {
        rootDiv: 'rootDiv',
        page: 'page',
        buttons: 'buttons',
        collapse: 'collapse'
      },
      web: {
        form: {
          modal: false,
          action: 'add',
          labels: {
            url: '网站链接',
            title: '网站标题'
          },
          items: {
            userId: this.$store.getters.userInfo.id,
            url: '',
            title: ''
          },
          rules: {
            url: [
              {required: true, message: '请输入链接', trigger: 'blur'}
            ],
            title: [
              {required: true, message: '请输入标题', trigger: 'blur'}
            ]
          },
          extraParams: {}
        },
        add: {
          url: '/crawler/addWeb'
        },
        modify: {
          url: '/crawler/modifyWeb'
        },
        del: {
          modal: false,
          url: '/crawler/deleteWeb',
          msg: '',
          params: null
        },
      },
      category: {
        form: {
          modal: false,
          action: 'add',
          labels: {
            webId: '网站ID',
            title: '分类标题',
            url: '分类链接',
            xpath: '抓取路径'
          },
          items: {
            webId: 0,
            title: '',
            url: '',
            xpath: ''
          },
          rules: {
            webId: [
              {required: true}
            ],
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
          msg: '',
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
            let self = this;
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
                  };
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
            let self = this;
            let modify = h('a', {
              attrs: {
                style: 'margin-right: 2em;'
              },
              on: {
                click: function () {
                  self.category.form.modal = true;
                  self.category.form.action = 'modify';
                  self.category.form.items.webId = params.row.webId;
                  self.category.form.items.title = params.row.title;
                  self.category.form.items.url = params.row.url;
                  self.category.form.items.xpath = params.row.xpath;
                  self.category.form.extraParams = {
                    id: params.row.id,
                  }
                }
              }
            }, '修改');
            let del = h('a', {
              on: {
                click: function () {
                  self.category.del.modal = true;
                  self.category.del.msg = '分类标题：' + params.row.title;
                  self.category.del.params = {
                    categoryId: params.row.id
                  }
                }
              }
            }, '删除');
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
      let self = this;
      let params = {'userId': this.$store.getters.userInfo.id};
      ajaxUtil.ajax(self.findWebsUrl, params).done(function (response) {
        self.page = response.content
      })
    },
    pageChange (page) {
      this.pageNumber = page - 1;
      this.init()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.init()
    },
    del_cancel: function () {
      this.init()
    },
    collapseChange (keys) {
      if (keys.length !== 0) {
        // 因为使用 accordion 模式，keys长度只会为 1
        let index = keys[0].slice(this.panelNamePrefix.length);
        this.category.webUrl = this.page.content[index].url
      }
    },
    web_add () {
      this.web.form.modal = true;
      this.web.form.action = 'add';
      this.$refs['web'].resetFields();
    },
    web_modify (web) {
      this.web.form.modal = true
      this.web.form.action = 'modify';
      this.web.form.items.url = web.url
      this.web.form.items.title = web.title
      this.web.form.extraParams = {
        id: web.id
      }
    },
    web_del (web) {
      this.web.del.modal = true;
      this.web.del.msg = '网站：' + web.title + '，其下所属的分类也会一并删除';
      this.web.del.params = {
        webId: web.id
      }
    },
    category_add (webId) {
      this.category.form.modal = true;
      this.category.form.action = 'add';
      this.category.form.items.webId = webId
      this.$refs['category'].resetFields();
    },
    handleSubmit (name) {
      let self = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          self.handleForm(self[name]);
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleForm (src) {
      let url = null;
      let msgSuccess = null;
      let msgFail = null;
      if (src.form.action === 'add') {
        url = src.add.url;
        msgSuccess = '新增记录成功';
        msgFail = '新增记录失败，原因:'
      } else if (src.form.action === 'modify') {
        url = src.modify.url;
        msgSuccess = '修改记录成功';
        msgFail = '修改记录失败，原因:';
      }
      let params = src.form.items;
      params = Object.assign(params, src.form.extraParams);
      let self = this;
      ajaxUtil.ajax(url,params).done(function (response) {
        if (response.errorCode === '0000') {
          self.$Message.success(msgSuccess);
          src.form.modal = false;
          self.reload();
        } else {
          self.$Message.error(msgFail + response.errorMsg);
        }
      }).fail(function (response) {
        self.$Message.info('网络异常:' + response.responseJSON.message);
      })
    },
    computeCollapseStyle () {
      let divHeight = this.$refs[this.ref.rootDiv].clientHeight;
      let buttonsHeight = this.$refs[this.ref.buttons].clientHeight;
      let pageHeight = this.$refs[this.ref.page].$el.clientHeight;
      let contentHeight = divHeight - pageHeight - buttonsHeight;
      contentHeight = (contentHeight - 16) + 'px';
      this.collapseStyle = {
        overflowY: 'auto',
        height: contentHeight,
        border: '1px solid #e8eaec'
      }
    },
    reload () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.computeCollapseStyle()
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
