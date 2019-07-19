<template>
  <div class="self-root-div">
    <Table :border="false"
           :columns="columns"
           :data="data"
           :show-header="true"
           :stripe="false"
           :highlight-row="true"
           :style="{border: 'none'}"
           :max-height="tableHeight"
           size="small">
    </Table>
  </div>
</template>

<script>
  export default {
    name: "regexp",
    data () {
      return {
        url: '/crawler/regexp/findAll',
        data: [],
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h('CrawlerSetRegexpExpand', {
                props: {
                  row: params.row
                },
                style: {
                  marginTop: '5px',
                  marginBottom: '5px',
                }
              })
            }
          },
          {
            title: '序号',
            type: 'index',
            width: 70
          },
          {
            title: '正则表达式',
            key: 'regexp',
            width: 150,
            render: (h,params) => {
              return h('span',{
                style:{
                  fontWeight:'bolder'
                }
              },params.row.regexp)
            }
          },
          {
            title: '说明',
            key: 'desc'
          }
        ]
      }
    },
    computed: {
      tableHeight () {
        return this.$store.getters.tabs.height - 48
      }
    },
    methods: {
      init () {
        this.$axios.ajax(this.url).then((response) => {
          let regexps = response.data.content;
          let classify = regexps.filter( (v) => {
            return v.superCls === '00';
          });
          let cls_map = {};
          classify.forEach((v) => {
            v.children = [];
            cls_map[v.classify] = v
          });
          regexps.forEach((v) => {
            if (v.superCls !== '00') {
              cls_map[v.superCls].children.push(v)
            }
          });
          classify = classify.map((v) => {
            return cls_map[v.classify]
          });
          this.data = classify;
        })
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>

</style>
