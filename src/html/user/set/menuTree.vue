<template>
  <div :style="{height: splitHeight + 'px'}">
    <Split v-model="split1">
      <div slot="left">
        <Tree :data="data"
              ref="menuTree"
              :show-checkbox="showCheckbox"
              :render="renderContent"
              @on-check-change="checked"
              style="text-align: left"></Tree>
      </div>
      <div slot="right" style="padding-left: 20px">
        <div v-if="form.operate">
          <Divider>{{form.title}}</Divider>
          <SelfForm :url="form.url" :title="form.title" :ref="ref.form"
                    :fields="form.fields" :extraParams="form.extraParams"
                    @form-ok="reload">
          </SelfForm>
        </div>
        <div v-if="userMenus.show">
          <Divider>确定更改用户菜单权限吗？</Divider>
          <div v-if="userMenus.addChecked.length > 0">
            <h3 style="text-align: left;">添加菜单</h3>
            <row>
              <Col span="6" v-for="v in userMenus.addChecked"
                   :key="v.id"
                   style="text-align: left;padding: 8px 0px">
                {{v.name}}
              </Col>
            </row>
          </div>
          <div v-if="userMenus.subtractChecked.length > 0">
            <h3 style="text-align: left;">删除菜单</h3>
            <row>
              <Col span="6" v-for="v in userMenus.subtractChecked"
                   :key="v.id"
                   style="text-align: left;padding: 8px 0px">
                {{v.name}}
              </Col>
            </row>
          </div>
          <p style="padding-top: 20px">
            <Button type="primary" @click="userMenusSubmit()">确认</Button>
            <Button @click="userMenusReset()" style="margin-left: 8px">重置</Button>
          </p>
        </div>
        <div v-if="menuLoan.show">
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
        </div>
      </div>
    </Split>
  </div>
</template>

