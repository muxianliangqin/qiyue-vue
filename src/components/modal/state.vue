<!--
本组件用于处理记录状态的改变
Params:
  show: 控制modal的显示和隐藏
  url: 后台接口链接
  title: modal显示的标题
  params: 传入的参数，一般为 {xxId:}

modal-ok:
  自定义的完结事件，返回boolean值，
  true表示操作成功，需要更新数据
  false表示取消操作，不需要更新数据
modal-cancel:
  自定义组件的v-model
-->
<template>
  <Modal v-model="modalShow"
         :maskClosable="maskClosable"
         :footerHide="footerHide"
         @on-cancel="cancel">
    <p slot="header" style="text-align:center">
      <Icon :type="icon" style="color: red"></Icon>
      <span>{{ title }}</span>
    </p>
    <slot name="msg">
    </slot>
    <div slot="footer" style="text-align:center">
      <Button type="error" size="small" @click="ok">确定</Button>
      <Button size="small" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'add',
    props: {
      show: {type: Boolean, required: true, default: false},  // 是否显示
      url: {type: String, required: true, default: '/'},    // 删除的url
      title: {type: String, default: '您确定要删除以下记录吗？'},
      icon: {type: String, default: 'ios-information-circle'},
      params: {type: Object, default: {}}, // 参数
      maskClosable: {type: Boolean, default: false},//是否允许点击遮罩层关闭
      footerHide: {type: Boolean, default: false},//不显示底部
    },
    model: {
      prop: 'show',
      event: 'modal-cancel'
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
        this.$http.post(this.url, this.params, (response) => {
          if (response.errorCode === '0000') {
            this.$Notice.success({
              title: '操作成功'
            });
            this.$emit('modal-cancel',false);
            this.$emit('modal-ok',true);
          } else {
            this.$Notice.error({
              title: `操作失败,errorCode: ${response.errorCode}`,
              desc: `errorMsg: ${response.errorMsg}`
            });
          }
        }, (error) => {
          if (error.message) {
            this.$Notice.error({
              title: `网络异常,status: ${error.status}`,
              desc: `errorMsg: ${error.message}`
            });
          }
        })
      },
      cancel () {
        this.$emit('modal-cancel',false);
        this.$emit('modal-ok',false);
      }
    }
  }
</script>

<style scoped>

</style>
