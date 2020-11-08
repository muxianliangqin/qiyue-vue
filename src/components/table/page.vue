<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="{height: contentHeight + 'px'}">
    <slot :name="slot.buttons"></slot>
    <Divider style="margin: 0"></Divider>
    <Table :border="true"
           :columns="tableColumns"
           :data="page.content"
           :show-header="showHeader"
           :stripe="stripe"
           :highlight-row="highlightRow"
           :ref="ref.table"
           :max-height="tableHeight"
           :style="{border: 'none'}"
           :size="size">
    </Table>
    <Page :total='page.totalElements'
          :ref="ref.page"
          :page-size-opts="[10, 20, 50, 100]"
          show-total
          show-sizer
          class="self-page"
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'page',
  props: {
    url: String,
    columns: Array,
    /*自定义参数，默认由this.$attrs.params传递参数，若extraParams存在则优先使用*/
    extraParams: {
      type: Object | String | Number | Array
    },
    showHeader: {type: Boolean, default: true},
    stripe: {type: Boolean, default: true},
    highlightRow: {type: Boolean, default: true},
    size: {
      type: String, default: 'small', validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['small', 'default', 'large'].indexOf(value) !== -1
      }
    },
    // 自定义table的列是否展示及顺序，数组为columns的下标，如[0,2,1,4]表示按顺序显示第1、3、2、4列
    customColumns: {type: Array, default: undefined}
  },
  data () {
    return {
      pageNumber: 0,
      pageSize: 10,
      page: {},
      ref: {
        rootDiv: 'rootDiv',
        table: 'table',
        page: 'page'
      },
      slot: {
        buttons: 'buttons'
      },
      tableHeight: 0,
      tableColumns: [],
      tableExtraParams: this.extraParams
    }
  },
  computed: {
    contentHeight () {
      return this.$store.getters.tabs.contentHeight
    },
    // tableHeight () {
    //   return this.computeTableHeight()
    // }
  },
  methods: {
    init () {
      this.getResponse()
    },
    getResponse () {
      let params = {}
      if (this.$attrs.params) {
        params = Object.assign(params, this.$attrs.params)
      }
      if (this.tableExtraParams) {
        if (this.tableExtraParams instanceof Object) {
          params = Object.assign(params, this.tableExtraParams)
        } else {
          params = this.tableExtraParams
        }
      }
      const page = {}
      if (!params.page) {
        page.page = this.pageNumber
      }
      if (!params.size) {
        page.size = this.pageSize
      }
      // 默认更新时间倒叙排序
      page.orders = ['updateTime,desc']
      this.$http.post(this.url, {
        params: params,
        page: page
      }).then((response) => {
        // 第一层的content是Response的content
        // 第二层的content是Page的content
        this.page = response.content
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
    /**
     * 计算table区域的高度
     */
    computeTableHeight () {
      let divHeight = this.$store.getters.tabs.contentHeight
      let pageHeight = 0
      if (this.$refs[this.ref.page]) {
        pageHeight = this.$refs[this.ref.page].$el.clientHeight
      }
      let buttonSlots = this.$slots[this.slot.buttons]
      let contentHeight = 0
      if (buttonSlots && this.$slots[this.slot.buttons][0].elm) {
        let slotHeight = this.$slots[this.slot.buttons][0].elm.clientHeight
        contentHeight = divHeight - pageHeight - slotHeight - 16
      } else {
        contentHeight = divHeight - pageHeight - 16
      }
      return contentHeight
    },
    computeCustomColumns () {
      if (!this.customColumns) {
        this.tableColumns = this.columns
        return
      }
      const columns = []
      for (let i = 0; i < this.customColumns.length; i++) {
        columns[i] = this.columns[this.customColumns[i]]
      }
      this.tableColumns = columns
    },
    reload () {
      this.init()
    },
    reset () {
      this.tableExtraParams = {}
    }
  },
  created () {
    this.computeCustomColumns()
    this.init()
  },
  mounted () {
    this.tableHeight = this.computeTableHeight()
  },
}
</script>

<style scoped>
.self-page {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
