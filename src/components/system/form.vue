<template>
  <Form ref="form" :model="items" :rules="rules" :label-width="100" v-if="show">
    <Row style="margin-right: 40px">
      <Col v-for="(value, key, index) in fields"
           :span="span"
           :key="index">
        <FormItem :label="labels[key]"
                  :prop="key"
                  v-if="value.display">
          <!-- 下拉选 -->
          <label v-if="value.type === 'select'">
            <Select v-model="items[key]"
                    :disabled="value.disabled"
                    :multiple="value.select.multiple">
              <Option v-for="option in value.select.data"
                      :value="undefined === value.select.value ? option.value : option[value.select.value]"
                      :key="undefined === value.select.value ? option.value : option[value.select.value]">
                {{ undefined === value.select.label ? option.label : option[value.select.label] }}
              </Option>
            </Select>
          </label>
          <!-- 单选框 -->
          <RadioGroup v-model="items[key]"
                      :disabled="value.disabled"
                      v-else-if="value.type === 'radio'">
            <Tooltip v-for="radio in value.radio.data"
                     :key="undefined === value.radio.value ? radio.value : radio[value.radio.value]"
                     :content="undefined === value.radio.label ? radio.label : radio[value.radio.label]">
              <Radio :label="undefined === value.radio.value ? radio.value : radio[value.radio.value]">
                <Icon v-if="radio.icon" :custom="radio.icon"></Icon>
                <span
                  v-if="radio.text">{{
                    undefined === value.radio.label ? radio.label : radio[value.radio.label]
                  }}</span>
              </Radio>
            </Tooltip>
          </RadioGroup>
          <!-- 普通输入框 -->
          <label v-else>
            <Input v-model="items[key]" :placeholder="labels[key]"
                   :disabled="value.disabled"/>
          </label>
        </FormItem>
      </Col>
    </Row>
    <FormItem :label-width="0" style="text-align: center;margin-bottom: 0;">
      <Button type="primary" @click="handleSubmit('form')">提交</Button>
      <Button @click="handleReset" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: 'system-form',
  props: {
    url: {type: String, required: true},                  // form表单提交的url
    fields: {type: Object},                               // form表单的属性，标准格式:{key:{key:'',value:'',label:''...},...}
    fieldValue: {type: String, default: 'value'},         // 获取属性value时的关键字
    fieldLabel: {type: String, default: 'label'},         // 获取属性label时的关键字
    fieldRule: {type: String, default: 'rule'},           // 获取属性rule时的关键字
    extraParams: {
      type: Object,
      default: () => {
        return {}
      }
    },                                                    // form提交时所需的额外参数
    span: {type: Number, default: 24}                     // 24栅格系统,input框的栅格占用
    /*
    * 一些隐藏设置：
    * 每个field都有type属性，如未填默认为:text
    * 如type=select，field有select属性，select结构如下：
    * {...type: 'select',
    *   select: {value: 'id', label: 'title', data: [{id: '', title: '',...},...]}
    * }
    * select中的value和label分别表示从data中获取option的value和label属性关键字
    * option默认value和label属性
    * 下拉选 如果value是数字，form检测必填时，不能检测通过，尽量用String类型
    */
    /**
     * type=radio，也依上例
     * {..., type: 'radio',
     *   radio: {value: 'label',label: 'content',data: [{label: 'show', content: '展示', icon: 'icon-font icon-show'},...]}
     * }
     */
  },
  data () {
    return {
      show: false,
      initItems: {},
      items: {},
      labels: {},
      rules: {}
    }
  },
  methods: {
    init () {
      this.show = false
      /**
       * 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
       * 它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。
       */
      this.$nextTick(() => {
        this.ready()
        this.show = true
      })
    },
    /**
     * 准备数据
     * 如果直接在this.items上改变，刚进入页面会有校验和重置异常的情况，过一小段时间就正常了
     * 猜测应该是直接修改原data数据每改变一次页面就更新一次，修改过多执行需要时间处理
     * 改为先把数据准备好，再赋值给data数据只执行一次，没有以上bug
     */
    ready () {
      let items = {}
      let labels = {}
      let rules = {}
      let keys = Object.keys(this.fields)
      keys.forEach(k => {
        let field = this.fields[k]
        items[k] = field[this.fieldValue]
        labels[k] = field[this.fieldLabel]
        // 默认字段展示
        if (undefined === field.display) {
          field.display = true
        }
        // 默认字段不禁用
        if (undefined === field.disabled) {
          field.disabled = false
        }
        // 检验规则，如果未设置默认必输
        if (field[this.fieldRule]) {
          rules[k] = field[this.fieldRule]
        } else {
          rules[k] = [
            {required: true, message: `请输入${field[this.fieldLabel]}`, trigger: 'blur'}
          ]
        }
        // 字段类型
        // 如果字段存在`select`属性，则类型为 `select`
        if (!field['type']) {
          // 如果未输入默认 `text`
          field['type'] = 'text'
        }
      })
      this.initItems = Object.assign({}, items)
      this.items = items
      this.labels = labels
      this.rules = rules
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let params = Object.assign(this.items, this.extraParams)
          this.$http.post(this.url, params).then((response) => {
            this.$Notice.success({
              title: '操作成功'
            })
            this.$emit('form-ok', response)
          })
        }
      })
    },
    /**
     * 重置
     */
    handleReset () {
      this.items = Object.assign({}, this.initItems)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
