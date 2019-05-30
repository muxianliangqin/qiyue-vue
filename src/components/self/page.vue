<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="divStyle">
    <Table :border="true"
           :columns="columns"
           :data="page.content"
           :show-header="true"
           :stripe="true"
           :highlight-row="true"
           :ref="ref.table"
           :height="tableHeight"
           :style="{border: 'none'}"
           size="small">
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
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: "page",
    props: {
      url: String,
      columns: Array,
      height: Number
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
        tableHeight: this.height
      }
    },
    computed: {
      divStyle () {
        return {
          height: this.height + 'px'
        }
      }
    },
    methods: {
      init: function () {
        let self = this
        let params = this.$attrs.params
        params.page = self.pageNumber
        params.size = self.pageSize
        ajaxUtil.ajax(self.url, params).done(function (response) {
          self.page = response.content
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
      computeTableHeight () {
        let divHeight = this.height
        let pageHeight = this.$refs[this.ref.page].$el.clientHeight
        let contentHeight = divHeight - pageHeight - 16
        let tableHeight = this.$refs[this.ref.table].$el.clientHeight
        if (tableHeight > contentHeight) {
          tableHeight = contentHeight
        }
        this.tableHeight = tableHeight
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
        this.pageNumber = 0
        this.pageSize = 10
        this.init()
      },
      'height': function () {
        this.computeTableHeight()
      }
    }
  }
</script>

<style scoped>

</style>
