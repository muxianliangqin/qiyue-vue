<template>
  <div>
    <Table :border="true"
           :columns="columns"
           :data="getData"
           :show-header="true"
           :stripe="true"
           :highlight-row="true"
           :style="{border: 'none'}"
           size="small">
    </Table>
    <ModalForm v-model="modalForm.modal" :url="modalForm.url" :title="modalForm.title"
               :fields="modalForm.fields" :extraParams="modalForm.extraParams"
               fieldSelectValue="id" fieldSelectLabel="title">
    </ModalForm>
  </div>
</template>

<script>
  export default {
    name: "webs_expand",
    props: {
      row: Object
    },
    data () {
      return {
        url: {
          keywordFindAll: '/crawler/regexp/keywordFindAll',
          keywordWebSet: '/crawler/regexp/keywordWebSet'
        },
        keywords: [],
        modalForm: {
          modal: false,
          title: '网站搜索关键字设置',
          url: '',
          fields: [
            {key: 'keywords', value: [], label: '匹配关键字', type:'select',
              select: {value: 'id', label: 'name', multiple: true,
                data: []
              },
              rule: [
                {required: true, message: '请选择匹配关键字', trigger: 'blur', type: 'array'}
              ]
            },
            {key: 'categories', value: [], label: '网站分类', type:'select',
              select: {value: 'id', label: 'title', multiple: true,
                data: this.row.categories
              },
              rule: [
                {required: true, message: '请选择匹配网站分类', trigger: 'blur', type: 'array'}
              ]
            }
          ],
          extraParams: {}
        },
        columns: [
          {type: 'index', title: '序号', align: 'center', width: 70},
          {title: '标题',key: 'title',
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
          {title: '网址链接', key: 'url'},
          {title: '标题路径', key: 'xpathTitle'},
          {title: '正文路径', key: 'xpathText'},
          {title: '编码', width: 100, align: 'center', key: 'charset'},
          {title: '操作', align: 'center', width: 150,
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
          },
          {title: '关键字设置', width: 150, align: 'center',
            render: (h, params) => {
              let view = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {

                  }
                }
              }, '查看');
              let modify = h('a', {
                attrs: {
                  style: 'margin: 10px;'
                },
                on: {
                  click: () => {
                    let keyword = this.modalForm.fields[0];
                    keyword.select.data = this.keywords;
                    this.modalForm.fields.splice(0, 1, keyword);
                    this.modalForm.modal = true;
                    this.modalForm.url = this.url.keywordWebSet;
                    this.modalForm.title = '网站搜索关键字设置';
                    this.modalForm.extraParams = {webId: this.row.id}
                  }
                }
              }, '设置');
              return [view, modify]
            }
          },
        ]
      }
    },
    computed: {
      getData () {
        return this.row.categories;
      }
    },
    methods: {
      keywordFindAll () {
        this.$http.get(this.url.keywordFindAll, (response) => {
          this.keywords = response.content;
        })
      }
    },
    mounted () {
      this.keywordFindAll();
    }
  }
</script>

<style scoped>

</style>
