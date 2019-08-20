<template>
  <div>
    <Row>
      <Col span="10">
        <Tree :data="data"
              ref="menuTree"
              :show-checkbox="showCheckbox"
              :render="renderContent"
              @on-check-change="checked"
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
            <Button type="primary" @click="handleSubmit('form')">确认</Button>
            <Button @click="handleReset('form')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Col>
      <Col span="8" v-if="userMenus.show">
        <Divider>确定更改用户菜单权限吗？</Divider>
        <h3 style="text-align: left;">已选择菜单</h3>
        <row>
          <Col span="6" v-for="v in userMenus.checkedBoxes"
               :key="v.id"
               style="text-align: left;padding: 8px 0px">
            {{v.name}}
          </Col>
        </row>
        <p style="padding-top: 20px">
          <Button type="primary" @click="userMenusSubmit()">确认</Button>
          <Button @click="userMenusReset()" style="margin-left: 8px">重置</Button>
        </p>
      </Col>
      <Col span="8" v-if="menuLoan.show">
        <Divider>确定更改用户菜单权限吗？</Divider>
        <h3 style="text-align: left;">你的菜单【{{menuLoan.menuCode + '-' + menuLoan.menuName}}】</h3>
        <h3 style="text-align: left;">租借权限给用户{{menuLoan.loanUserIds}}</h3>
        <Row>
          <Col span="6" style="text-align: left;padding: 8px 0px">
            <Select v-model="menuLoan.loanUserIds" multiple style="width:200px">
              <Option v-for="item in menuLoan.users" :value="item.id" :key="item.id">{{ item.username }}</Option>
            </Select>
          </Col>
        </Row>
        <p style="padding-top: 20px">
          <Button type="primary" @click="menuLoanSubmit()">确认</Button>
        </p>
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
        initTreeData: [],
        userMenus: {
          show: false,
          checkedBoxes: [],
          initChecked: [],
        },
        menuLoan: {
          show: false,
          userId: this.params.userId,
          users: [],
          menuCode: '',
          menuName: '',
          loanUserIds: []
        },
        data: [
          {
            name: '根目录',
            code: 'root',
            expand: true,
            selected: false,
            disabled: true,
            state: '0',
            checked: false,
            children: []
          }
        ],
        buttonProps: {
          type: 'default',
          size: 'small',
        },
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
          url: 'user/menu/delBatch'
        },
        stop: {
          url: 'user/menu/stopBatch'
        },
        restart: {
          url: 'user/menu/restartBatch'
        },
        url: {
          menu: {
            findAll: 'user/menu/findAll',
            add: 'user/menu/add',
            modify: 'user/menu/modify',
            del: 'user/menu/delBatch',
            stop: 'user/menu/stopBatch',
            restart: 'user/menu/restartBatch'
          },
          setUserMenus: 'user/user/setUserMenus',
          findUserMenus: 'user/user/findUserMenus',
          findAllUser: 'user/user/findAll',
          menuLoanAddBatch: 'user/menuLoan/addBatch'
        }
      }
    },
    computed: {
      showCheckbox () {
        return !this.params.edit
      },
      loanUser () {
        this.menuLoan.loanUserIds
      }
    },
    methods: {
      async init () {
        let edit = this.params.edit;
        let checked = undefined;
        if (!edit) {
          let param = {
            userId: this.params.userId
          };
          let response = await this.$axios.ajax(this.url.findUserMenus, param);
          checked = response.data.content;
          checked = checked.map(v => {
            return v.menuCode
          });
        }
        this.$axios.ajax(this.menuFindAll).then((response) => {
          this.menuRoot = response.data.content;
          let nodeTree = this.menuNodeToTreeNode(this.menuRoot.children,
            checked,
            edit
            );
          this.data[0].checked = false;
          this.data[0].children = nodeTree;
          this.initTreeData = JSON.parse(JSON.stringify(this.data));
        });
        this.$axios.ajax(this.url.findAllUser).then((response) => {
          this.menuLoan.users = response.data.content.filter(v => { return v.id !== this.params.userId })
        });
      },
      menuNodeToTreeNode (menuNodes, checked, edit) {
        let treeNode = [];
        menuNodes.forEach((v) => {
          let node = {
            id: v.element.id,
            name: v.element.name,
            code: v.element.code,
            url: v.element.url,
            superCode: v.element.superCode,
            state: v.element.state,
            menuLoan: v.element.menuLoanEntities,
            selected: false,
            expand: edit,
            checked: false,
            edit: edit
          };
          if (checked instanceof Array && checked.indexOf(v.element.code) >= 0) {
            node.expand = true;
            if (!v.hasChild) {
              node.checked = true;
            }
          }
          if (v.hasChild) {
            node.children = this.menuNodeToTreeNode(v.children, checked, edit);
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
              for (let i=0;i<root.length;i++) {
                root[i].node.selected = false;
              }
              data.selected = true;
              if (data.edit) {
                self.form.title = '【' + data.name + '】修改';
                self.form.url = self.modify.url;
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
              } else {
                data.expand = !data.expand;
                if (data.children) {
                  self.menuLoan.show = false
                } else {
                  self.menuLoan.menuName = data.name;
                  self.menuLoan.menuCode = data.code;
                  self.menuLoan.loanUserIds = data.menuLoan.filter(v => {return v.userId === self.params.userId})
                    .map(v => { return v.loanUserId });
                  self.menuLoan.show = true
                }
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
              display: data.edit?'inline-block':'none',
              // display: 'inline-block',
              float: 'right',
              marginRight: '32px',
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
        for (let i=0;i<root.length;i++) {
          root[i].node.selected = false;
        }
        data.selected = true;
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
        this.form.items.code = this.generateCode(root, data.code);
        this.form.items.superCode = data.code;
      },
      swap (data) {
        let params = {
          ids: this.getAllIdFromData(data)
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
          ids: this.getAllIdFromData(data)
        };
        let url = this.del.url;
        if (confirm('确认删除菜单【' + data.name + '】' + (data.children?'及其子菜单':'') + '吗？')) {
          ajaxUtil.initAfterAjax(this, url, params, {traditional: true});
        }
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
      getAllIdFromData (data) {
        let ids = [data.id];
        if (data.children && data.children.length !== 0) {
          data.children.forEach(v => {
            ids = ids.concat(this.getAllIdFromData(v))
          })
        }
        return ids;
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
      checked (datas) {
        this.userMenus.checkedBoxes = this.$refs.menuTree.getCheckedAndIndeterminateNodes();
        this.userMenus.show = true;
      },
      userMenusSubmit () {
        let data = this.userMenus.checkedBoxes;
        let userMenus = data.map(v => {
          return {
            menuCode: v.code,
            userId: this.params.userId
          }
        });
        let params = {
          userMenuEntities: JSON.stringify(userMenus)
        };
        this.$axios.reloadAfterRequest(this, this.url.setUserMenus, params);
        this.getCheckedBoxes();
      },
      getCheckedBoxes () {
        let param = {
          userId: this.params.userId
        };
        this.$axios.ajax(this.url.findUserMenus, param).then((response) => {
          let codes = response.data.content;
          codes = codes.map(v => {
            return v.menuCode
          });
          this.userMenus.checkedBoxes = codes
        });
      },
      userMenusReset () {
        let initData = JSON.parse(JSON.stringify(this.initTreeData));
        this.$set(this, 'data', initData);
        this.userMenus.show = false;
      },
      menuLoanSubmit () {
        let menuLoanEntities = this.menuLoan.loanUserIds.map(v => {
          return {
            userId: this.menuLoan.userId,
            menuCode: this.menuLoan.menuCode,
            loanUserId: v
          }
        });
        let params = {
          menuLoanEntities: JSON.stringify(menuLoanEntities)
        };
        this.$axios.reloadAfterRequest(this, this.url.menuLoanAddBatch, params);
      },
      reload () {
        this.init();
      }
    },
    created () {
      this.init();
    },
    watch: {
      'params' () {
        this.init()
      }
    }
  }
</script>

<style scoped>

</style>
