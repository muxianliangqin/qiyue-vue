<template>
  <div>
    <TablePage :url="url.findNews"
               :columns="columns"
               :ref="ref.tablePage"
               v-bind="$attrs"
               v-on="$listeners">
    </TablePage>
    <!-- 新闻正文 -->
    <Modal v-model="modal.text.show" :footer-hide="true">
      <p slot="header" style="text-align:center">
        <Icon type="ios-barcode-outline"/>
        <span>{{ modal.text.title }}</span>
      </p>
      <p>{{ modal.text.content }}</p>
    </Modal>
    <!-- 新闻附件 -->
    <Modal v-model="modal.attachment.show" :footer-hide="true">
      <p slot="header" style="text-align:center">
        <Icon type="ios-barcode-outline"/>
        <span>{{ modal.attachment.title }}</span>
      </p>
      <div style="text-align: center">
        <div v-if="modal.attachment.content.length > 0">
          <Row v-for="(item, index) in modal.attachment.content" :key="item.id">
            <Col span="4">附件: {{index + 1}}</Col>
            <Col span="20" style="text-align: left">
              <!--<a :href="url.download + '?id=' + item.id" target="_blank">{{ item.name }}</a>-->
              <a @click="download(item)">{{ item.name }}</a>
            </Col>
          </Row>
        </div>
        <span v-else style="margin: 0 auto">没有附件</span>
      </div>
    </Modal>
    <!-- 新闻关键字 -->
    <Modal v-model="modal.keyword.show" :footer-hide="true">
      <p slot="header" style="text-align:center">
        <Icon type="ios-barcode-outline"/>
        <span>{{ modal.keyword.title }}</span>
      </p>
      <p>{{ modal.keyword.content }}</p>
    </Modal>
  </div>

</template>

<script>
  import baseUtil from '@/assets/util/baseUtil'
  export default {
    name: 'news',
    data () {
      return {
        url: {
          findNews: '/crawler/findNews',
          hasRead: '/crawler/newsHasRead',
          // download: "http://localhost:7000/crawler/file/download"
          download: "/crawler/file/download"
        },
        ref: {
          tablePage: 'tablePage'
        },
        modal: {
          text: {
            show: false,
            title: '',
            content: '',
          },
          attachment: {
            show: false,
            title: '',
            content: [],
          },
          keyword: {
            show: false,
            title: '',
            content: '',
          }
        },
        columns: [
          {title: '序号', type: 'index', width: 70, align: 'center'},
          {
            title: '标题', key: 'title',
            render: (h, params) => {
              let _this = this
              let a = h('a', {
                attrs: {
                  href: params.row.url,
                  target: '_blank'
                },
                on: {
                  click () {
                    let param = {
                      newsId: params.row.id
                    }
                    _this.$http.postE(_this.url.hasRead, param, _this, () => {
                      _this.reload()
                    })
                  }
                }
              }, params.row.title)
              let span = h('span', {
                style: {
                  marginLeft: '8px'
                }
              }, '未读')
              if (params.row.unread === '0') {
                return [a, span]
              } else {
                return [a]
              }
            }
          },
          {title: '获取正文', width: 100, align: 'center',
            render: (h, params) => {
              let msg = '失败'
              if (params.row.textState === '1') {
                msg = '成功'
              }
              return h('span', msg)
            }
          },
          {title: '获取附件', width: 100, align: 'center',
            render: (h, params) => {
              let msg = '失败'
              if (params.row.attachmentState === '1') {
                msg = '成功'
              }
              return h('span', msg)
            }
          },
          {
            title: '操作', width: 200, align: 'center',
            render: (h, params) => {
              // let text = h('a', {
              //   style: {
              //     marginLeft: '8px',
              //     marginRight: '8px'
              //   },
              //   on: {
              //     click: () => {
              //       this.modal.text.show = true
              //       this.modal.text.title = params.row.title
              //       this.modal.text.content = params.row.texts[0].text
              //     }
              //   }
              // }, '正文')
              let text = baseUtil.self_a(h, 'a', '正文', {
                style: {
                  marginLeft: '8px',
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.modal.text.show = true
                    this.modal.text.title = params.row.title
                    this.modal.text.content = params.row.texts[0].text
                  }
                }
              })
              let attachment = h('a', {
                style: {
                  marginLeft: '8px',
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.modal.attachment.show = true
                    this.modal.attachment.title = params.row.title
                    this.modal.attachment.content = params.row.attachments
                  }
                }
              }, '附件')
              let keyword = h('a', {
                style: {
                  marginLeft: '8px',
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.modal.keyword.show = true
                    this.modal.keyword.title = params.row.title
                    this.modal.keyword.content = params.row.matchResult
                  }
                }
              }, '匹配结果')
              return [text, attachment, keyword]
            }
          }
        ]
      }
    },
    methods: {
      download (item) {
        let data = {id: item.id}
        let fileName = item.name + '.' + item.format
        this.$http.download(this.url.download, data, fileName, this)
      },
      reload () {
        this.$refs[this.ref.tablePage].reload()
      }
    }
  }
</script>

<style scoped>

</style>
