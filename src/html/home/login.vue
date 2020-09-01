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

  export default {
    data () {
      return {
        url: {
          login: '/user/login'
        },
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
            {type: 'string', min: 3, message: 'The password length cannot be less than 6 bits', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      login () {
        return {
          'max-width': '300px',
          'margin': '0 auto'
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/user/login', this.formInline).then((response) => {
              this.$store.dispatch('setUserInfo', response.content).then(() => {
                this.$router.push({name: 'index'})
              })
            })
          }
        })
      }
    }
  }
</script>
