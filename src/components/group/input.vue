<template>
  <div>
    <Row v-if="show">
      <Col span="6" v-for="(v, k) in inputsBuffer" class="group-inputs">
        <Row class="vertical-center">
          <Col span="8" style="text-align: right;">
            <span>{{ v.label }}</span>
            <span style="padding-right: 4px;">:</span>
          </Col>
          <Col span="12" style="text-align: left">
            <SystemInput :input="v" v-model="values[k]"></SystemInput>
          </Col>
        </Row>
      </Col>
      <Col span="6"
           :offset="(3 - Object.keys(inputsBuffer).length % 4) * 6"
           v-if="Object.keys(inputsBuffer).length > 0">
        <Col span="12" style="text-align: left" :offset="8">
          <Button @click="select" type="primary">搜索</Button>
          <Button @click="reset" type="primary">重置</Button>
        </Col>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'groupInput',
  props: {
    inputs: {type: Object, required: true}
  },
  data () {
    return {
      show: true,
      inputsBuffer: this.inputs,
      inputsCopy: this.inputs,
      values: {}
    }
  },
  methods: {
    init () {
      this.inputsCopy = Object.assign({}, this.inputs)
      this.handleInputs()
    },
    handleInputs () {
      if (this.inputsBuffer) {
        const keys = Object.keys(this.inputsBuffer)
        keys.forEach(k => {
          let v = this.inputsBuffer[k]
          this.values[k] = v['value']
        })
      }
    },
    select () {
      this.$emit('on-select', this.values)
    },
    reset () {
      this.show = false
      this.$nextTick(() => {
        this.show = true
        this.inputsBuffer = this.inputsCopy
        this.$emit('on-reset')
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.vertical-center {
  display: flex;
  align-items: center;
}

.group-inputs {
  margin-bottom: 0.5em;
}

/* 垂直居中 */
.vertical-center {
  display: flex;
  align-items: center;
}
</style>
