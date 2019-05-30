<template>
  <div :style="{height: divHeight + 'px'}">
    <div :ref="ref.buttons"
         class="self-buttons">
      <Button type="primary" style="margin-right: 80px">新增</Button>
      <divider style="margin: 4px 0px"></divider>
    </div>
    <SelfPage :url="url"
              :columns="columns"
              :height="pageHeight"
              v-bind="$attrs"
              v-on="$listeners">
    </SelfPage>
  </div>
</template>

<script>
  import Divider from "iview/src/components/divider/divider";
  export default {
    name: "menus",
    components: {Divider},
    data () {
      return {
        ref: {
          buttons: 'buttons'
        },
        url:　'user/findMenus',
        pageHeight: 300,
        divHeight: 300,
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 100
          },
          {
            title: '菜单代码',
            key: 'code'
          },
          {
            title: '菜单名称',
            key: 'name'
          },
          {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let state = params.row.state
              let stateCn = ''
              if (state === '0') {
                stateCn = '正常'
              } else if (state === '1') {
                stateCn = '删除'
              } else {
                stateCn = '未知'
              }
              return h('span',stateCn)
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let self = this
              let modify = h('Button', {
                attrs: {
                  type: 'primary',
                  size: 'small',
                  style: 'margin-right: 2em;'
                },
                on: {
                  click: function () {
                    self.modal.modify.show = true
                  }
                }
              }, '修改')
              let del = h('Button', {
                attrs: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: function () {
                    self.modal.del.show = true
                  }
                }
              }, '删除')
              return [modify, del]
            }
          }
        ]
      }
    },
    computed: {
    },
    mounted () {
      let pageHeight = this.$store.getters.tabs.height
      this.divHeight = pageHeight - 50
      let buttonsHeight = this.$refs[this.ref.buttons].clientHeight
      this.pageHeight = this.divHeight - buttonsHeight
    }
  }
</script>

<style scoped>

</style>
