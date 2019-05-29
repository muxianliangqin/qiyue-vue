<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="divStyle">
    <Collapse v-model="unfold"
              accordion
              @on-change="computeCollapseStyle"
              :style="collapseStyle">
      <template v-for="web of page.content">
        <Panel :name="web.url"
               style="text-align: left;"
               :key="web.url">
            <span>{{web.title}}
            </span>
          <Button type="primary"
                  @click=""
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
    <Modal
      v-model="modal.modify.show"
      @on-ok="modify_ok"
      @on-cancel="modify_cancel"
      title="修改网站设置">
      <Input v-model="modal.groupNickName" placeholder="请输入群组名"/>
    </Modal>
    <Modal
      v-model="modal.add.show"
      @on-ok="add_ok"
      @on-cancel="add_cancel"
      title="新增网站设置">
      <Input v-model="modal.groupNickName" placeholder="请输入群组名"/>
    </Modal>
    <Modal
      v-model="modal.del.show"
      @on-ok="del_ok"
      @on-cancel="del_cancel"
      title="删除网站设置">
      <Input v-model="modal.groupNickName" placeholder="请输入群组名"/>
    </Modal>
  </div>
</template>
<script>
import ajaxUtil from '@/assets/util/ajaxUtil'
export default {
  props: ['params'],
  data () {
    return {
      unfold: 'http://www.gd.gov.cn/',
      findWebsUrl: '/crawler/findWebs',
      pageNumber: 0,
      pageSize: 10,
      page: {},
      collapseStyle: {},
      ref: {
        rootDiv: 'rootDiv',
        page: 'page'
      },
      modal: {
        modify: {
          show: false
        },
        add: {
          show: false
        },
        del: {
          show: false
        }
      },
      columns: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 60
        },
        {
          title: '分类',
          key: 'title',
          width: 200,
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
          title: '网址',
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
                  self.modal.modify.show = true
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
                  self.modal.del.show = true
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
      // debugger
      ajaxUtil.ajax(self.findWebsUrl, params).done(function (response) {
        self.page = response
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
    modify_ok: function () {

    },
    modify_cancel: function () {
      self.modal.modify.show = false
    },
    add_ok: function () {

    },
    add_cancel: function () {
      self.modal.add.show = false
    },
    del_ok: function () {

    },
    del_cancel: function () {
      self.modal.del.show = false
    },
    computeCollapseStyle (keys) {
      if (keys.length !== 0) {
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
