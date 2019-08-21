<template>
  <Modal v-model="modalShow" @on-cancel="cancel"
         :mask-closable="maskClosable" :footer-hide="footerHide">
    <p slot="header" style="text-align:center">
      <template>
        <Icon type="md-add-circle" />
        <span>{{title}}</span>
      </template>
    </p>
    <Form ref="form" :model="items" :rules="rules" :label-width="100" v-if="formBuild">
      <Row style="margin-right: 40px">
        <Col :span="span" v-for="field in fields">
          <FormItem :label="labels[field[fieldKey]]" :prop="field[fieldKey]">
            <Select v-model="items[field[fieldKey]]" v-if="field[fieldSelect] !== undefined">
              <Option v-for="select in field[fieldSelect]" :value="select[fieldSelectValue]">
                {{ select[fieldSelectLabel] }}
              </Option>
            </Select>
            <Input v-model="items[field[fieldKey]]" :placeholder="labels[field[fieldKey]]"
                   v-else/>
          </FormItem>
        </Col>
      </Row>
      <FormItem :label-width="0" style="text-align: center;margin-bottom: 0px;">
        <Button type="primary" @click="handleSubmit('form')">提交</Button>
        <Button @click="handleReset" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  export default {
    name: "self-form",
    props: {
      show: {type: Boolean, required: true, default: false},
      url: {type: String, required: true},
      fields: {type: Array},
      title: {type: String, default: '新增记录'},
      fieldKey: {type: String, default: 'key'},
      fieldValue: {type: String, default: 'value'},
      fieldLabel: {type: String, default: 'label'},
      fieldSelect: {type: String, default: 'select'},
      fieldSelectValue: {type: String, default: 'value'},
      fieldSelectLabel: {type: String, default: 'label'},
      extraParams: {type: Object, default: {}},
      maskClosable: {type: Boolean, default: false},
      footerHide: {type: Boolean, default: false},
      span: {type: Number, default: 24},
    },
    model: {
      prop: 'show',
      event: 'modal-cancel'
    },
    data () {
      return {
        modal: this.show,
        initItems: {},
        items: {},
        labels: {},
        rules: {},
        formBuild: false
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
        /*
        如果直接在this.items上改变，刚进入页面会有校验和重置异常的情况，过一小段时间就正常了
        猜测应该是直接修改原data数据每改变一次页面就更新一次，修改过多执行需要时间处理
        改为先把数据准备好，再赋值给data数据只执行一次，没有以上bug
         */
        let items = {};
        let labels = {};
        let rules = {};
        this.fields.forEach((v) => {
          items[v[this.fieldKey]] = v[this.fieldValue];
          labels[v[this.fieldKey]] = v[this.fieldLabel];
          if (v['rule']) {
            rules[v[this.fieldKey]] = v['rule'];
          } else {
            rules[v[this.fieldKey]] = [
              {required: true, message: '请输入' + v[this.fieldLabel], trigger: 'blur'}
            ];
          }
        });
        this.initItems = Object.assign({}, items);
        this.items = items;
        this.labels = labels;
        this.rules = rules;
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = this.items;
            params = Object.assign(params, this.extraParams);
            this.$http.post(this.url,params, (response) => {
              if (response.errorCode === '0000') {
                this.$Notice.success({
                  title: '操作成功'
                });
                this.formBuild = false;
                this.$emit('modal-cancel',false);
                this.$emit('modal-ok',true);
              } else {
                this.$Notice.error({
                  title: '操作失败',
                  desc: `errorCode: ${response.errorCode} \n errorMsg: ${response.errorMsg}`
                });
              }
            }, (error) => {
              if (error.message) {
                this.$Notice.error({
                  title: '网络异常:',
                  desc: error.message
                });
              }
            })
          }
        })
      },
      handleReset () {
        this.items = Object.assign({}, this.initItems);
      },
      cancel () {
        this.formBuild = false;
        this.$emit('modal-ok',false);
        this.$emit('modal-cancel',false);
      }
    },
    watch: {
      'show' () {
        if (this.show) {
          this.init();
          this.formBuild = true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
