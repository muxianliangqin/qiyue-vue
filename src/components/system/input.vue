<template>
  <div>
    <label v-if="inputDefine.type === TYPE.SELECT">
      <Select v-model="inputDefine.value"
              :disabled="inputDefine.disabled"
              :multiple="inputDefine.multiple"
              clearable>
        <Option v-for="option in inputDefine.options"
                :value="option.value"
                :lable="option.label"
                :key="option.value">
          {{ option.label }}
        </Option>
      </Select>
    </label>
    <!-- 单选框 -->
    <RadioGroup v-else-if="inputDefine.type === TYPE.RADIO"
                v-model="inputDefine.value"
                :disabled="inputDefine.disabled">
      <Tooltip v-for="radio in inputDefine.radios"
               :key="radio.value"
               :content="radio.label">
        <Radio :label="radio.value">
          <Icon v-if="radio.icon" :custom="radio.icon"></Icon>
          <span v-if="radio.showText">{{ radio.label }}</span>
        </Radio>
      </Tooltip>
    </RadioGroup>
    <!--  自动完成  -->
    <div v-else-if="inputDefine.type === TYPE.AUTO_COMPLETE">
      <Tooltip :content="inputDefine.display" placement="bottom" max-width="300">
        <AutoComplete
          v-model="inputDefine.display"
          @on-search="searchFromDB"
          @on-select="confirmSelected"
          clearable
          :disabled="inputDefine.disabled"
          :placeholder="inputDefine.placeholder">
          <Option v-for="item in inputDefine.autoCompleteData" :value="item[inputDefine.labelField]" :key="item[inputDefine.labelField]">
            {{ item[inputDefine.labelField] }}
          </Option>
        </AutoComplete>
      </Tooltip>
    </div>
    <!-- 普通输入框 -->
    <label v-else>
      <Input v-model="inputDefine.value"
             :placeholder="inputDefine.placeholder"
             :disabled="inputDefine.disabled"
             clearable/>
    </label>
  </div>
</template>

<script>
export default {
  name: 'systemInput',
  props: {
    input: {
      type: Object, default: undefined, validator: (value) => {
        return value.hasOwnProperty('type')
      }
    },
    // 输入框类型
    type: {
      type: String, default: 'text', validator: (value) => {
        return ['text', 'select', 'radio', 'autoComplete'].indexOf(value) !== -1
      }
    },
    label: {type: String, default: '文本框'},
    // 值
    value: {},
    url: {
      type: String
    },
    keyField: {type: String, default: 'key'},
    valueField: {type: String, default: 'value'},
    labelField: {type: String, default: 'label'},
    // 是否禁用
    disabled: {type: Boolean, default: false},
    multiple: {type: Boolean, default: false},
    placeholder: '请输入',
    options: {
      type: Array, default: () => {
        return [
          {
            label: '',
            value: undefined
          }
        ]
      }
    },
    radios: {
      type: Array, default: () => {
        return [
          {
            label: '',
            value: undefined,
            icon: '',
            showText: false
          }
        ]
      }
    },
    autoCompleteData: {
      type: Array
    }
  },
  data () {
    return {
      TYPE: {
        TEXT: 'text',
        SELECT: 'select',
        RADIO: 'radio',
        AUTO_COMPLETE: 'autoComplete',
      },
      inputDefine: {
        // 展示值，用于如AutoComplete组件显示值和实际取值不一致的处理，一般为String类型
        display: '',
        type: this.type,
        label: this.label,
        value: this.value,
        url: this.url,
        keyField: this.keyField,
        valueField: this.valueField,
        labelField: this.labelField,
        disabled: this.disabled,
        multiple: this.multiple,
        placeholder: this.placeholder,
        options: this.options,
        radios: this.radios,
        autoCompleteData: this.autoCompleteData
      }
    }
  },
  model: {
    prop: 'inputDefine.value',
    event: 'input-change'
  },
  computed: {},
  methods: {
    init () {
      this.handleInput()
    },
    handleInput () {
      if (this.input) {
        const keys = Object.keys(this.inputDefine)
        keys.forEach(k => {
          if (this.input[k]) {
            this.inputDefine[k] = this.input[k]
          } else {
            this.inputDefine[k] = this[k]
          }
        })
      }
    },
    searchFromDB (value) {
      this.$http.post(this.inputDefine.url, value).then((response) => {
        this.inputDefine.autoCompleteData = response.content
      })
    },
    confirmSelected (value) {
      let item = this.inputDefine.autoCompleteData.find(k => value === k[this.inputDefine.labelField])
      this.inputDefine.value = item[this.inputDefine.valueField]
    }
  },
  created () {
    this.init()
  },
  watch: {
    'inputDefine.value' () {
      this.$emit('input-change', this.inputDefine.value)
    }
  }
}
</script>

<style scoped>

</style>
