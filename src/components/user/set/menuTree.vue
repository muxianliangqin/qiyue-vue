<template>
  <div>
    <Row>
      <Col span="8">
        <Tree :data="data"
              :show-checkbox="showCheckbox"
              :render="renderContent"
              style="text-align: left"></Tree>
      </Col>
      <Col span="8" v-if="form.operate">
        <Divider>{{form.title}}</Divider>
        <Form ref="form"
              :model="form.items"
              :rules="form.rules"
              :label-width="100">
          <FormItem :label="form.labels.code" prop="code">
            <Input type="text"
                   clearable
                   v-model="form.items.code"
                   :placeholder="form.labels.code"></Input>
          </FormItem>
          <FormItem :label="form.labels.name" prop="name">
            <Input type="text"
                   clearable
                   v-model="form.items.name"
                   :placeholder="form.labels.name"></Input>
          </FormItem>
          <FormItem :label="form.labels.url" prop="url">
            <Input type="text"
                   clearable
                   v-model="form.items.url"
                   :placeholder="form.labels.url"></Input>
          </FormItem>
          <FormItem :label="form.labels.superCode" prop="superCode">
            <Input type="text"
                   clearable
                   v-model="form.items.superCode"
                   :placeholder="form.labels.superCode"></Input>
          </FormItem>
          <FormItem :label-width="0" style="text-align: center;margin-bottom: 0px;">
            <Button type="primary" @click="handleSubmit('form')">提交</Button>
            <Button @click="handleReset('form')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: "tree",
    props: {
      params: Object
    },
    data () {
      return {
        menuRoot: this.$store.getters.menuRoot,
        data: [
          {
            name: '根目录',
            code: 'root',
            expand: true,
            selected: false,
            disabled: true,
            children: []
          }
        ],
        buttonProps: {
          type: 'default',
          size: 'small',
        },
        checkbox: false,
        expand: undefined,
        form: {
          operate: false,
          title: '',
          labels: {
            code: '菜单编码',
            name: '菜单名称',
            url: '菜单目录',
            superCode: '上级菜单'
          },
          items: {
            code: '',
            name: '',
            url: '',
            superCode: ''
          },
          rules: {
            code: [
              {required: true, message: '请输入菜单编码', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '请输入菜单名称', trigger: 'blur'}
            ],
            url: [
              {required: false, message: '请输入菜单目录', trigger: 'blur'}
            ],
            superCode: [
              {required: false, message: '请输入上级菜单', trigger: 'blur'}
            ]
          },
          extraParams: {}
        }
      }
    },
    computed: {
      showCheckbox () {
        if (this.checkbox instanceof Boolean) {
          return this.checkbox
        } else if (this.checkbox instanceof Array) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      init () {
        let menuRoot = this.menuRoot;
        this.checkbox = this.params.checkbox
        this.expand = this.params.expand
        this.data[0].children = this.menuNodeToTreeNode(menuRoot.children, this.checkbox, this.expand);
      },
      menuNodeToTreeNode (menuNodes, checkbox, expand) {
        let treeNode = [];
        menuNodes.forEach((v) => {
          let node = {
            name: v.element.name,
            code: v.element.code,
            url: v.element.url,
            superCode: v.element.superCode,
            selected: false
          };
          if (checkbox instanceof Array && checkbox.indexOf(v.element.code) >= 0) {
            node.check = true
          } else {
            node.check = false
          }
          if (expand instanceof Array && expand.indexOf(v.element.code) >= 0) {
            node.expand = true
          } else if (expand === true) {
            node.expand = true
          } else {
            node.expand = false
          }
          if (v.hasChild) {
            node.children = this.menuNodeToTreeNode(v.children, checkbox, expand);
          }
          treeNode.push(node);
        });
        return treeNode;
      },
      renderContent (h, { root, node, data }) {
        let self = this;
        let _root = root
        let _data = data
        let _node = node
        let name = h('span', {
          attrs: {
            class: 'ivu-tree-title ' + (_data.selected?'ivu-tree-title-selected':'')
          },
          on: {
            click (e) {
              self.form.title = '【' + _data.name + '】修改';
              for (let i=0;i<_root.length;i++) {
                _root[i].node.selected = false;
              }
              if (_data.code !== 'root') {
                const parentKey = _root.find(el => el === _node).parent;
                const parent = _root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(_data);
                self.form.operate = true
                self.form.items.code = _data.code;
                self.form.items.name = _data.name;
                self.form.items.superCode = _data.superCode;
                self.form.items.url = _data.url;
                _data.selected = true;
                parent.children.splice(index, 1, _data);
              } else {
                _data.selected = true
              }
            }
          }
        }, data.name)
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            name
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add',
                type: data.code === 'root'?'primary':'default'
              }),
              style: {
                marginRight: data.code === 'root'?'0':'8px',
                width: data.code === 'root'?'64px':'auto',
              },
              on: {
                click: (e) => {
                  this.append(root, node, data);
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-remove'
              }),
              style: {
                display: data.code === 'root'?'none':'inline-block',
              },
              on: {
                click: () => { this.remove(root, node, data) }
              }
            })
          ])
        ]);
      },
      append (root, node, data) {
        for (let i=0;i<root.length;i++) {
          root[i].node.selected = false;
        }
        if (data.code !== 'root') {
          const parentKey = root.find(el => el === node).parent;
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          parent.selected = true;
          this.form.operate = true;
          let code = data.code;
          let regexp = /^([A-z]+)(\d+)$/;
          let result = regexp.exec(code);
          this.form.items.code = this.generateCode(result[1],result[2]);
          this.form.items.superCode = data.code;
          this.form.items.name = data.name;
          this.form.items.url = data.url;
          this.form.title = '【' + parent.name + '】新增';
          parent.children.splice(index, 1, data);
        } else {
          data.selected = true;
          this.form.title = '【' + data.name + '】新增';
          this.form.operate = true;
          this.form.items.code = '';
          this.form.items.superCode = '';
          this.form.items.name = '';
          this.form.items.url = '';
        }
      },
      remove (root, node, data) {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        parent.children.splice(index, 1);
      },
      generateCode (prefix, num) {
        num = parseInt(num);
        num = num + 1 + "";
        while ((prefix.length + num.length) < 4) {
          num = "0" + num;
        }
        return prefix + num;
      },
      setNewData(root, node, data, newData) {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        parent.children.splice(index, 1, newData);
      }
    },
    created () {
      this.init();
    }
  }
</script>

<style scoped>

</style>
