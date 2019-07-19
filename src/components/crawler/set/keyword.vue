<template>
  <div style="text-align: left">
    <div>
      <ButtonGroup>
        <Button icon="md-add" @click="leftAdd()"></Button>
        <Button icon="md-remove" @click="leftSubtract()"
                :disabled="subtractDisabled"></Button>
      </ButtonGroup>
      <template v-for="(item, index) in group">
        <Tooltip :content="item['data']['__label']"
                 style="margin: 0px 0px"
                 placement="top" :key="index">
          <Cascader :data="data" trigger="hover" :clearable="false"
                    @on-visible-change="locate(index)"
                    @on-change="handleChange"
                    style="display: inline-block;width: 100px">
          </Cascader>
        </Tooltip>
      </template>
      <ButtonGroup>
        <Button icon="md-add" @click="rightAdd()"></Button>
        <Button icon="md-remove" @click="rightSubtract()"
                :disabled="subtractDisabled"></Button>
      </ButtonGroup>
    </div>
    <div style="margin:10px 92px;">
      <template v-for="(item, index) in group">
        <Tooltip :content="item.self.value"
                 placement="top">
          <div :key="index"
               style="width: 100px;display: inline-block;text-align: center;"
               v-if="item.data.value === 'literals'">
            <span style="width: 10px;">(</span>
            <Input v-model="item.self.value"
                   :placeholder="item.data.label"
                   style="width: 80px"/>
            <span style="width: 10px;">)</span>
          </div>
          <div :key="index"
               style="width: 100px;display: inline-block;text-align: center;"
               v-else>
            <Input v-model="item.self.value"
                   :placeholder="item.data.label"
                   disabled/>
          </div>
        </Tooltip>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "keyword",
    data () {
      return {
        index: 0,
        group: [],
        data: [
          {
            value: 'char',
            label: '字符',
            children: [
              {
                value: 'literals',
                label: '字面值',
              },
              {
                value: 'digit',
                label: '数字',
              },
              {
                value: 'letter',
                label: '字母',
                children: [
                  {
                    value: 'lower',
                    label: '小写',
                  },
                  {
                    value: 'upper',
                    label: '大写',
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    computed: {
      subtractDisabled () {
        return this.group.length === 1;
      }
    },
    methods: {
      handleChange (value, selectedData) {
        let lastData = selectedData.slice(-1)[0];
        let item = this.group[this.index];
        item.data = lastData;
        switch (lastData.value) {
          case 'digit': item.self.value = '[\\d]';break;
        }
        this.group.splice(this.index,1,item);
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
          self: {
            value: ''
          }
        }
      },
      leftAdd () {
        this.group.splice(0,0,this.itemTemplate());
      },
      leftSubtract () {
        this.group.splice(0,1);
      },
      rightAdd () {
        this.group.push(this.itemTemplate());
      },
      rightSubtract () {
        this.group.pop();
      }
    },
    mounted () {
      this.group.push(this.itemTemplate());
    }
  }
</script>

<style scoped>

</style>
