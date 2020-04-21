<template>
  <div>
    <Table :border="true"
           :columns="columns"
           :data="getData"
           :show-header="true"
           :stripe="true"
           :highlight-row="true"
           :style="{border: 'none'}"
           size="small">
    </Table>
    <ModalForm v-model="modalForm.modal"
               :url="modalForm.url"
               :title="modalForm.title"
               :fields="modalForm.fields"
               :extraParams="modalForm.extraParams"
               fieldSelectValue="id"
               fieldSelectLabel="title">
    </ModalForm>
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
          keywordFindAll: '/crawler/regexp/keywordFindAll',
          keywordWebSet: '/crawler/regexp/keywordWebSet',
          crawlerTest: '/python/crawler/test'
        },
        keywords: [],
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
        modalForm: {
          modal: false,
          title: '网站搜索关键字设置',
          url: '',
          fields: [
            {
              key: 'keywords', value: [], label: '匹配关键字', type: 'select',
              select: {
                value: 'id', label: 'name', multiple: true,
                data: []
              },
              rule: [
                {required: true, message: '请选择匹配关键字', trigger: 'blur', type: 'array'}
              ]
            },
            {
              key: 'categories', value: [], label: '网站分类', type: 'select',
              select: {
                value: 'id', label: 'title', multiple: true,
                data: this.row.categories
              },
              rule: [
                {required: true, message: '请选择匹配网站分类', trigger: 'blur', type: 'array'}
              ]
            }
          ],
          extraParams: {}
        },
        columns: [
          {type: 'index', title: '序号', align: 'center', width: 70},
          {
            title: '标题', key: 'title',
            render: (h, params) => {
              let a = h('a', {
                on: {
                  click: () => {
                    let component = {
                      name: 'CrawlerShowNews',
                      desc: '新闻列表[' + params.row.title + ']',
                      show: true,
                      new: true,
                      params: {
                        categoryId: params.row.id
                      }
                    }
                    this.$store.dispatch('addComponent', component).then(() => {
                      this.$emit('read', params.row)
                    })
                  }
                }
              }, params.row.title)
              let badge = h('Badge', {
                attrs: {
                  count: params.row.newNum,
                  type: 'success'
                },
                style: {
                  marginLeft: '8px'
                }
              })
              return [a, badge]
            }
          },
          {title: '网址链接', key: 'url'},
          {title: '标题路径', key: 'xpathTitle'},
          {title: '正文路径', key: 'xpathText'},
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
                    this.modal.category_title = params.row.title
                    let data = {
                      'id': params.row.id
                    }
                    this.$http.postE(this.url.crawlerTest, data, this,
                      (response) => {
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
                    this.$emit('modify', params.row)
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
                    this.$emit('del', params.row)
                  }
                }
              }, '删除')
              return [test, modify, del]
            }
          },
          {
            title: '关键字设置', width: 150, align: 'center',
            render: (h, params) => {
              let view = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {

                  }
                }
              }, '查看')
              let modify = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {
                    let keyword = this.modalForm.fields[0]
                    keyword.select.data = this.keywords
                    this.modalForm.fields.splice(0, 1, keyword)
                    this.modalForm.modal = true
                    this.modalForm.url = this.url.keywordWebSet
                    this.modalForm.title = '网站搜索关键字设置'
                    this.modalForm.extraParams = {webId: this.row.id}
                  }
                }
              }, '设置')
              return [view, modify]
            }
          },
        ]
      }
    },
    computed: {
      getData () {
        return this.row.categories
      },
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
      keywordFindAll () {
        this.$http.get(this.url.keywordFindAll, (response) => {
          this.keywords = response.content
        })
      }
    },
    mounted () {
      this.keywordFindAll()
    }
  }
</script>

<style scoped>

</style>
