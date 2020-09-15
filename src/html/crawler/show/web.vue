<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="divStyle">
    <TablePage :url="url.web.findByPage"
               :columns="tablePage.columns"
               :stripe="false"
               :ref="ref.TablePage"
               :extraParams="tablePage.extraParams">
      <div slot="buttons" style="float: right;margin-bottom: 8px">
        <Button type="primary" size='small' style="margin-right: 70px" @click="add">
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
            findByPage: '/crawler/web/findByPage',
            add: '/crawler/web/add',
            modify: '/crawler/web/modify',
            delete: '/crawler/web/delete',
          },
          column: {
            add: '/crawler/column/add',
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
            {
              type: 'expand', width: 50,
              render: (h, params) => {
                return h('CrawlerShowColumn', {
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
            {title: '网站名称', key: 'title', align: 'left'},
            {title: '网站链接', key: 'url'},
            {
              title: '操作', align: 'center', width: 200,
              render: (h, params) => {
                let add = h('a', {
                  attrs: {
                    style: 'margin: 10px;'
                  },
                  on: {
                    click: () => {
                      this.addColumn(params)
                    }
                  }
                }, '新增')
                let modify = h('a', {
                  attrs: {
                    style: 'margin: 10px;'
                  },
                  on: {
                    click: () => {
                      this.modify(params)
                    }
                  }
                }, '修改')
                let del = h('a', {
                  attrs: {
                    style: 'margin: 10px;'
                  },
                  on: {
                    click: () => {
                      this.delete(params)
                    }
                  }
                }, '删除')
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
          fields: {},
          extraParams: {}
        },
        web: {
          fields: {
            title: {label: '网站名称', value: ''},
            url: {label: '网站链接', value: ''},
          },
        },
        column: {
          fields: {
            title: {label: '分类标题', value: ''},
            url: {label: '分类链接', value: ''},
            xpathArticleTitle: {label: '标题路径', value: ''},
            xpathArticleContent: {label: '正文路径', value: ''},
            charset: {label: '编码', value: ''},
          },
        },
        modalState: {
          modal: false,
          url: '',
          msg: '',
          params: null
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
      add () {
        this.modalForm.modal = true
        this.modalForm.title = '新增网站'
        this.modalForm.url = this.url.web.add
        this.$utils.resetModalFields(this.web.fields, params.row)
        this.modalForm.fields = this.web.fields
        this.modalForm.extraParams = {
          userId: this.$store.getters.userInfo.id
        }
      },
      modify (params) {
        this.modalForm.modal = true
        this.modalForm.title = '修改网站'
        this.modalForm.url = this.url.web.modify
        this.$utils.initModalFields(this.web.fields, params.row)
        this.modalForm.fields = this.web.fields
        this.modalForm.extraParams = {
          webId: params.row.webId
        }
      },
      delete (params) {
        this.modalState.modal = true
        this.modalState.url = this.url.web.delete
        this.modalState.msg = '网站：' + params.row.title + '，其下所属的分类也会一并删除'
        this.modalState.params = params.row.webId
      },
      addColumn (params) {
        this.modalForm.modal = true
        this.modalForm.title = '新增分类'
        this.modalForm.url = this.url.column.add
        this.$utils.resetModalFields(this.column.fields)
        this.modalForm.fields = this.column.fields
        this.modalForm.extraParams = {
          webId: params.row.webId
        }
      },
      reload () {
        this.$refs[this.ref.TablePage].reload()
      }
    },
  }
</script>

<style scoped>
  /deep/ td.ivu-table-expanded-cell {
    padding: 10px 5px 10px 25px
  }
</style>
