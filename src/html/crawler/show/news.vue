<template>
  <TablePage :url="findNews"
            :columns="columns"
            ref="TablePage"
            v-bind="$attrs"
            v-on="$listeners">
  </TablePage>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: "news",
    data () {
      return {
        findNews: '/crawler/findNews',
        hasRead: '/crawler/newsHasRead',
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 70
          },
          {
            title: '标题',
            key: 'title',
            render: (h, params) => {
              let self = this;
              let a = h('a', {
                attrs: {
                  href: params.row.url,
                  target: '_blank'
                },
                on: {
                  click () {
                    let param = {
                      newsId: params.row.id
                    };
                    ajaxUtil.ajax(self.hasRead, param).done(function (response) {
                      if (response.errorCode === '0000') {
                        self.$refs.TablePage.reload();
                      }
                    })
                  }
                }
              }, params.row.title);
              let span = h('span', {
                style: {
                  marginLeft: '8px'
                }
              }, '未读');
              if (params.row.unread === '0') {
                return [a,span];
              } else {
                return [a];
              }
            }
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
