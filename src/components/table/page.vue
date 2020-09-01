<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="divStyle">
    <slot :name="slot.buttons"></slot>
    <Divider style="margin: 0px"></Divider>
    <Table :border="true"
           :columns="columns"
           :data="page.content"
           :show-header="showHeader"
           :stripe="stripe"
           :highlight-row="highlightRow"
           :ref="ref.table"
           :height="tableHeight"
           :style="{border: 'none'}"
           :size="size">
    </Table>
    <Page :total='page.totalElements'
          :ref="ref.page"
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
        type: Object,
        default: () => {
          return {}
        }
      },
      showHeader: {type: Boolean, default: true},
      stripe: {type: Boolean, default: true},
      highlightRow: {type: Boolean, default: true},
      size: {
        type: String, default: 'small', validator: function (value) {
          // 这个值必须匹配下列字符串中的一个
          return ['small', 'default', 'large'].indexOf(value) !== -1
        }
      }
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
        contentHeight: this.$store.getters.tabs.contentHeight,
        tableHeight: null
      }
    },
    computed: {
      divStyle () {
        return {
          height: this.contentHeight + 'px'
        }
      }
    },
    methods: {
      init: function () {
        let params = {}
        if (this.extraParams) {
          params = Object.assign(params, this.extraParams)
        }
        if (this.$attrs.params) {
          params = Object.assign(params, this.$attrs.params)
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
        let divHeight = this.contentHeight
        let pageHeight = this.$refs[this.ref.page].$el.clientHeight
        let buttonSlots = this.$slots[this.slot.buttons]
        let contentHeight = 0
        if (buttonSlots) {
          let slotHeight = this.$slots[this.slot.buttons][0].elm.clientHeight
          contentHeight = divHeight - pageHeight - slotHeight - 16
        } else {
          contentHeight = divHeight - pageHeight - 16
        }
        this.tableHeight = contentHeight
      },
      reload () {
        this.init()
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.computeTableHeight()
    },
    watch: {
      '$attrs.params': function () {
        let components = this.$store.getters.tabs.components
        let active = this.$store.getters.tabs.active
        let activeComponent = {}
        for (let i = 0; i < components.length; i++) {
          if (components[i].name === active) {
            activeComponent = components[i]
            break
          }
        }
        /*
        组件是新加入tab区的，并且TablePage组件的父组件与当前组件名相同
        防止tab区存在其他使用TablePage组件的页面，因为新增的页面重复刷新数据
        */
        if (activeComponent.new && this.$options.parent.$options._componentTag === activeComponent.name) {
          this.pageNumber = 0
          this.pageSize = 10
          this.init()
        }
      }
    }
  }
</script>

<style scoped>

</style>
