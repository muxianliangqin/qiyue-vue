<template>
  <div>
    <Table :border="true"
           :columns="columns"
           :data="getNews"
           :show-header="false"
           :stripe="true"
           :highlight-row="true"
           size="small"
           :height="400"></Table>
    <Page :total='total' show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'cus_news',
  data () {
    return {
      columns: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 60
        },
        {
          title: '新闻',
          key: 'title',
          render: (h, params) => {
            return h('a', {
              attrs: {
                href: params.row.url,
                target: '_blank'
              }
            }, params.row.title)
          }
        }
      ],
      news: [{'id': 1, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 2, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}, {'id': 3, 'title': '广州市人民政府办公厅关于进一步加强户籍家庭住房保障工作的通知', 'url': 'http://www.gz.gov.cn/gzgov/s2812/201809/0ae5089a47dc4e6494f4fadb7635c872.shtml'}],
      total: 11
    }
  },
  methods: {
    getNews () {
      let code = this.$route.query.code
      alert(code)
      $.ajax({
        type: 'get',
        url: 'http://localhost:8080/crawler/findNews',
        dataType: 'json',
        data: {
          'code': code
        },
        success: function (response) {
          this.news = response
        },
        error: function (response) {
          // alert(response)
        }
      })
    },
    pageChange (page) {
      console.log(page)
    },
    pageSizeChange (pageSize) {
      console.log(pageSize)
    }
  },
  mounted () {
    alert(1)
    this.getNews()
  },
  deactivated () {
  }
}
</script>

<style scoped>

</style>
