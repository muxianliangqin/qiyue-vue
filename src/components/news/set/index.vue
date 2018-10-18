<template>
  <div>
    <Collapse v-model="value1" accordion>
      <template v-for="web of getWebs.children">
        <Panel :name="web.element.code" style="text-align: left;">
          {{web.element.name}}
          <div slot="content">
            <Table :border="true"
                   :columns="columns"
                   :data="web.children"
                   :show-header="true"
                   :stripe="true"
                   :highlight-row="true"
                   size="small">
            </Table>
          </div>
        </Panel>
      </template>
    </Collapse>
  </div>
</template>

<script>
import crawlerHandler from '@/store/crawler'
export default {
  name: "index",
  isModifying: false,
  data () {
    return {
      value1: '1',
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
            var self = this
            if (this.isModifying) {
              return h('Input',{
                props:{
                  value:params.row.element.url
                },
                on:{
                  input: function (value) {
                    params.row.element.url = value
                  }
                }
              })
            } else {
              return h('span',params.row.element.url)
            }
          }
        },
        {
          title: 'xpath',
          key: 'xpath',
          render: (h, params) => {
            let xpath = params.row.element.xpath
            xpath = 'null' === xpath?'':xpath
            if (this.isModifying) {
              return h('Input',{
                props:{
                  value:xpath
                },
                on:{
                  input: function (value) {
                    params.row.element.xpath = xpath
                  }
                }
              })
            } else {
              return h('span',xpath)
            }
          }
        },
        {
          title: '操作',
          width: 150,
          render: (h, params) => {
            let self = this
            return h('div',[
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                nativeOn: {
                  click: () => {
                    self.beModifying(true)
                    // self.$emit('modify',true)
                  }
                }
              }, 'modify'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    // this.show(params.index)
                  }
                }
              }, 'delete')
            ])
          }
        }
      ]
    }
  },
  computed: {
    getWebs () {
      let webs = crawlerHandler.getCrawlerMenu()
      return webs
    }
  },
  methods: {
    beModifying (value) {
      if (value) {
        this.isModifying = value
        return value
      } else {
        return this.isModifying
      }
      // let beModifying = this.isModifying
      // this.$on('modify',function (value) {
      //   beModifying = value
      // })
      // return beModifying
    }
  }
}
</script>

<style scoped>

</style>
