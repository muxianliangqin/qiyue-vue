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
      <!--<Collapse v-model="unfold"
                :ref="ref.collapse"
                accordion
                @on-change="collapseChange"
                :key="index"
                v-for="(web, index) of page.content">
        <Panel style="text-align: left;"
               :name="panelNamePrefix + index"
               :ref="panelNamePrefix + index"
               :key="web.url">
          <span>{{web.title}}</span>
          <Badge :count="webNewNum(web)" type="success" style="margin-left: 8px"></Badge>
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
                   style="border:none"
                   size="small">
            </Table>
          </div>
        </Panel>
      </Collapse>-->
      <TablePage :url="url.web.query"
                 :columns="web.columns"
                 :stripe="false"
                 :ref="ref.TablePage"
                 :extraParams="extraParams">
      </TablePage>
      <ModalForm v-model="web.form.modal"
                 :url="web.form.url"
                 :fields="web.form.fields"
                 fieldLabel="title"
                 :title="web.form.title"
                 :extraParams="web.form.extraParams"
                 :footerHide="true"
                 :span="24"
                 @modal-ok="reload">
      </ModalForm>
    </div>
    <!--展示区-->
    <!--网站处理区-->
    <!--<ModalForm v-model="web.form.modal"
                   :title="web.form.title"
                   :url="web.form.url"
                   :items="web.form.items"
                   :rules="web.form.rules"
                   :extraParams="web.form.extraParams"
                   @self-done="reload">
      <div slot="fields">
        <Input type="text" style="display: none;" v-model="web.form.items.userId"></Input>
        <FormItem :label="web.form.labels.title" prop="title">
          <Row>
            <Col span="20">
              <Input type="text" clearable v-model="web.form.items.title"
                     :placeholder="web.form.labels.title"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="web.form.labels.url" prop="url">
          <Row>
            <Col span="20">
              <Input type="text" clearable v-model="web.form.items.url"
                     :placeholder="web.form.labels.url"></Input>
            </Col>
          </Row>
        </FormItem>
      </div>
    </ModalForm>-->
    <ModalState v-model="web.del.modal"
                  :url="web.del.url"
                  :params="web.del.params"
                  @self-done="reload">
      <div slot="msg" style="text-align: center">
        <p>{{web.del.msg}}</p>
      </div>
    </ModalState>
    <!--网站处理区-->
    <!--分类处理区-->
    <ModalForm v-model="category.form.modal"
                   :title="category.form.title"
                   :url="category.form.url"
                   :items="category.form.items"
                   :rules="category.form.rules"
                   :extraParams="category.form.extraParams"
                   @self-done="reload">
      <div slot="fields">
        <Input type="text" style="display: none" v-model="category.form.items.webId"></Input>
        <FormItem :label="category.form.labels.title" prop="title">
          <Row>
            <Col span="20">
              <Input type="text" clearable v-model="category.form.items.title"
                     :placeholder="category.form.labels.title"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="category.form.labels.url" prop="url">
          <Row>
            <Col span="20">
              <Input type="text" clearable v-model="category.form.items.url"
                     :placeholder="category.form.labels.url"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="category.form.labels.xpathTitle" prop="xpath">
          <Row>
            <Col span="20">
              <Input type="text" clearable v-model="category.form.items.xpathTitle"
                     :placeholder="category.form.labels.xpathTitle"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="category.form.labels.xpathText" prop="xpath">
          <Row>
            <Col span="20">
              <Input type="text" clearable v-model="category.form.items.xpathText"
                     :placeholder="category.form.labels.xpathText"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="category.form.labels.charset" prop="xpath">
          <Row>
            <Col span="20">
              <Input type="text" clearable v-model="category.form.items.charset"
                     :placeholder="category.form.labels.charset"></Input>
            </Col>
          </Row>
        </FormItem>
      </div>
    </ModalForm>
    <ModalState v-model="category.del.modal"
                  :url="category.del.url"
                  :params="category.del.params"
                  @self-done="reload">
      <div slot="msg" style="text-align: center">
        <p>{{category.del.msg}}</p>
      </div>
    </ModalState>
    <!--分类处理区-->
    <!--分页区-->
    <!--<TablePage :total='page.totalElements'-->
          <!--:ref="ref.TablePage"-->
          <!--class="self-page"-->
          <!--show-sizer-->
          <!--@on-change="pageChange"-->
          <!--@on-page-size-change="pageSizeChange"/>-->
    <!--分页区-->
  </div>
