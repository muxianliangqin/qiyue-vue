<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="divStyle">
    <TablePage :url="url.web.query"
               :columns="tablePage.columns"
               :stripe="false"
               :ref="ref.TablePage"
               :extraParams="tablePage.extraParams">
      <div slot="buttons" style="float: right;margin-bottom: 8px">
        <Button type="primary" size='small' style="margin-right: 70px" @click="web_add">
          新增网站
        </Button>
      </div>
    </TablePage>
    <ModalForm v-model="modalForm.modal"
               :url="modalForm.url"
               :fields="modalForm.fields"
               :title="modalForm.title"
               :extraParams="modalForm.extraParams"
               :footerHide="true"
               :span="24"
               @modal-ok="reload">
    </ModalForm>
    <ModalState v-model="modalState.modal"
                :url="modalState.url"
                :params="modalState.params"
                @modal-ok="reload">
      <div slot="msg" style="text-align: center">
        <p>{{modalState.msg}}</p>
      </div>
    </ModalState>
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
          hasRead: '/crawler/categoryHasRead'
        },
        category: {
          add: '/crawler/addCategory',
          modify: '/crawler/modifyCategory',
          del: '/crawler/deleteCategory'
        }
      },
      ref: {
        rootDiv: 'rootDiv',
        TablePage: 'page',
        buttons: 'buttons',
        collapse: 'collapse'
      },
      tablePage: {
        columns: [
          {type: 'expand', width: 50,
            render: (h, params) => {
              return h('CrawlerShowWebsExpand', {
                props: {
                  row: params.row
                },
                style: {
                  marginTop: '5px',
                  marginBottom: '5px',
                },
                on: {
                  modify: (row) => {
                    this.modalForm.modal = true;
                    this.modalForm.title = '修改分类';
                    this.modalForm.url = this.url.category.modify;
                    this.category.fields.forEach((v) => {v['value'] = row[v['key']]});
                    this.modalForm.fields = this.category.fields;
                    this.modalForm.extraParams = {
                      id: row.id,
                    };
                  },
                  del: (row) => {
                    this.modalState.modal = true;
                    this.modalState.url = this.url.category.del;
                    this.modalState.msg = '分类标题：' + row.title;
                    this.modalState.params = {
                      categoryId: row.id
                    }
                  },
                  read: (row) => {
                    let param = {
                      categoryId: row.id
                    };
                    this.$http.post(this.url.web.hasRead, param, (response) => {
                      if (response.errorCode === '0000') {
                        this.reload()
                      } else {
                        this.$Notice.error({
                          title: `操作失败,errorCode: ${response.errorCode}`,
                          desc: `errorMsg: ${response.errorMsg}`
                        });
                      }
                    })
                  }
                }
              })
            }
          },
          {type: 'index', title: '序号', align: 'center', width: 70},
          {title: '网站名称', key: 'title',
            render: (h, params) => {
              let span = h('span',{},'网站名称');
              let num = 0;
              params.row.categories.forEach((v) => {
                num += v.newNum;
              });
              let badge = h('Badge', {
                attrs: {
                  count: num,
                  type: 'success'
                },
                style:{
                  marginLeft: '8px'
                }
              });
              return [span, badge]
            }
          },
          {title: '网站链接', key: 'url'},
          {title: '操作', align: 'center', width: 200,
            render: (h, params) => {
              let add = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {
                    this.modalForm.modal = true;
                    this.modalForm.title = '新增分类';
                    this.modalForm.url = this.url.category.add;
                    this.category.fields.forEach((v) => {v['value'] = ''});
                    this.modalForm.fields = this.category.fields;
                    this.modalForm.extraParams = {
                      webId: params.row.id
                    };
                  }
                }
              }, '新增分类');
              let modify = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {
                    this.modalForm.modal = true;
                    this.modalForm.title = '修改网站';
                    this.modalForm.url = this.url.web.modify;
                    this.web.fields.forEach((v) => {v['value'] = params.row[v['key']]});
                    this.modalForm.fields = this.web.fields;
                    this.modalForm.extraParams = {
                      id: params.row.id
                    };
                  }
                }
              }, '修改');
              let del = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {
                    this.modalState.modal = true;
                    this.modalState.url = this.url.web.del;
                    this.modalState.msg = '网站：' + params.row.title + '，其下所属的分类也会一并删除';
                    this.modalState.params = {
                      webId: params.row.id
                    }
                  }
                }
              }, '删除');
              return [add, modify, del]
            }
          }
        ],
        extraParams: {}
      },
      modalForm: {
        modal: false,
        title: '',
        url: '',
        fields: [],
        extraParams: {}
      },
      modalState: {
        modal: false,
        url: '',
        msg: '',
        params: null
      },
      web: {
        fields: [
          {label: '网站名称', key: 'title', value: ''},
          {label: '网站链接', key: 'url', value: ''},
        ]
      },
      category: {
        fields: [
          {label: '分类标题', key: 'title', value: ''},
          {label: '分类链接', key: 'url', value: ''},
          {label: '标题路径', key: 'xpathTitle', value: ''},
          {label: '正文路径', key: 'xpathText', value: ''},
          {label: '编码', key: 'charset', value: ''},
        ],
      },
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
      this.tablePage.extraParams = params
    },
    web_add () {
      this.modalForm.modal = true;
      this.modalForm.title = '新增网站';
      this.modalForm.url = this.url.web.add;
      this.web.fields.forEach((v) => {v['value'] = ''});
      this.modalForm.fields = this.web.fields;
      this.modalForm.extraParams = {
        userId: this.$store.getters.userInfo.id
      };
    },
    reload () {
      this.$refs[this.ref.TablePage].reload()
    }
  },
  created () {
    this.init()
  },
  mounted () {
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
