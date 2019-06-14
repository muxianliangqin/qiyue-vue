<template>
  <div>
    <Row>
      <Col span="10">
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
                   :clearable="!form.disabled.code"
                   :disabled="form.disabled.code"
                   v-model="form.items.code"
                   :placeholder="form.labels.code"></Input>
          </FormItem>
          <FormItem :label="form.labels.name" prop="name">
            <Input type="text"
                   :clearable="!form.disabled.name"
                   :disabled="form.disabled.name"
                   v-model="form.items.name"
                   :placeholder="form.labels.name"></Input>
          </FormItem>
          <FormItem :label="form.labels.url" prop="url">
            <Input type="text"
                   :clearable="!form.disabled.url"
                   :disabled="form.disabled.url"
                   v-model="form.items.url"
                   :placeholder="form.labels.url"></Input>
          </FormItem>
          <FormItem :label="form.labels.superCode" prop="superCode">
            <Input type="text"
                   :clearable="!form.disabled.superCode"
                   :disabled="form.disabled.superCode"
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
  import ajaxUtil from '@/assets/util/ajaxUtil'
  export default {
    name: "tree",
    props: {
      params: Object
    },
    data () {
      return {
        menuFindAll: '/user/menu/findAll',
        menuRoot: undefined,
        data: [
          {
            name: '根目录',
            code: 'root',
            expand: true,
            selected: false,
            disabled: true,
            state: '0',
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
          url: '',
          labels: {
            code: '菜单编码',
            name: '菜单名称',
            url: '菜单目录',
            superCode: '上级菜单'
          },
          disabled: {
            code: false,
            name: false,
            url: false,
            superCode: false
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
        },
        add: {
          url: 'user/menu/add'
        },
        modify: {
          url: 'user/menu/modify'
        },
        del: {
          url: 'user/menu/del'
        },
        stop: {
          url: 'user/menu/stop'
        },
        restart: {
          url: 'user/menu/restart'
        },
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
        ajaxUtil.ajax(this.menuFindAll).done((response) => {
          this.menuRoot = response.content;
          this.checkbox = this.params.checkbox;
          this.expand = this.params.expand;
          this.data[0].children = this.menuNodeToTreeNode(this.menuRoot.children, this.checkbox, this.expand);
        });
      },
      menuNodeToTreeNode (menuNodes, checkbox, expand) {
        let treeNode = [];
        menuNodes.forEach((v) => {
          let node = {
            id: v.element.id,
            name: v.element.name,
            code: v.element.code,
            url: v.element.url,
            superCode: v.element.superCode,
            state: v.element.state,
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
        let name = h('span', {
          attrs: {
            class: 'ivu-tree-title ' + (data.selected?'ivu-tree-title-selected':'')
          },
          on: {
            click (e) {
              self.form.title = '【' + data.name + '】修改';
              self.form.url = self.modify.url;
              for (let i=0;i<root.length;i++) {
                root[i].node.selected = false;
              }
              data.selected = true
              if (data.code !== 'root') {
                self.form.operate = true;
                self.form.items.code = data.code;
                self.form.items.name = data.name;
                self.form.items.superCode = data.superCode;
                self.form.items.url = data.url;
                self.form.disabled.code = true;
                self.form.disabled.superCode = true;
                self.form.disabled.name = false;
                self.form.disabled.url = false;
                self.form.extraParams = {
                  id: data.id
                }
              } else {
                self.form.operate = false;
                self.$Notice.warning({
                  title: '根目录不允许修改'
                })
              }
            }
          }
        }, data.code + '-' + data.name);
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: data.children?'ios-folder-outline':'ios-menu'
              },
              style: {
                marginRight: '8px'
              }
            }),
            name,
            h('Icon', {
              props: {
                type: data.state === '0'?'md-checkmark-circle':'md-close-circle'
              },
              style: {
                marginLeft: '8px'
              }
            })
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
                width: data.code === 'root'?'100px':'auto',
              },
              on: {
                click: (e) => {
                  this.append(root, node, data);
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'md-swap',
              }),
              style: {
                marginRight: '8px',
                display: data.code === 'root'?'none':'inline-block',
              },
              on: {
                click: (e) => {
                  this.swap(data);
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
        this.form.operate = true;
        this.form.title = '【' + data.name + '】新增子菜单';
        this.form.url = this.add.url;
        this.form.operate = true;
        this.form.items.code = '';
        this.form.items.superCode = '';
        this.form.items.name = '';
        this.form.items.url = '';
        this.form.disabled.code = false;
        this.form.disabled.superCode = true;
        this.form.disabled.name = false;
        this.form.disabled.url = false;
        for (let i=0;i<root.length;i++) {
          root[i].node.selected = false;
        }
        data.selected = true;
        this.form.items.code = this.generateCode(root, data.code);
        this.form.items.superCode = data.code;
      },
      swap (data) {
        let params = {
          id: [data.id]
        };
        let url = '';
        if (data.state === '0') {
          url = this.stop.url;
        } else {
          url = this.restart.url;
        }
        ajaxUtil.initAfterAjax(this, url, params, {traditional: true});
      },
      remove (root, node, data) {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        let params = {
          id: data.id
        };
        let url = this.del.url;
        ajaxUtil.initAfterAjax(this, url, params);
      },
      generateCode (root, code) {
        let regexp = /^([A-z]+)(\d+)$/;
        let regRes = regexp.exec(code);
        let prefix = regRes[1];
        let num = regRes[2];
        let reg = new RegExp('^' + prefix + '(\\d+)$');
        let indexes = root.filter(v => {
          return reg.exec(v.node.code)
        }).map(v => {
          return parseInt(reg.exec(v.node.code)[1])
        }).sort((a,b) => {return b-a});
        num = indexes[0];
        num = num + 1 + "";
        while ((prefix.length + num.length) < 4) {
          num = "0" + num;
        }
        return prefix + num;
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = this.form.url;
            let params = this.form.items;
            params = Object.assign(params, this.form.extraParams);
            ajaxUtil.initAfterAjax(this, url, params);
          } else {
            this.$Notice.error({
              title: '校验不通过，请重新填写'
            });
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
    },
    created () {
      this.init();
    }
  }
</script>

<style scoped>

</style>
