<template>
  <Form ref="form" :model="items" :rules="rules" :label-width="100">
    <Row style="margin-right: 40px">
      <Col :span="span" v-for="field in fields" :key="field[fieldKey]">
        <FormItem :label="labels[field[fieldKey]]" :prop="field[fieldKey]">
          <Select v-model="items[field[fieldKey]]" :disabled="field['disabled']"
                  :multiple="field['select']['multiple']"
                  v-if="field['type'] === 'select'">
            <Option v-for="select in field['select']['data']"
                    :value="select[field['select']['value']]"
                    :key="select[field['select']['value']]">
              {{ select[field['select']['label']] }}
            </Option>
          </Select>
          <Input v-model="items[field[fieldKey]]" :placeholder="labels[field[fieldKey]]"
                 :disabled="field['disabled']"
                 v-else/>
        </FormItem>
      </Col>
    </Row>
    <FormItem :label-width="0" style="text-align: center;margin-bottom: 0px;">
      <Button type="primary" @click="handleSubmit('form')">提交</Button>
      <Button @click="handleReset" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>

<script>
  export default {
    name: "self-form",
    props: {
      url: {type: String, required: true},// form表单提交的url
      fields: {type: Array},// form表单的属性，标准格式:[{key:'',value:'',label:''...}...]
      fieldKey: {type: String, default: 'key'},//获取属性key时的关键字
      fieldValue: {type: String, default: 'value'},//获取属性value时的关键字
      fieldLabel: {type: String, default: 'label'},//获取属性label时的关键字
      extraParams: {type: Object,
        default: () => {
          return {}
        }
      },//form提交时所需的额外参数
      span: {type: Number, default: 24}//24栅格系统,input框的栅格占用
      /*
      * 一些隐藏设置：
      * 每个field都有type属性，如未填默认为:input
      * 如type=select，field有select属性，select结构如下：
      * {...type: 'select',
      *   select: {value: 'id', label: 'title', data: [{id: '', title: '',...},...]}
      * }
      * select中的value和label分别表示从data中获取option的value和label属性关键字
      */
    },
    data () {
      return {
        initItems: {},
        items: {},
        labels: {},
        rules: {},
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
                this.$emit('form-ok', response);
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
          }
        })
      },
      handleReset () {
        this.items = Object.assign({}, this.initItems);
      },
      updateField (fieldName, fieldValue) {
        this.items[fieldName] = fieldValue;
      },
      updateFields () {
        this.fields.forEach((v) => {this.items[v[this.fieldKey]] = v[this.fieldValue]})
      },
      fillField (fieldName, fieldValue) {
        for (let i=0;i<this.fields.length;i++) {
          let field = this.fields[i];
          if (field[this.fieldKey] === fieldName) {
            field[this.fieldValue] = fieldValue;
            this.fields.splice(i, 1 , field);
            break;
          }
        }
      }
    },
    created () {
      this.init();
    },
  }
</script>

<style scoped>

</style>
