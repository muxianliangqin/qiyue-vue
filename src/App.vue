<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created () {
      this.$Notice.config({
        top: 50,
        duration: 5,
      })
      this.$Message.config({
        top: 50,
        duration: 5,
        background: true
      })
    },
    methods: {
      globalAlert (alerts) {
        const alertsType = alerts.type
        switch (alertsType) {
          case 'error':
            this.$Notice.error({
              title: `<span class="error-code">错误码</span><span>：</span>${alerts.status === 200 ? alerts.code : alerts.status}`,
              desc: `<span class="error-message">错误信息</span><span style="font-size: 14px">：</span>${alerts.message}`
            })
            break
          case 'success':
            this.$Message.success({
              content: `${alerts.message}`
            })
            break
          case 'warning':
            this.$Notice.warning({
              title: 'warning',
              desc: `${alerts.message}`
            })
            break
          case 'loading':
            this.$Message.loading({
              content: `${alerts.message}`
            })
            break
          default:
            this.$Notice.info({
              title: 'info',
              desc: `${alerts.message}`
            })
        }
      }
    },
    computed: {
      alerts () {
        return this.$store.getters.alerts
      }
    },
    watch: {
      /**
       * 深度监控对象值的变化
       * 注意，不应该使用箭头函数来定义 watcher 函数
       * (例如 handler: (val, oldVal) => {this.globalAlert(val)}。
       * 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，
       * this.globalAlert(val) 将是 undefined。
       *
       */
      alerts: {
        deep: true,
        handler: function (val, oldVal) {
          this.globalAlert(val)
        }
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }

  .error-code {
    font-size: 14px;
    font-weight: bolder;
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .error-message {
    font-size: 14px;
    font-weight: bolder;
    letter-spacing: 0.33em;
    margin-right: -0.33em;
  }

</style>
