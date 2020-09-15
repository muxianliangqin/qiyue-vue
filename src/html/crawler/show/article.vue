<template>
  <div>
    <TablePage :url="url.findBySpecification"
               :columns="columns"
               :ref="ref.tablePage"
               v-bind="$attrs"
               v-on="$listeners">
    </TablePage>
    <!-- 新闻正文 -->
    <Modal v-model="modal.text.show" :footer-hide="true" :width="modalWidth">
      <p slot="header" style="text-align:center;">
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
        <div v-if="modal.attachment.hasAttachment">
          <Row v-for="(item, index) in modal.attachment.content" :key="item.id">
            <Col span="4">附件: {{index + 1}}</Col>
            <Col span="20" style="text-align: left">
              <a @click="download(item)">{{ item.name }}</a>
            </Col>
          </Row>
        </div>
        <div v-else>
          <span>{{ modal.attachment.placeholder }}</span>
        </div>
      </div>
    </Modal>
  </div>

</template>

<script>
  export default {
    name: 'news',
    data () {
      return {
        url: {
          findBySpecification: '/crawler/article/findBySpecification',
          download: '/crawler/file/download'
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
            hasAttachment: false,
            placeholder: '',
            content: [],
          },
        },
        columns: [
          {title: '序号', type: 'index', width: 70, align: 'center'},
          {
            title: '标题', key: 'title',
            render: (h, params) => {
              return h('a', {
                attrs: {
                  href: params.row.url,
                  target: '_blank'
                },
                on: {
                  click () {
                    let param = {
                      newsId: params.row.id
                    }
                    this.$http.post(this.url.hasRead, param).then((response) => {
                      this.reload()
                    })
                  }
                }
              }, params.row.title)
            }
          },
          {
            title: '获取正文', align: 'center', width: 150,
            render: (h, params) => {
              let msg = '失败'
              if (params.row.crawledContent === 1) {
                msg = '成功'
              }
              return h('span', msg)
            }
          },
          {
            title: '获取附件', align: 'center', width: 150,
            render: (h, params) => {
              let msg = '失败'
              if (params.row.crawledAttachment === 1) {
                msg = '成功'
              }
              return h('span', msg)
            }
          },
          {
            title: '操作', align: 'center', width: 150,
            render: (h, params) => {
              let text = h('a', {
                style: {
                  marginLeft: '8px',
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.modal.text.show = true
                    this.modal.text.title = params.row.title
                    this.modal.text.content = params.row.text
                  }
                }
              }, '正文')
              let attachment = h('a', {
                style: {
                  marginLeft: '8px',
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.modal.attachment.show = true
                    this.modal.attachment.title = params.row.title
                    const attachmentStr = params.row.attachments
                    if (attachmentStr) {
                      this.modal.attachment.hasAttachment = true
                      this.modal.attachment.content = JSON.parse(attachmentStr)
                    } else {
                      this.modal.attachment.hasAttachment = false
                      this.modal.attachment.placeholder = '公文无附件'
                    }
                  }
                }
              }, '附件')
              return [text, attachment]
            }
          }
        ]
      }
    },
    computed: {
      modalWidth () {
        let clientWidth = document.documentElement.clientWidth
        return clientWidth * 0.7
      }
    },
    methods: {
      download (item) {
        this.$http.download(this.url.download, item.fileId, item.name)
      },
      reload () {
        this.$refs[this.ref.tablePage].reload()
      }
    }
  }
</script>

<style scoped>

</style>
