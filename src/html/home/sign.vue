<template>
  <div :style="bodyStyle">
    <Card :title="card.title" style="margin: 20px auto;width: 500px;">
      <SystemForm v-if="systemForm.show"
                  ref="sign"
                  :url="systemForm.url"
                  :fields="systemForm.fields"
                  :extraParams="systemForm.extraParams" @form-ok="ok">
      </SystemForm>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'sign',
  data () {
    return {
      systemForm: {
        fields: {
          username: {label: '用户名称', value: ''},
          mobile: {label: '手机号码', value: ''},
          alias: {label: '昵称', value: ''},
          gender: {
            label: '性别', value: '', type: 'select',
            select: {data: [{value: '1', label: '男'}, {value: '2', label: '女'}]}
          },
          password: {label: '密码', value: '', rule: {required: false}}
        },
        show: true,
        url: 'user/user/add',
        extraParams: {}
      },
      card: {
        title: '用户注册',
      }
    }
  },
  computed: {
    bodyStyle () {
      const width = window.innerWidth
      const height = window.innerHeight
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    }
  },
  methods: {
    ok () {
      this.$router.replace('login')
    }
  },
  mounted () {
    this.$refs.sign.handleReset()
  }
}
</script>

<style scoped>

</style>
