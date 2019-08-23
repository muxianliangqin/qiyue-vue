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
              let a  = h('a', {
                on: {
                  click: () => {
                    let component = {
                      name: 'CrawlerShowNews',
                      desc: '新闻列表[' + params.row.title + ']',
                      show: true,
                      new: true,
                      params: {
                        categoryId: params.row.id
                      }
                    };
                    this.$store.dispatch('addComponent', component).then(() => {
                      this.$emit('read', params.row);
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
                  click: () => {
                    this.$emit('modify', params.row);
                  }
                }
              }, '修改');
              let del = h('a', {
                on: {
                  click: () => {
                    this.$emit('del', params.row);
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
