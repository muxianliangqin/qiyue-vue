<template>
  <Modal v-model="modalShow"
         @on-cancel="cancel">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle" style="color: red"></Icon>
      <span>{{title?title:'您确定要删除以下记录吗？'}}</span>
    </p>
    <slot name="msg">
    </slot>
    <div slot="footer" style="text-align:center">
      <Button type="error" size="large" @click="ok">删除</Button>
    </div>
  </Modal>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: 'add',
    props: {
      show: Boolean,  // 是否显示
      url: String,    // 删除的url
      title: String,
      params: Object  // 参数
    },
    model: {
      prop: 'show',
      event: 'self-cancel'
    },
    data () {
      return {
        modal: this.show,
      }
    },
    computed: {
      modalShow:{
        get () {
          return this.show
        },
        set (value) {
          this.modal = value
        }
      }

    },
    methods: {
      ok () {
        let self = this
        ajaxUtil.ajax(self.url, self.params).done(function (response) {
          if (response.errorCode === "0000") {
            self.$Message.success('操作成功');
            self.cancel()
          } else {
            self.$Message.error('操作失败，原因：' + response.errorMsg);
          }
        }).fail(function (response) {
          self.$Message.error('网络异常:' + response.responseJSON.message);
        })
      },
      cancel () {
        this.$emit('self-cancel', false)
      }
    }
  }
</script>

<style scoped>

</style>
