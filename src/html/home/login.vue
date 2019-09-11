<template>
  <div :style="login">
    <img src="../../assets/logo.png">
    <h1>Welcome aiqiyue.com</h1>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" >
      <FormItem prop="username">
        <Input type="text" v-model="formInline.username"
               prefix="ios-person-outline"
               placeholder="Username"/>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formInline.password"
               prefix="ios-lock-outline" placeholder="Password"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  props: {
    params: {type: Object, default () {return {}}}
  },
  data () {
    return {
      formInline: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '用户密码不得少于6位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    login () {
      let style = {
        'max-width': '300px',
        'margin': '0 auto'
      };
      return style
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post('/user/login', this.formInline, (response) => {
            if (response.errorCode === '0000') {
              this.$Message.success('登录成功!');
              this.$store.dispatch('setUserInfo', response.content);
              this.$router.push({name: 'index'});
            } else {
              this.$Message.error(response.errorMsg);
            }
          }, (response) => {
            this.$Message.error('登录失败!')
          })
        }
      })
    },
    isLogout () {
      if (this.padding.logout) {
        this.$Message.info("用户信息已过期")
      }
    }
  },
  mounted: {

  }
}
</script>
