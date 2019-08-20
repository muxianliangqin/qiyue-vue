<template>
  <div :style="login">
    <img src="../../assets/logo.png">
    <h1>Welcome aiqiyue.com</h1>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" >
      <FormItem prop="username">
        <Input type="text" v-model="formInline.username" placeholder="Username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formInline.password" placeholder="Password">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import ajaxUtil from '@/assets/util/ajaxUtil'
export default {
  data () {
    return {
      formInline: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [
          { required: true, message: 'Please fill in the username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please fill in the password.', trigger: 'blur' },
          { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    login () {
      let style = {
        'max-width': '300px',
        'margin': '0 auto'
      }
      return style
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        let self = this
        if (valid) {
          ajaxUtil.ajax('/user/login', self.formInline).done(function (response) {
            if (response.errorCode === '0000') {
              self.$Message.success('Success!')
              self.$store.dispatch('setUserInfo', response.content)
              self.$router.push({name: 'index'})
            } else {
              self.$Message.error('用户名或密码错误')
            }
          })
        } else {
          self.$Message.error('Fail!')
        }
      })

    }
  }
}
</script>
