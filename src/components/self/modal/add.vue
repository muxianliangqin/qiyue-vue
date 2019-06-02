<template>
  <Modal v-model="modalShow"
         @on-cancel="cancel">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle" style="color: red"></Icon>
      <span>新增记录</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
      <template v-for="(value, key) in formInline">
        <FormItem :label="label[key]">
          <Row>
            <Col span="12">
              <Input type="text" v-model="formInline[key]" :placeholder="label[key]"></Input>
            </Col>
          </Row>
        </FormItem>
      </template>
    </Form>
    <div slot="footer" style="text-align:center">
      <Button type="error" size="large" @click="ok">新增</Button>
    </div>.
  </Modal>
</template>

<script>
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: 'add',
    props: {
      show: Boolean,  // 是否显示
      url: String,    // url
      columns: Array  // table的columns
    },
    model: {
      prop: 'show',
      event: 'self-cancel'
    },
    data () {
      return {
        modal: this.show,
        excludeColumns: ['index', 'state', 'createTime', 'updateTime'],
        label: {},
        formInline: {},
        ruleInline: {}
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
      init () {
        let self = this
        let cols = this.columns
        cols = cols.filter((v) => {
          return ((v.key !== undefined) && (self.excludeColumns.indexOf(v.key) === -1))
        })
        cols.forEach((v) => {
          self.formInline[v.key] = null
          self.label[v.key] = v.title
          self.ruleInline[v.key] = [
            {required: true, message: '请输入' + v.title + '值', trigger: 'blur'}
          ]
        })
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      ok () {
        let self = this
        ajaxUtil.ajax(self.url, self.params).done(function (response) {
          if (response >= 1) {
            self.$Message.info('删除成功');
            self.cancel()
          }
        }).fail(function (response) {
          self.$Message.info('网络异常:' + response.responseJSON.message);
        })
      },
      cancel () {
        this.$emit('self-cancel', false)
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>

</style>
