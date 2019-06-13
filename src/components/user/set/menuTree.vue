<template>
  <div>
    <Row>
      <Col span="8">
        <Tree :data="data"
              :show-checkbox="showCheckbox"
              :render="renderContent"
              style="text-align: left"></Tree>
      </Col>
      <Col span="8">
        <Form ref="form"
              :model="form.items"
              :rules="form.rules"
              v-if="form.operate"
              :label-width="150">
          <FormItem :label="form.labels.code" prop="code">
            <Row>
              <Col span="15">
                <Input type="text"
                       clearable
                       v-model="form.items.code"
                       :placeholder="form.labels.code"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem :label="form.labels.name" prop="name">
            <Row>
              <Col span="15">
                <Input type="text"
                       clearable
                       v-model="form.items.name"
                       :placeholder="form.labels.name"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem :label="form.labels.url" prop="url">
            <Row>
              <Col span="15">
                <Input type="text"
                       clearable
                       v-model="form.items.url"
                       :placeholder="form.labels.url"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem :label="form.labels.superCode" prop="superCode">
            <Row>
              <Col span="15">
                <Input type="text"
                       clearable
                       v-model="form.items.superCode"
                       :placeholder="form.labels.superCode"></Input>
              </Col>
            </Row>
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
            selected: true,
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
            superCode: v.element.superCode
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
            h('span', {
              on: {
                doubleClick () {
                  self.form.operate = true
                },
                click (e) {
                  $(e).addClass('ivu-tree-title-selected')
                }
              }
            }, data.name)
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
                click: () => { this.append(root, node, data) }
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
        data.selected = true;
        this.form.operate = true;
        let code = data.code;
        let regexp = /^([A-z]+)(\d+)$/;
        let result = regexp.exec(code);
        this.form.items.code = this.generateCode(result[1],result[2]);
        this.form.items.superCode = data.code;

        /*const children = data.children || [];
        children.push({
          name: 'appended node',
          expand: true
        });
        this.$set(data, 'children', children);*/
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
      }
    },
    created () {
      this.init();
    }
  }
</script>

<style scoped>

</style>
