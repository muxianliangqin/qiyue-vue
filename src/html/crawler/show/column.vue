<template>
  <div>
    <Table :border="true"
           :columns="tablePage.columns"
           :data="tablePage.data"
           :show-header="true"
           :stripe="true"
           :highlight-row="true"
           :style="{border: 'none'}"
           size="small">
    </Table>
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
    <Modal v-model="modal.show"
           :footer-hide="true"
           :width="modal.width">
      <p slot="header" style="text-align:center">
        <Icon type="ios-barcode-outline"/>
        <span>{{ modal.title }}</span>
      </p>
      <div>
        <div>网站分类：{{getCategoryName}}</div>
        <divider/>
        <Table :border="true"
               :columns="modal.title_table.columns"
               :data="getTitleResult"
               v-if="modal.title_result"
               size="small"
        >
        </Table>
        <divider/>
        <span>抓取【{{getNews}}】正文结果</span>
        <divider/>
        <div>{{getText}}</div>
        <divider/>
        <Table :border="true"
               :columns="modal.attachment_table.columns"
               :data="getAttachments"
               v-if="modal.text_result"
               size="small"
        >
        </Table>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'webs_expand',
    props: {
      row: Object
    },
    data () {
      return {
        url: {
          findByWebId: '/crawler/column/findByWebId',
          column: {
            modify: '/crawler/column/modify',
            delete: '/crawler/column/delete'
          }
        },
        tablePage: {
          data: [],
          columns: [
            {type: 'index', title: '序号', align: 'center', width: 70},
            {
              title: '标题', key: 'title',
              render: (h, params) => {
                return h('a', {
                  on: {
                    click: () => {
                      this.toArticle(params)
                    }
                  }
                }, params.row.title)
              }
            },
            {title: '网址链接', key: 'url'},
            {title: '标题路径', key: 'xpathArticleTitle'},
            {title: '正文路径', key: 'xpathArticleContent'},
            {title: '编码', width: 100, align: 'center', key: 'charset'},
            {
              title: '操作', align: 'center', width: 200,
              render: (h, params) => {
                let test = h('a', {
                  style: {
                    marginRight: '8px',
                    marginLeft: '8px'
                  },
                  on: {
                    click: () => {
                      this.test(params)
                    }
                  }
                }, '测试')
                let modify = h('a', {
                  style: {
                    marginRight: '8px',
                    marginLeft: '8px'
                  },
                  on: {
                    click: () => {
                      this.modify(params)
                    }
                  }
                }, '修改')
                let del = h('a', {
                  style: {
                    marginRight: '8px',
                    marginLeft: '8px'
                  },
                  on: {
                    click: () => {
                      this.delete(params)
                    }
                  }
                }, '删除')
                return [test, modify, del]
              }
            },
          ]
        },
        modalForm: {
          modal: false,
          title: '',
          url: '',
          fields: {
            title: {label: '分类标题', value: ''},
            url: {label: '分类链接', value: ''},
            xpathArticleTitle: {label: '标题路径', value: ''},
            xpathArticleContent: {label: '正文路径', value: ''},
            charset: {label: '编码', value: ''},
          },
          extraParams: {}
        },
        modalState: {
          modal: false,
          url: '',
          msg: '',
          params: null
        },
        modal: {
          show: false,
          title: '抓取结果',
          category_title: '',
          width: 60,
          title_result: null,
          text_result: null,
          title_table: {
            columns: [
              {type: 'index', title: '序号', align: 'center', width: 70},
              {
                title: '标题',
                render: (h, params) => {
                  return h('a', {
                    attrs: {
                      href: params.row.url,
                      target: '_blank'
                    }
                  }, params.row.title)
                }
              }
            ]
          },
          attachment_table: {
            columns: [
              {type: 'index', title: '序号', align: 'center', width: 70},
              {
                title: '名称',
                render: (h, params) => {
                  return h('a', {
                    attrs: {
                      href: params.row.url,
                      target: '_blank'
                    }
                  }, params.row.name)
                }
              },
              {
                title: '是否下载成功',
                render: (h, params) => {
                  let msg = '下载失败'
                  if (params.row.too_small_flag) {
                    msg = '图片小于50k，不下载'
                  }
                  if (params.row.download_flag) {
                    msg = '下载成功'
                  }
                  return h('span', {}, msg)
                }
              },
              {title: '格式', key: 'format'}
            ]
          }
        },
      }
    },
    computed: {
      getCategoryName () {
        return this.modal.category_title
      },
      getTitleResult () {
        if (this.modal.title_result) {
          return this.modal.title_result.news
        }
      },
      getNews () {
        if (this.modal.text_result) {
          return this.modal.text_result.title
        }
      },
      getText () {
        if (this.modal.text_result) {
          return this.modal.text_result.text
        }
      },
      getAttachments () {
        if (this.modal.text_result) {
          return this.modal.text_result.attachments
        }
      }
    },
    methods: {
      init () {
        this.$http.post(this.url.findByWebId, this.row.webId).then((response) => {
          this.tablePage.data = response.content
        })
      },
      toArticle (params) {
        let component = {
          name: 'CrawlerShowArticle',
          desc: '新闻列表[' + params.row.title + ']',
          show: true,
          new: true,
          params: {
            columnId: params.row.columnId
          }
        }
        this.$store.dispatch('addComponent', component)
      },
      test (params) {
        this.modal.category_title = params.row.title
        let data = {
          'id': params.row.id
        }
        this.$http.post(this.url.crawlerTest, data).then((response) => {
          if (response.data) {
            this.modal.title_result = response.data
            this.modal.text_result = response.data['news'][0]
            this.modal.show = true
          } else {
            this.$Notice.error({
              title: '爬取网页失败',
              desc: `errorMsg: ${response.errorMsg}`
            })
          }
        })
      },
      modify (params) {
        this.modalForm.modal = true
        this.modalForm.title = '修改分类'
        this.modalForm.url = this.url.column.modify
        this.$utils.initModalFields(this.modalForm.fields, params.row)
        this.modalForm.extraParams = {
          columnId: params.row.columnId,
        }
      },
      delete (params) {
        this.modalState.modal = true
        this.modalState.url = this.url.column.delete
        this.modalState.msg = '分类标题：' + params.row.title
        this.modalState.params = params.row.columnId
      },
      reload () {
        this.init()
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style scoped>

</style>
