<template>
  <div :style="login">
    <img src="../../assets/logo.png">
    <h1>Welcome aiqiyue.com</h1>
    <Form ref="formInline" :model="formInline" :rules="ruleInline">
      <FormItem prop="username">
        <Input prefix="ios-person-outline" type="text" v-model="formInline.username" placeholder="Username"/>
      </FormItem>
      <FormItem prop="password">
        <Input prefix="ios-lock-outline" type="password" v-model="formInline.password" placeholder="Password"/>
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
            {required: true, message: 'Please fill in the username', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please fill in the password.', trigger: 'blur'},
            {type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur'}
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
          if (valid) {
            this.$http.post('/user/login', this.formInline, (response) => {
              if (response.errorCode === '0000') {
                this.$Message.success('Success!')
                this.$store.dispatch('setUserInfo', response.content)
                this.$router.push({name: 'index'})
              } else {
                this.$Message.error(response.errorMsg)
              }
            }, (error) => {
              this.$Message.error(error.errorMsg)
            })
          }
        })

      }
    }
  }
</script>
