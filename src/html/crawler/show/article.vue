<template>
  <div>
    <TablePage :url="url.findBySpecification"
               :columns="tablePage.columns"
               :ref="ref.tablePage"
               :customColumns="tablePage.customColumns"
               :extraParams="tablePage.extraParams"
               :selectInputs="tablePage.selectInputs"
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
            <Col span="4">附件: {{ index + 1 }}</Col>
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
        download: '/crawler/file/download',
        findContent: '/crawler/content/findByContentId'
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
      tablePage: {
        columns: [
          {title: '序号', type: 'index', width: 70, align: 'center'},
          {
            title: '标题', key: 'title',
            render: (h, params) => {
              return h('a', {
                attrs: {
                  href: params.row.url,
                  target: '_blank'
                }
              }, params.row.title)
            }
          },
          {
            title: '获取正文', align: 'center', width: 150,
            render: (h, params) => {
              let msg = '失败'
              if (params.row['crawledContent'] === 1) {
                msg = '成功'
              }
              return h('span', msg)
            }
          },
          {
            title: '获取附件', align: 'center', width: 150,
            render: (h, params) => {
              let msg = '失败'
              if (params.row['crawledAttachment'] === 1) {
                msg = '成功'
              }
              return h('span', msg)
            }
          },
          {
            title: '正文和附件', align: 'center',
            render: (h, params) => {
              if (!params.row.contentId) {
                return h('span', '尚未获取到正文和附件')
              }
              let text = h('a', {
                style: {
                  marginLeft: '8px',
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.getContent(params.row)
                  }
                }
              }, '正文')
              if (!params.row['attachments']) {
                return text
              }
              let attachment = h('a', {
                style: {
                  marginLeft: '8px',
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.modal.attachment.show = true
                    this.modal.attachment.title = params.row.title
                    const attachmentStr = params.row['attachments']
                    if (attachmentStr) {
                      this.modal.attachment.hasAttachment = true
                      this.modal.attachment.content = JSON.parse(attachmentStr)
                    } else {
                      this.modal.attachment.hasAttachment = false
                      this.modal.attachment.placeholder = '此文章无附件'
                    }
                  }
                }
              }, '附件')
              return [text, attachment]
            }
          }
        ],
        // 自定义展示表格的列
        customColumns: [0, 1, 4],
        extraParams: {},
        // 搜索条件输入框
        selectInputs: {
          webId: {
            type: 'autoComplete', label: '网站标题', value: '',
            url: '/crawler/web/findByTitleLike', valueField: 'webId', labelField: 'title'
          },
          columnId: {
            type: 'autoComplete', label: '栏目标题', value: '',
            url: '/crawler/column/findByTitleLike', valueField: 'columnId', labelField: 'title'
          },
          title: {type: 'text', label: '文章标题', value: ''},
          haveText: {
            type: 'select', label: '是否有正文', value: '', options: [
              {value: '1', label: '有正文'},
              {value: '0', label: '无正文'}
            ]
          },
          haveAttachment: {
            type: 'select', label: '是否有附件', value: '', options: [
              {value: '1', label: '有附件'},
              {value: '0', label: '无附件'}
            ]
          }
        }
      }
    }
  },
  computed: {
    modalWidth () {
      let clientWidth = document.documentElement.clientWidth
      return clientWidth * 0.7
    }
  },
  methods: {
    getContent (row) {
      this.$http.post(this.url.findContent, row.contentId).then((response) => {
        let content = response.content
        if (content) {
          this.modal.text.show = true
          this.modal.text.title = row.title
          this.modal.text.content = content.text
        }
      })
    },
    download (item) {
      this.$http.download(this.url.download, item['fileId'], item.name)
    },
    reload () {
      this.$refs[this.ref.tablePage].reload()
    },
    reset () {
      this.$refs[this.ref.tablePage].reset()
    }
  }
}
</script>

<style scoped>

</style>
