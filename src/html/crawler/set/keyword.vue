<template>
  <div style="text-align: left">
    <div style="margin-bottom: 24px">
      <ButtonGroup>
        <Button icon="md-add" @click="leftAdd()"></Button>
        <Button icon="md-remove" @click="leftSubtract()"
                :disabled="subtractDisabled"></Button>
      </ButtonGroup>
      <template v-for="(item, index) in group">
        <Tooltip :content="item['data']['__label']"
                 style="margin: 0"
                 placement="top" :key="index">
          <Cascader :data="data" trigger="hover" :clearable="false"
                    @on-visible-change="locate(index)"
                    @on-change="handleChange"
                    style="display: inline-block;width: 100px">
          </Cascader>
        </Tooltip>
      </template>
      <ButtonGroup>
        <Button icon="md-add" @click="rightAdd()" :disabled="rightAddDisabled"></Button>
        <Button icon="md-remove" @click="rightSubtract()"
                :disabled="subtractDisabled"></Button>
      </ButtonGroup>
    </div>
    <div style="margin:24px 92px;">
      <template v-for="item in group">
        <Tooltip :content="item.data.desc"
                 placement="top">
          <div :key="item.data.code"
               style="width: 100px;display: inline-block;text-align: center;">
            <span v-if="item.prefix">{{ item.prefix }}</span>
            <Input v-model="item.value"
                   :placeholder="item.data.label"
                   :style="{width: item.width + 'px'}"
                   :disabled="item.disabled" @on-blur="inputBlur"/>
            <span v-if="item.suffix">{{ item.suffix }}</span>
          </div>
        </Tooltip>
      </template>
    </div>
    <Divider></Divider>
    <div style="width: 50%;">
      <SelfForm :fields="fields"
                :url="url.addRegexp" :ref="ref.form">
      </SelfForm>
    </div>
  </div>
</template>

<script>
  export default {
    name: "keyword",
    data () {
      return {
        url: {
          findAll: '/crawler/regexp/findAll',
          addRegexp: ''
        },
        ref: {
          form: 'form'
        },
        index: 0,
        group: [],
        data: [],
        fields: [
          {key: 'name', value: '', label: '名称'},
          {key: 'regexp', value: '', label: '正则表达式'},
        ],
      }
    },
    computed: {
      subtractDisabled () {
        return this.group.length === 1;
      },
      rightAddDisabled () {
        let flag = false;
        if (this.group.length > 0) {
          let data = this.group.slice(-1)[0].data;
          if (data && data.superCls && data.superCls === '01') {
            flag = true;
          }
        }
        return flag;
      }
    },
    methods: {
      init () {
        this.$http.get(this.url.findAll, (response) => {
          let regexps = response.content;
          let classify = regexps.filter( (v) => {
            return v.superCls === '00';
          });
          let cls_map = {};
          classify.forEach((v) => {
            v.children = [];
            cls_map[v.classify] = v
          });
          regexps.forEach((v) => {
            // 此处的value是与级联选择Cascader关联
            v.value = v.code;
            if (v.superCls !== '00') {
              cls_map[v.superCls].children.push(v)
            }
          });
          classify = classify.map((v) => {
            return cls_map[v.classify]
          });
          this.data = classify;
        })
      },
      handleChange (value, selectedData) {
        let lastData = selectedData.slice(-1)[0];
        let item = this.group[this.index];
        item.data = lastData;
        // 此处的value是group正则表达式输入相关
        item.value = lastData.regexp;
        item = this.inputInit(item);
        this.group.splice(this.index, 1, item);
      },
      locate (index) {
        this.index = index;
      },
      itemTemplate () {
        return {
          data: {
            label: '',
            value: '',
            __label: '请选择',
            __value: ''
          },
          value: ''
        }
      },
      leftAdd () {
        this.group.splice(0, 0, this.itemTemplate());
      },
      leftSubtract () {
        this.group.splice(0, 1);
      },
      rightAdd () {
        this.group.push(this.itemTemplate());
      },
      rightSubtract () {
        this.group.pop();
      },
      inputInit (item) {
        let prefix = '';
        let suffix = '';
        let value = item.value;
        let width = 100;
        let disabled = true;
        switch (item.data.code) {
          case '0006':
            prefix = '[';
            value = '';
            suffix = ']';
            width = 80;
            disabled = false;
            break;
          case '0007':
            prefix = '[^';
            value = '';
            suffix = ']';
            width = 80;
            disabled = false;
            break;
        }
        item.prefix = prefix;
        item.value = value;
        item.suffix = suffix;
        item.width = width;
        item.disabled = disabled;
        return item;
      },
      inputBlur (event) {
        this.group.forEach((v) => {
          console.log(v.value)
        })
      }
    },
    created () {
      this.init();
    },
    mounted () {
      this.group.push(this.itemTemplate());
    }
  }
</script>

<style scoped>

</style>
