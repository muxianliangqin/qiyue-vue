<template>
  <div>
    <Collapse v-model="unfold" accordion>
      <template v-for="web of data">
        <Panel :name="web.element.id"
               style="text-align: left;"
               :key="web.element.id"
               >
          {{web.element.name}}
          <div slot="content">
            <Table :border="true"
                   :columns="columns"
                   :data="web.children"
                   :show-header="true"
                   :stripe="true"
                   :highlight-row="true"
                   size="small"
            >
            </Table>
          </div>
        </Panel>
      </template>
    </Collapse>
  </div>
</template>

<script>
import ajaxUtil from '@/assets/util/ajaxUtil'
export default {
  name: 'index',
  isModifying: false,
  data () {
    return {
      deleteUrl: '/crawler/deleteCategory',
      modifyUrl: '/crawler/ModifyCategory',
      initUrl: '/crawler/getMenuNode',
      unfold: '1',
      data: [],
      columns: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 60
        },
        {
          title: '名称',
          key: 'name',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.element.name)
          }
        },
        {
          title: '链接',
          key: 'url',
          render: (h, params) => {
            let self = this
            if (params.row.isModifying) {
              return h('Input', {
                props: {
                  value: params.row.element.url
                },
                on: {
                  input: function (value) {
                    self.$set(params.row,'url',value)
                    // params.row.element.url = value
                  }
                }
              })
            } else {
              return h('span', params.row.element.url)
            }
          }
        },
        {
          title: 'xpath',
          key: 'xpath',
          render: (h, params) => {
            let xpath = params.row.element.xpath
            xpath = xpath === 'null' ? '' : xpath
            if (params.row.isModifying) {
              return h('Input', {
                props: {
                  value: xpath
                },
                on: {
                  input: function (value) {
                    self.$set(params.row,'xpath',value)
                    // params.row.element.xpath = xpath
                  }
                }
              })
            } else {
              return h('span', xpath)
            }
          }
        },
        {
          title: '操作',
          width: 150,
          render: (h, params) => {
            let buttons = []
            if (params.row.isModifying) {
              let saveButton = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                nativeOn: {
                  click: () => {
                    this.save(params.row)
                  }
                }
              }, '保存')
              buttons.push(saveButton)
            } else {
              let modifyButton = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                nativeOn: {
                  click: () => {
                    this.modify(params.row)
                  }
                }
              }, '修改')
              buttons.push(modifyButton)
            }
            let deleteButton = h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.delete(params.row)
                }
              }
            }, '删除')
            buttons.push(deleteButton)
            return h('div', buttons)
          }
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    modify (row) {
      this.$set(row, 'isModifying', true)
    },
    save (row) {
      ajaxUtil.ajax(this.modifyUrl, row.element).done(function (response) {
        console.log(response)
      }).fail(function (response) {
        alert('网络异常')
      })
      this.$set(row, 'isModifying', false)
    },
    delete (row) {
      if (confirm('确定删除此类别吗?')) {
        let self = this
        let params = {'categoryId': row.element.id}
        ajaxUtil.ajax(self.deleteUrl, params).done(function (response) {
          if (response === 1) {
            alert('删除成功')
            ajaxUtil.ajax(self.initUrl).done(function (response) {
              self.data = response.children
            })
          } else {
            alert('删除失败')
          }
        })
      }
    }
  },
  mounted: function () {
    this.data = ajaxUtil.ajaxSync(this.initUrl).children
  }
}
</script>

<style scoped>

</style>
