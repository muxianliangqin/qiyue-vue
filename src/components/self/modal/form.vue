<template>
  <Modal v-model="modalShow" @on-cancel="cancel">
    <p slot="header" style="text-align:center">
      <template>
        <Icon type="md-add-circle" />
        <span>{{title?title:'新增记录'}}</span>
      </template>
    </p>
    <Form ref="form" :model="items" :rules="rules" :label-width="100">
      <slot name="fields">
        无input属性
      </slot>
      <FormItem :label-width="0" style="text-align: center;margin-bottom: 0px;">
        <Button type="primary" @click="handleSubmit('form')">提交</Button>
        <Button @click="handleReset('form')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
    <div slot="footer" style="display: none">
    </div>
  </Modal>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: "self-form",
    props: {
      show: Boolean,
      title: String,
      url: String,
      items: Object,
      rules: Object,
      extraParams: Object
    },
    model: {
      prop: 'show',
      event: 'self-model'
    },
    data () {
      return {
        modal: this.show
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
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = this.url
            let msgSuccess = '操作成功'
            let msgFail = '操作失败，原因:'
            let params = this.items
            params = Object.assign(params, this.extraParams);
            let self = this
            ajaxUtil.ajax(url,params).done(function (response) {
              if (response.errorCode === '0000') {
                self.$Message.success(msgSuccess);
                self.$emit('self-model',false);
                self.$emit('self-done',true);
              } else {
                self.$Message.error(msgFail + response.errorMsg);
              }
            }).fail(function (response) {
              self.$Message.info('网络异常:' + response.responseJSON.message);
            })
          } else {
            this.$Message.error('校验不通过，请重新填写');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      cancel () {
        this.$emit('self-done',false);
        this.$emit('self-model',false);
      }
    }
  }
</script>

<style scoped>

</style>
