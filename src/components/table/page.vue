<template>
  <div class="self-root-div"
       :ref="ref.rootDiv"
       :style="divStyle">
    <slot :name="slot.buttons"></slot>
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
    name: "page",
    props: {
      url: String,
      columns: Array,
      /*自定义参数，默认由this.$attrs.params传递参数，若extraParams存在则优先使用*/
      extraParams: Object,
      showHeader: {type: Boolean, default: true},
      stripe: {type: Boolean, default: true},
      highlightRow: {type: Boolean, default: true},
      size: {type: String, default: 'small', validator: function (value) {
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
        let params = {};
        if (this.extraParams) {
          params = this.extraParams;
        } else if (this.$attrs.params){
          params = this.$attrs.params;
        } else {
          params = {}
        }
        if (!params.page) {
          params.page = this.pageNumber;
        }
        if (!params.size) {
          params.size = this.pageSize;
        }
        this.$http.ajax(this.url, params).then((response) => {
          this.page = response.data.content;
        });
      },
      pageChange (page) {
        this.pageNumber = page - 1;
        this.init();
      },
      pageSizeChange (pageSize) {
        this.pageSize = pageSize;
        this.init();
      },
      computeTableHeight () {
        let divHeight = this.contentHeight;
        let pageHeight = this.$refs[this.ref.page].$el.clientHeight;
        let buttonSlots = this.$slots[this.slot.buttons];
        let contentHeight = 0;
        if (buttonSlots) {
          let slotHeight = this.$slots[this.slot.buttons][0].elm.clientHeight;
          contentHeight = divHeight - pageHeight - slotHeight - 16;
        } else {
          contentHeight = divHeight - pageHeight - 16;
        }
        this.tableHeight = contentHeight;
      },
      reload () {
        this.init();
      }
    },
    created () {
      this.init();
    },
    mounted () {
      this.computeTableHeight();
    },
    watch: {
      '$attrs.params': function () {
        let components = this.$store.getters.tabs.components;
        let active = this.$store.getters.tabs.active;
        let activeComponent = {};
        for (let i=0;i<components.length;i++) {
          if (components[i].name === active) {
            activeComponent = components[i];
            break;
          }
        }
        if (activeComponent.new) {
          this.pageNumber = 0;
          this.pageSize = 10;
          this.init();
        }
      }
    }
  }
</script>

<style scoped>

</style>
