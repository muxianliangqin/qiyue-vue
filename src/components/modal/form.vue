<template>
  <Modal v-model="modalShow"
         @on-cancel="cancel"
         :mask-closable="maskClosable"
         :footer-hide="footerHide">
    <p slot="header" style="text-align:center">
      <template>
        <Icon :type="icon"/>
        <span>{{ title }}</span>
      </template>
    </p>
    <SystemForm :url="url"
                :fields="fields"
                :fieldValue="fieldValue"
                :fieldLabel="fieldLabel"
                :extraParams="extraParams"
                :span="span"
                @form-ok="ok"
                v-if="formBuild">
    </SystemForm>
  </Modal>
</template>

<script>
  export default {
    name: 'modal-form',
    props: {
      show: {type: Boolean, required: true, default: false},  //对话框是否显示
      title: {type: String, default: '新增记录'},             //对话框标题
      icon: {type: String, default: 'md-settings'},           //标题图标
      maskClosable: {type: Boolean, default: false},          //是否允许点击遮罩层关闭
      footerHide: {type: Boolean, default: true},             //不显示底部
      url: {type: String, required: true},                    // form表单提交的url
      fields: {type: Object},                                 // form表单的属性，标准格式:{key:{key:'',value:'',label:''...},...}
      fieldValue: {type: String, default: 'value'},           //获取属性value时的关键字
      fieldLabel: {type: String, default: 'label'},           //获取属性label时的关键字
      extraParams: {
        type: Object, default: () => {
          return {}
        }
      },                                                      //form提交时所需的额外参数
      span: {type: Number, default: 24}                       //24栅格系统,input框的栅格占用
    },
    // 在组件上实现v-model功能
    model: {
      prop: 'show',
      event: 'modal-cancel'
    },
    data () {
      return {
        vModel: this.show,
        formBuild: false
      }
    },
    computed: {
      modalShow: {
        get () {
          return this.show
        },
        set (value) {
          this.vModel = value
        }
      }
    },
    methods: {
      ok (data) {
        this.$emit('modal-ok', data)
        this.$emit('modal-cancel', false)
      },
      cancel () {
        this.$emit('modal-cancel', false)
      }
    },
    watch: {
      'show' () {
        if (this.show) {
          this.formBuild = true
        } else {
          this.formBuild = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
