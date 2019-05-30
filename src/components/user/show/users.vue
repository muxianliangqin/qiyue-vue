<template>
  <div>
    <div :ref="ref.buttons"
         class="self-buttons">
      <Button type="primary">新增</Button>
      <Divider style="margin: 8px 0px 0px 0px"></Divider>
    </div>
    <SelfPage :url="url"
              :columns="columns"
              v-bind="$attrs"
              v-on="$listeners">
    </SelfPage>
  </div>
</template>

<script>
  export default {
    name: "menus",
    data () {
      return {
        ref: {
          buttons: 'buttons'
        },
        url:　'user/findUsers',
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 100
          },
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '手机',
            key: 'mobile'
          },
          {
            title: '别名',
            key: 'alias'
          },
          {
            title: '性别',
            key: 'gender',
            render: (h,params) => {
              let gender = params.row.gender
              let genderCn = ''
              if (gender === 'm') {
                genderCn = '男'
              } else if (gender === 'f') {
                genderCn = '女'
              } else {
                genderCn = '未知'
              }
              return h('span',genderCn)
            }
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
    mounted () {
      let pageHeight = this.$store.getters.tabs.height
      let buttonsHeight = this.$refs[this.ref.buttons].clientHeight
      this.$store.dispatch("setTabsHeight",pageHeight - buttonsHeight)
    }
  }
</script>

<style scoped>

</style>