</template>
<script>
export default {
  props: ['params'],
  data () {
    return {
      url: {
        web: {
          query: '/crawler/findWebs',
          add: '/crawler/addWeb',
          modify: '/crawler/modifyWeb',
          del: '/crawler/deleteWeb',
          hasRead: '/crawler/categoryHasRead',
        },
        category: {
          add: '/crawler/addCategory',
          modify: '/crawler/modifyCategory',
          del: '/crawler/deleteCategory'
        }
      },
      unfold: 'p_0',
      panelNamePrefix: 'p_',
      pageNumber: 0,
      pageSize: 10,
      page: {},
      collapseStyle: {},
      ref: {
        rootDiv: 'rootDiv',
        TablePage: 'page',
        buttons: 'buttons',
        collapse: 'collapse'
      },
      web: {
        columns: [
          {type: 'expand', width: 50, render: (h, params) => {
              return h('CrawlerShowWebsExpand', {
                props: {
                  row: params.row
                },
                style: {
                  marginTop: '5px',
                  marginBottom: '5px',
                }
              })
            }
          },
          {type: 'index', title: '序号', align: 'center', width: 70},
          {title: '网站名称', key: 'title'},
          {title: '网站链接', key: 'url'},
          {title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              let modify = h('a', {
                attrs: {
                  style: 'margin-right: 2em;'
                },
                on: {
                  click: () => {
                    this.web.form.modal = true;
                    this.web.form.title = '修改网站';
                    this.web.form.url = this.url.web.modify;
                    this.web.form.fields.forEach((v) => {v['value'] = params.row[v['key']]});
                    this.web.form.extraParams = {
                      id: params.row.id
                    };
                  }
                }
              }, '修改');
              let del = h('a', {
                on: {
                  click: () => {
                    this.category.del.modal = true;
                    this.category.del.url = this.url.web.del;
                    this.category.del.msg = '网站：' + params.row.title + '，其下所属的分类也会一并删除';
                    this.category.del.params = {
                      webId: params.row.id
                    }
                  }
                }
              }, '删除');
              return [modify, del]
            }
          }
        ],
        form: {
          modal: false,
          title: '',
          url: '',
          fields: [
            {title: '网站名称', key: 'title', value: ''},
            {title: '网站链接', key: 'url', value: ''},
          ],
          extraParams: {}
        },
        del: {
          modal: false,
          url: '',
          msg: '',
          params: null
        },
      },
      category: {
        form: {
          modal: false,
          title: '',
          url: '',
          labels: {
            webId: '网站ID',
            title: '分类标题',
            url: '分类链接',
            xpathTitle: '标题路径',
            xpathText: '正文路径',
            charset: '编码'
          },
          items: {
            webId: 0,
            title: '',
            url: '',
            xpathTitle: '',
            xpathText: '',
            charset: ''
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
            xpathTitle: [
              {required: true, message: '请输入标题路径', trigger: 'blur'}
            ],
            xpathText: [
              {required: true, message: '请输入正文路径', trigger: 'blur'}
            ],
            charset: [
              {required: true, message: '请输入编码', trigger: 'blur'}
            ]
          },
          extraParams: {}
        },
        del: {
          modal: false,
          url: '',
          msg: '',
          params: null
        },
      },
      extraParams: {},

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
      let menuLoan = this.params.menuLoanEntities;
      if (menuLoan.length === 0) {
        menuLoan = []
      } else {
        menuLoan = menuLoan.map(v => {return v.userId})
      }
      menuLoan.push(this.$store.getters.userInfo.id);
      let params = {
        userIds: menuLoan
      };
      this.extraParams = params
    },
    pageChange (page) {
      this.pageNumber = page - 1;
      this.init()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
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
      this.web.form.title = '新增网站';
      this.web.form.url = this.url.web.add;
      this.web.form.fields.forEach((v) => {v['value'] = ''});
      this.web.form.extraParams = {
        userId: this.$store.getters.userInfo.id
      }
    },
    category_add (webId) {
      this.category.form.modal = true;
      this.category.form.title = '新增分类';
      this.category.form.url = this.url.category.add;
      this.category.form.items.title = '';
      this.category.form.items.url = '';
      this.category.form.items.xpathTitle = '';
      this.category.form.items.xpathText = '';
      this.category.form.items.charset = '';
      this.category.form.extraParams = {
        webId: webId
      }
    },
    computeCollapseStyle () {
      let divHeight = this.$refs[this.ref.rootDiv].clientHeight;
      let buttonsHeight = this.$refs[this.ref.buttons].clientHeight;
      let pageHeight = this.$refs[this.ref.TablePage].$el.clientHeight;
      let contentHeight = divHeight - pageHeight - buttonsHeight;
      contentHeight = (contentHeight - 16) + 'px';
      this.collapseStyle = {
        overflowY: 'auto',
        height: contentHeight,
        border: '1px solid #e8eaec'
      }
    },
    webNewNum (web) {
      let num = 0;
        web.categories.forEach((v) => {
          num += v.newNum;
        });
      return num;
    },
    reload () {
      this.$refs[this.ref.TablePage].reload()
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
      // this.init()
    }
  }
}
</script>

<style scoped>
  /deep/ td.ivu-table-expanded-cell {
    padding: 10px 5px 10px 25px
  }
</style>
