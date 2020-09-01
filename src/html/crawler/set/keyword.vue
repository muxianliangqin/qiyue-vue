<template>
  <div style="text-align: left">
    <div :style="{height: splitHeight + 'px'}">
      <Split v-model="split1">
        <div slot="left" :style="splitStyle">
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
                <Cascader :data="regexp.data" trigger="hover"
                          :clearable="false" :value="item.default"
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
                         :disabled="item.disabled" @on-blur="generateRegexp"/>
                  <span v-if="item.suffix">{{ item.suffix }}</span>
                </div>
              </Tooltip>
            </template>
            <Tooltip :content="modifier.data.desc"
                     placement="top">
              <Select multiple v-model="modifier.values" @on-change="generateRegexp">
                <Option v-for="item in modifier.data.children"
                        :value="item.regexp" :key="item.regexp">
                  {{ item.label }}
                </Option>
              </Select>
            </Tooltip>
          </div>
          <Divider></Divider>
          <SystemForm :fields="form.fields" :extraParams="form.extraParams"
                    :url="url.keywordAdd" :ref="ref.form">
          </SystemForm>
        </div>
        <div slot="right" style="padding-left: 10px;text-align: center;">
          <Input v-model="test.text" type="textarea"
                 style="margin-bottom: 12px"
                 :rows="4" placeholder="文本测试区" />
          <Button type="primary" style="margin-bottom: 12px" @click="regexpTest">测试</Button>
          <Table :border="true"
                 :columns="test.columns"
                 :data="test.data"
                 :show-header="false"
                 :stripe="true"
                 :highlight-row="true"
                 size="small">
          </Table>
        </div>
      </Split>
    </div>
  </div>
</template>

<script>
  export default {
    name: "keyword",
    props: {
      params: {type: Object, default: undefined}
    },
    data () {
      return {
        split1: 0.5,
        splitHeight: this.$store.getters.tabs.height,
        url: {
          findAll: '/crawler/regexp/regexpFindAll',
          keywordAdd: '/crawler/regexp/keywordAdd'
        },
        ref: {
          form: 'form'
        },
        index: 0,
        group: [],
        regexp: {
          data: [],
        },
        modifier: {
          data: {},
          values: ['g']
        },
        form: {
          fields: [
            {key: 'name', value: '正则表达式', label: '名称'},
            {key: 'regexp', value: '', label: '正则表达式'},
          ],
          extraParams: {}
        },
        test: {
          text: '',
          regexp: '',
          data: [],
          columns: [
            {title: '序号',type: 'index',width: 40},
            {title: '匹配值', key: 'value'}
          ]
        }
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
          if (data.superCls && data.superCls === '01') {
            flag = true;
          }
        }
        return flag;
      },
      splitStyle () {
        return {
          maxHeight: this.$store.getters.tabs.height - 50 + 'px',
          overflowY: 'auto'
        }
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
            if (v.code === '0041') {
              v.children = [
                {value: '004101', label: '左', regexp: '('},
                {value: '004102', label: '右', regexp: ')'},
              ]
            }
            if (v.superCls !== '00') {
              cls_map[v.superCls].children.push(v)
            }
          });
          classify = classify.map((v) => {
            return cls_map[v.classify]
          });
          let idx = 0;
          for (let i=0;i<classify.length;i++) {
            if (classify[i].classify === '01') {
              idx = i;
            }
          }
          this.modifier.data = classify[idx];
          classify.splice(idx, 1);
          this.regexp.data = classify;
          this.initCodes()
        })
      },
      initCodes () {
        if (this.params.row) {
          let codes = JSON.parse(this.params.row.codes);
          let regexp = codes.regexp;
          let modifier = codes.modifier;
          this.group = [];
          regexp.forEach((v) => {
            this.group.push({
              data: {
                label: '',
                value: '',
                desc: '',
                __label: '',
                __value: ''
              },
              value: '',
              default: v
            })
          });
        }
      },
      handleChange (value, selectedData) {
        let lastData = selectedData.slice(-1)[0];
        let item = this.group[this.index];
        item.data = lastData;
        // 此处的value是group正则表达式输入相关
        item.value = lastData.regexp;
        item = this.inputInit(item);
        this.group.splice(this.index, 1, item);
        this.generateRegexp();
      },
      locate (index) {
        this.index = index;
      },
      itemTemplate () {
        return {
          data: {
            label: '',
            value: '',
            desc: '',
            __label: '',
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
            break;
          case '0007':
            prefix = '[^';
            value = '';
            suffix = ']';
            break;
          case '0031':
            value = '+';
            break;
          case '0032':
            value = '*';
            break;
          case '0033':
            value = '?';
            break;
          case '0034':
            prefix = '{';
            value = '';
            suffix = '}';
            break;
          case '0035':
            prefix = '{';
            value = '';
            suffix = ',}';
            break;
          case '0036':
            prefix = '{';
            value = 'x,y';
            suffix = '}';
            break;
          case '0037':
            value = '';
            suffix = '$';
            break;
          case '0038':
            prefix = '?=';
            value = '';
            break;
          case '0039':
            prefix = '?!';
            value = '';
            break;
          case '0045':
            value = '';
            disabled = false;
            break;
          default:
            break;
        }
        if (prefix !== '') {
          width = width - prefix.length * 10 - 5;
          disabled = false;
        }
        if (suffix !== '') {
          width = width - suffix.length * 10 - 5;
          disabled = false;
        }
        item.prefix = prefix;
        item.value = value;
        item.suffix = suffix;
        item.width = width;
        item.disabled = disabled;
        return item;
      },
      generateRegexp () {
        let regexp = '/';
        let regexp_codes = [];
        this.group.forEach((v) => {
          let arr = v.data.__value.split(',');
          regexp_codes.push(arr);
          if (v.prefix) {
            regexp = regexp + v.prefix;
          }
           if (v.value) {
            regexp = regexp + v.value;
          }
           if (v.suffix) {
            regexp = regexp + v.suffix;
          }
        });
        regexp = regexp + '/';
        let modifier = this.modifier.values.join('');
        regexp = regexp + modifier;
        this.$refs[this.ref.form].updateField('regexp', regexp);
        this.test.regexp = regexp;
        let codes = {regexp: regexp_codes, modifier: this.modifier.values};
        this.form.extraParams = {
          codes: JSON.stringify(codes),
        };
      },
      regexpTest () {
        this.test.data = [];
        let re = eval(this.$refs[this.ref.form].items.regexp);
        let result = this.test.text.match(re);
        if (result) {
          result.forEach((v) => {
            this.test.data.push({value: v})
          });
        }
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
