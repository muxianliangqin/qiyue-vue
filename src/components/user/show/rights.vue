<template>
  <SelfPage :url="url"
            :columns="columns"
            v-bind="$attrs"
            v-on="$listeners">
    <div slot="buttons"
         class="self-buttons">
      <Button type="primary" size="small" style="margin-right: 80px">新增</Button>
      <divider style="margin: 4px 0px 0px 0px"></divider>
    </div>
  </SelfPage>
</template>

<script>
  export default {
    name: 'rights',
    data () {
      return {
        url:　'user/findRights',
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 100
          },
          {
            title: '权限代码',
            key: 'code'
          },
          {
            title: '权限名称',
            key: 'name'
          },
          {
            title: '权限描述',
            key: 'desc'
          },
          {
            title: '状态',
            key: 'state',
            width: 250,
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
                  style: 'margin: 0 1em;'
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
                  size: 'small',
                  style: 'margin: 0 1em;'
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
  }
</script>

<style scoped>

</style>