<script>
  export default {
    name: "tree",
    props: {
      params: Object
    },
    data () {
      return {
        split1: 0.5,
        splitHeight: this.$store.getters.tabs.height,
        menuRoot: undefined,
        initTreeData: [],
        userMenus: {
          show: false,
          initChecked: [],
          // checkedBoxes: [],
          addChecked: [],
          subtractChecked: [],
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
          fields: [
            {key: 'code', value: '', label: '菜单编码', disabled: false},
            {key: 'name', value: '', label: '菜单名称', disabled: false},
            {key: 'url', value: '', label: '菜单目录', disabled: false},
            {key: 'superCode', value: '', label: '上级菜单', disabled: false},
          ],
          extraParams: {}
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
        },
        ref: {
          form: 'form'
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
      // 异步改为同步，配合await使用
      async init () {
        // 是否可编辑标志，true表示对菜单新增修改删除等操作
        let edit = this.params.edit;
        // 是否选中，表示用户拥有菜单的权限
        let checked = undefined;
        if (!edit) {
          let param = {
            userId: this.params.userId
          };
          let response = await this.$http.axios.post(this.url.findUserMenus, param);
          checked = response.content;
          checked = checked.map(v => {
            return v.menuCode
          });
          this.userMenus.initChecked = checked;
        }
        this.$http.get(this.url.menu.findAll, (response) => {
          this.menuRoot = response.content;
          let nodeTree = this.menuNodeToTreeNode(this.menuRoot.children, checked, edit);
          this.data[0].children = nodeTree;
          this.initTreeData = JSON.parse(JSON.stringify(this.data));
        });
        this.$http.get(this.url.findAllUser, (response) => {
          this.menuLoan.users = response.content.filter(v => { return v.id !== this.params.userId })
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
        let name = h('span', {
          attrs: {
            class: 'ivu-tree-title ' + (data.selected?'ivu-tree-title-selected':'')
          },
          on: {
            click: () => {
              for (let i=0;i<root.length;i++) {
                root[i].node.selected = false;
              }
              data.selected = true;
              if (data.edit) {
                this.form.title = '【' + data.name + '】修改';
                this.form.url = this.url.menu.modify;
                if (data.code !== 'root') {
                  this.form.operate = true;
                  this.form.fields.forEach((v) => {v.value = data[v.key]});
                  this.form.fields[0].disabled = true;
                  this.form.fields[1].disabled = false;
                  this.form.fields[2].disabled = false;
                  this.form.fields[3].disabled = false;
                  if (this.$refs[this.ref.form]) {
                    this.$refs[this.ref.form].updateFields();
                  }
                  this.form.extraParams = {id: data.id};
                } else {
                  this.form.operate = false;
                  this.$Notice.warning({
                    title: '根目录不允许修改'
                  })
                }
              } else {
                data.expand = !data.expand;
                if (data.children) {
                  this.menuLoan.show = false
                } else {
                  this.menuLoan.menuName = data.name;
                  this.menuLoan.menuCode = data.code;
                  this.menuLoan.loanUserIds = data.menuLoan
                    .filter(v => {return v.userId === this.params.userId})
                    .map(v => { return v.loanUserId });
                  this.menuLoan.show = true
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
        this.form.url = this.url.menu.add;
        this.form.fields.forEach((v) => {v.value = data[v.key]});
        this.form.fields[0].value = this.generateCode(root, data.code);
        this.form.fields[3].value = data.code;
        this.form.fields[0].disabled = false;
        this.form.fields[1].disabled = false;
        this.form.fields[2].disabled = false;
        this.form.fields[3].disabled = true;
        if (this.$refs[this.ref.form]) {
          this.$refs[this.ref.form].updateFields();
        }
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
        this.$http.postWithFull(url, params, this);
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
          this.$http.postWithFull(url, params, this);
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
      getNodeFromTreeByCode (treeData, code) {
        let node = undefined;
        for (let i=0;i<treeData.length;i++) {
          if (treeData[i].code === code) {
            node = treeData[i];
          } else if (treeData[i].children) {
            node = this.getNodeFromTreeByCode(treeData[i].children, code);
          }
          if (node) {
            return node;
          } else {
            continue;
          }
        }
      },
      checked (data) {
        // 点击复选框
        let checkedBoxes = this.$refs.menuTree.getCheckedAndIndeterminateNodes();
        checkedBoxes = checkedBoxes.map((v) => {return v.code});
        let initChecked = this.userMenus.initChecked;
        let subtractChecked = [];
        let addChecked = [];
        for (let i=0;i<initChecked.length;i++) {
          let x = initChecked[i];
          if (!checkedBoxes.includes(x)) {
            subtractChecked.push(x);
          }
        }
        for (let j=0;j<checkedBoxes.length;j++) {
          let y = checkedBoxes[j];
          if (y!=='root' && !initChecked.includes(y)) {
            addChecked.push(y);
          }
        }
        this.userMenus.subtractChecked = subtractChecked.map((v) => {
          return this.getNodeFromTreeByCode(this.initTreeData, v);
        });
        this.userMenus.addChecked = addChecked.map((v) => {
          return this.getNodeFromTreeByCode(this.initTreeData, v);
        });
        this.userMenus.show = true;
      },
      userMenusSubmit () {
        let addChecked = this.userMenus.addChecked;
        let subtractChecked = this.userMenus.subtractChecked;
        let addMenus = addChecked.map(v => {
          return {menuCode: v.code, userId: this.params.userId};
        });
        let subtractMenu = subtractChecked.map(v => {
          return v.code;
        });
        let params = {
          menus: JSON.stringify({addMenus: addMenus, subtractMenus: subtractMenu})
        };
        this.$http.postWithFull(this.url.setUserMenus, params, this);
        this.reload();
        this.userMenus.show = false;
        this.userMenus.addChecked = [];
        this.userMenus.subtractChecked = [];
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
        this.$http.postWithFull(this.url.menuLoanAddBatch, params, this);
        this.reload()
      },
      reload () {
        this.init();
      }
    },
    created () {
      this.init();
    },
    mounted () {

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
