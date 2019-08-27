<template>
  <Modal v-model="modalShow" @on-cancel="cancel"
         :mask-closable="maskClosable" :footer-hide="footerHide">
    <p slot="header" style="text-align:center">
      <template>
        <Icon :type="icon" />
        <span>{{ title }}</span>
      </template>
    </p>
    <SelfForm :url="url"
              :fields="fields"
              :fieldKey="fieldKey"
              :fieldValue="fieldValue"
              :fieldLabel="fieldLabel"
              :fieldSelect="fieldSelect"
              :fieldSelectValue="fieldSelectValue"
              :fieldSelectLabel="fieldSelectLabel"
              :extraParams="extraParams"
              :span="span"
              @form-ok="ok"
              v-if="formBuild">
    </SelfForm>
  </Modal>
</template>

<script>
  export default {
    name: "modal-form",
    props: {
      show: {type: Boolean, required: true, default: false}, //对话框是否显示
      title: {type: String, default: '新增记录'},//对话框标题
      icon: {type: String, default: 'md-add-circle'},//标题图标
      maskClosable: {type: Boolean, default: false},//是否允许点击遮罩层关闭
      footerHide: {type: Boolean, default: false},//不显示底部
      url: {type: String, required: true},// form表单提交的url
      fields: {type: Array},// form表单的属性，标准格式:[{key:'',value:'',label:''...}...]
      fieldKey: {type: String, default: 'key'},//获取属性key时的关键字
      fieldValue: {type: String, default: 'value'},//获取属性value时的关键字
      fieldLabel: {type: String, default: 'label'},//获取属性label时的关键字
      fieldSelect: {type: String, default: 'select'},//如果有下拉选，获取属性select时的关键字
      fieldSelectValue: {type: String, default: 'value'},//如果有下拉选，获取select的value时的关键字
      fieldSelectLabel: {type: String, default: 'label'},//如果有下拉选，获取select的label时的关键字
      extraParams: {type: Object, default: {}},//form提交时所需的额外参数
      span: {type: Number, default: 24}//24栅格系统,input框的栅格占用
    },
    model: {
      prop: 'show',
      event: 'modal-cancel'
    },
    data () {
      return {
        modal: this.show,
        formBuild: false
      }
    },
    computed: {
      // 在组件上实现v-model功能
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
      ok (data) {
        this.$emit('modal-ok', data);
        this.$emit('modal-cancel', false);
      },
      cancel () {
        this.$emit('modal-cancel', false);
      }
    },
    watch: {
      'show' () {
        if (this.show) {
          this.formBuild = true;
        } else {
          this.formBuild = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
