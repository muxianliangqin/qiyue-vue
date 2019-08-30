<template>
  <div>
    <TablePage :url="url.findAll" :columns="columns"
               :extraParams="extraParams" :ref="ref.tablePage">
    </TablePage>
    <ModalState v-model="modalState.modal"
                :url="modalState.url"
                :params="modalState.params"
                :title="modalState.title"
                @modal-ok="reload">
      <div slot="msg" style="text-align: center">
        <p>{{modalState.msg}}</p>
      </div>
    </ModalState>
  </div>
</template>

<script>
  export default {
    name: "keyword",
    data () {
      return {
        url: {
          findAll: '/crawler/regexp/keywordFindAll',
          del: '/crawler/regexp/keywordDel',
        },
        ref: {
          tablePage: "tablePage"
        },
        columns: [
          {title: '序号', type: 'index', width: 70},
          {title: '名称', key: 'name'},
          {title: '正则表达式', key: 'regexp'},
          {title: '操作', align: 'center', width: 200,
            render: (h, params) => {
              let add = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {
                    let component = {
                      name: 'CrawlerSetKeyword',
                      desc: '关键字新增',
                      show: true,
                      new: true,
                      params: {}
                    };
                    this.$store.dispatch('addComponent', component)
                  }
                }
              }, '新增');
              let modify = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {
                    let component = {
                      name: 'CrawlerSetKeyword',
                      desc: '关键字修改',
                      show: true,
                      new: true,
                      params: {row: params.row}
                    };
                    this.$store.dispatch('addComponent', component)
                  }
                }
              }, '修改');
              let del = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {
                    this.modalState.modal = true;
                    this.modalState.url = this.url.del;
                    this.modalState.title = '正则表达式删除';
                    this.modalState.msg = `确定要删除记录：【${params.row.name}】吗？`;
                    this.modalState.params = {
                      id: params.row.id
                    }
                  }
                }
              }, '删除');
              return [add, modify, del]
            }
          },
        ],
        extraParams: {
          userId: this.$store.getters.userInfo.id
        },
        modalState: {
          modal: false,
          url: '',
          title: '',
          msg: '',
          params: {}
        }
      }
    },
    methods: {
      reload () {
        this.$refs[this.ref.tablePage].reload();
      }
    }
  }
</script>

<style scoped>

</style>
