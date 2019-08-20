<template>
  <Table :border="true"
         :columns="columns"
         :data="getData"
         :show-header="true"
         :stripe="true"
         :highlight-row="true"
         :style="{border: 'none'}"
         size="small">
  </Table>
</template>

<script>
  export default {
    name: "webs_expand",
    props: {
      row: Object
    },
    data () {
      return {
        columns: [
          {
            type: 'index',
            title: '序号',
            align: 'center',
            width: 70
          },
          {
            title: '标题',
            key: 'title',
            render: (h, params) => {
              let self = this;
              let a  = h('a', {
                on: {
                  click: function () {
                    let component = {
                      name: 'CrawlerShowNews',
                      desc: '新闻列表[' + params.row.title + ']',
                      show: true,
                      new: true,
                      params: {
                        categoryId: params.row.id
                      }
                    };
                    self.$store.dispatch('addComponent', component);
                    let param = {
                      categoryId: params.row.id
                    };
                    self.$axios.ajax(self.url.web.hasRead, param).then(function (response) {
                      if (response.data.errorCode === '0000') {
                        self.reload();
                      }
                    });
                  }
                }
              }, params.row.title);
              let badge = h('Badge', {
                attrs: {
                  count: params.row.newNum,
                  type: 'success'
                },
                style:{
                  marginLeft: '8px'
                }
              });
              return [a, badge]
            }
          },
          {
            title: '网址链接',
            key: 'url'
          },
          {
            title: '标题路径',
            key: 'xpathTitle'
          },
          {
            title: '正文路径',
            key: 'xpathText'
          },
          {
            title: '编码',
            width: 100,
            align: 'center',
            key: 'charset'
          },
          {
            title: '操作',
            align: 'center',
            width: 150,
            render: (h, params) => {
              let self = this;
              let modify = h('a', {
                attrs: {
                  style: 'margin-right: 2em;'
                },
                on: {
                  click: function () {
                    self.category.form.modal = true;
                    self.category.form.title = '修改分类';
                    self.category.form.url = self.url.category.modify;
                    self.category.form.items.webId = params.row.webId;
                    self.category.form.items.title = params.row.title;
                    self.category.form.items.url = params.row.url;
                    self.category.form.items.xpathTitle = params.row.xpathTitle;
                    self.category.form.items.xpathText = params.row.xpathText;
                    self.category.form.items.charset = params.row.charset;
                    self.category.form.extraParams = {
                      id: params.row.id,
                    }
                  }
                }
              }, '修改');
              let del = h('a', {
                on: {
                  click: function () {
                    self.category.del.modal = true;
                    self.category.del.url = self.url.category.del;
                    self.category.del.msg = '分类标题：' + params.row.title;
                    self.category.del.params = {
                      categoryId: params.row.id
                    }
                  }
                }
              }, '删除');
              return [modify, del]
            }
          }
        ]
      }
    },
    computed: {
      getData () {
        return this.row.categories;
      }
    }
  }
</script>

<style scoped>

</style>
