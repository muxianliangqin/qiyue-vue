<template>
  <div>
    <Collapse v-model="value1" accordion>
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
import crawlerHandler from '@/store/crawler'
import ajax from '@/assets/util/ajax'
export default {
  name: 'index',
  isModifying: false,
  data () {
    return {
      value1: '1',
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
            if (params.row.isModifying) {
              return h('Input', {
                props: {
                  value: params.row.element.url
                },
                on: {
                  input: function (value) {
                    params.row.element.url = value
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
                    params.row.element.xpath = xpath
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
                    this.doneModified(params.row)
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
                    this.beModifying(params.row)
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
    beModifying (row) {
      this.$set(row, 'isModifying', true)
    },
    doneModified (row) {
      this.$set(row, 'isModifying', false)
    },
    delete (row) {
      if (confirm('确定删除此类别吗?')) {
        let url = '/crawler/deleteCategory'
        let params = {'categoryCode': row.element.id}
        let result = ajax.ajax(url, params)
        if (result === 1) {
          alert('删除成功')
          this.data = crawlerHandler.getCrawlerMenu().children
        } else {
          alert('删除失败')
        }
      }
    }
  },
  mounted: function () {
    this.data = crawlerHandler.getCrawlerMenu().children
  }
}
</script>

<style scoped>

</style>
