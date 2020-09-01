<template>
  <div :style="{height: height.splitHeight + 'px'}">
    <Split v-model="split1">
      <div slot="left">
        <Card :ref="ref.card.user">
          <Row style="text-align: left">
            <Col span="18">
              <Card :class="modelSwitch.userManage ? '' : 'user-disabled'">
                <Row>
                  <Col span="8" style="height: 32px; line-height: 32px">用户</Col>
                  <Col span="16">
                    <AutoComplete
                      v-model="user.currentUser.username"
                      @on-search="searchUsers"
                      @on-select="selectUser"
                      clearable
                      :disabled="!modelSwitch.userManage"
                      placeholder="请输入用户名">
                      <Option v-for="item in user.data" :value="item.username" :key="item.username">{{ item.username }}
                      </Option>
                    </AutoComplete>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span="6" style="text-align: center; height: 32px; line-height: 32px">
              <Card>
                <SystemAuth :version="new Date().getTime()"
                            :superMenuId="menuData.menuId"
                            name="模式切换"
                            typeCode="button"
                            desc="切换用户模式-查看用户拥有的角色和权限，角色模式-管理设置菜单及权限"
                            operateCode="update">
                  <Switch v-model="modelSwitch.userManage"
                          size="large"
                          class="switch"
                          true-color="#2d8cf0"
                          false-color="#ff4949"
                          @on-change="modelChange">
                    <span slot="open">用户管理</span>
                    <span slot="close">角色管理</span>
                  </Switch>
                </SystemAuth>
              </Card>
            </Col>
          </Row>
        </Card>
        <Card :ref="ref.card.roles">
          <Row style="text-align: left">
            <Col span="6" style="height: 32px; line-height: 32px">角色</Col>
            <Col span="18">
              <Select v-model="roles.currentRoles"
                      :multiple="modelSwitch.userManage"
                      filterable
                      clearable
                      :disabled="modelSwitch.userManage"
                      @on-change="getMenusByRoleIds"
                      @on-clear="getMenusByRoleIds">
                <Option v-for="item in roles.data" :value="item.roleId" :key="item.roleId">
                  {{item.name}}
                </Option>
              </Select>
            </Col>
          </Row>
        </Card>
        <Card title="菜单信息" :style="cardTreeStyle">
          <Tree :data="tree.data"
                :ref="ref.card.menuTree"
                :show-checkbox="showCheckbox"
                :render="renderContent"
                @on-check-change="checked"
                @on-toggle-expand="expand"
                :load-data="loadData"
                style="text-align: left">
          </Tree>
        </Card>
      </div>
      <div slot="right" style="padding-left: 20px">
        <Card :title="systemForm.title" v-if="systemForm.show">
          <SystemForm v-if="systemForm.show"
                      :url="systemForm.url"
                      :title="systemForm.title"
                      :ref="ref.systemForm"
                      :fields="systemForm.fields"
                      :extraParams="systemForm.extraParams"
                      @form-ok="reload">
          </SystemForm>
        </Card>
        <Card v-if="userMenus.show">
          <Divider>确定更改用户菜单权限吗？</Divider>
          <div>
            <h3 style="text-align: left;">添加菜单</h3>
            <row v-for="value in userMenus.addChecked">
              <Col span="8"
                   :key="value.menuId"
                   style="text-align: left;padding: 8px 0">
                {{value.name}}
              </Col>
              <Col span="16">
                <RadioGroup v-model="userMenus.roleMenuPermission[value.menuId]">
                  <Tooltip content="展示">
                    <Radio label="show">
                      <Icon custom="icon-font icon-show"></Icon>
                    </Radio>
                  </Tooltip>
                  <Tooltip content="禁用">
                    <Radio label="disabled">
                      <Icon custom="icon-font icon-disabled"></Icon>
                    </Radio>
                  </Tooltip>
                  <Tooltip content="隐藏">
                    <Radio label="hidden">
                      <Icon custom="icon-font icon-hidden"></Icon>
                    </Radio>
                  </Tooltip>
                </RadioGroup>
              </Col>
            </row>
          </div>
          <div>
            <h3 style="text-align: left;">删除菜单</h3>
            <row v-for="value in userMenus.removeChecked">
              <Col span="8"
                   :key="value.menuId"
                   style="text-align: left;padding: 8px">
                {{value.name}}
              </Col>
              <Col span="16">
                <RadioGroup v-model="phone">
                  <Tooltip content="展示">
                    <Radio label="show">
                      <Icon custom="icon-font icon-show"></Icon>
                    </Radio>
                  </Tooltip>
                  <Tooltip content="禁用">
                    <Radio label="disabled">
                      <Icon custom="icon-font icon-disabled"></Icon>
                    </Radio>
                  </Tooltip>
                  <Tooltip content="隐藏">
                    <Radio label="hidden">
                      <Icon custom="icon-font icon-hidden"></Icon>
                    </Radio>
                  </Tooltip>
                </RadioGroup>
              </Col>
            </row>
          </div>
          <p style="padding-top: 20px">
            <Button type="primary" @click="roleMenusSubmit">确认</Button>
            <Button @click="roleMenusReset" style="margin-left: 8px">重置</Button>
          </p>
        </Card>
      </div>
    </Split>
    <!--菜单状态更改，删除-->
    <ModalState v-model="modalState.show"
                :draggable="true"
                :url="modalState.url"
                :title="modalState.title"
                :titleColor="modalState.titleColor"
                :params="modalState.params"
                @modal-ok="modalOk">
      <div slot="msg">
        <Row>
          <Col span="12"
               v-if="modalState.menus.length > 1"
               v-for="menu in modalState.menus"
               style="text-align: center">
            {{menu.element.data.name}}
          </Col>
          <Col span="24"
               v-else
               v-for="menu in modalState.menus"
               style="text-align: center">
            {{menu.element.data.name}}
          </Col>
        </Row>
      </div>
    </ModalState>
  </div>
</template>

<script>
  import baseUtil from '@/assets/utils/baseUtil.js'
  import SystemAuth from '../../../components/system/auth'

  export default {
    name: 'tree',
    components: {SystemAuth},
    props: {
      // 菜单数据
      menuData: Object,
      params: Object
    },
    data () {
      return {
        split1: 0.5,
        height: {
          splitHeight: this.$store.getters.tabs.contentHeight,
          cardTreeHeight: 0
        },
        modelSwitch: {
          userManage: true,
        },
        tree: {
          data: [
            {
              element: {nodeId: '0', superNodeId: '0', data: {menuId: '0', name: '根目录', state: 0}},
              hasChild: true,
              children: []
            }
          ],
          buttonProps: {
            type: 'default',
            size: 'small',
          },
          buttonStyle: {
            margin: '0 0.25em',
          },
        },
        systemForm: {
          show: false,
          title: '',
          url: '',
          fields: {
            name: {value: '', label: '菜单名称'},
            desc: {value: '', label: '菜单描述', rule: [{required: false}]},
            componentName: {value: '', label: '组件名称', rule: [{required: false}]},
            superMenuId: {value: '', label: '上级菜单', type: 'select', select: {data: []}},
            permissionCode: {
              value: 'show', label: '菜单权限', type: 'radio', radio: {
                value: 'label',
                label: 'content',
                data: [
                  {label: 'show', content: '展示', icon: 'icon-font icon-show'},
                  {label: 'disabled', content: '禁用', icon: 'icon-font icon-disabled'},
                  {label: 'hidden', content: '隐藏', icon: 'icon-font icon-hidden'},
                ]
              }
            }
          },
          extraParams: {}
        },
        url: {
          menu: {
            getMenuNodeForAll: 'user/menu/getMenuNodeForAll',
            add: 'user/menu/add',
            modify: 'user/menu/modify',
            del: 'user/menu/delBatch',
            stop: 'user/menu/stopBatch',
            restart: 'user/menu/restartBatch',
            getMenusByUserId: 'user/menu/getMenusByUserId',
            getMenusByRoleId: 'user/menu/getMenusByRoleId',
            getMenusByRoleIds: 'user/menu/getMenusByRoleIds'
          },
          role: {
            findAll: 'user/role/findAll',
            findByUserId: 'user/role/findByUserId'
          },
          user: {
            findByUsernameLike: 'user/user/findByUsernameLike'
          },
          component: {
            findUserComponentList: 'user/component/findUserComponentList',
            findByHtmlComponentName: 'user/component/findByHtmlComponentName',
          },
          setRoleMenus: 'user/role/setRoleMenus',
          findUserMenus: 'user/user/findUserMenus',
          findAllUser: 'user/user/findAll',
        },
        ref: {
          systemForm: 'systemForm',
          card: {
            user: 'user',
            roles: 'roles',
            menuTree: 'menuTree'
          },
        },
        modalState: {
          show: false,
          url: '',
          title: '',
          titleColor: 'red',
          menus: [],
          params: {}
        },
        user: {
          currentUser: {},
          data: []
        },
        roles: {
          // roleId 数组
          initRoles: [],
          currentRoles: [],
          data: []
        },
        userMenus: {
          // 用户拥有权限的菜单组, 菜单实例数据
          menus: [],
          // 初始化时用户拥有的菜单组，菜单menuId
          initMenus: [],
          show: false,
          initChecked: [],
          addChecked: {},
          removeChecked: {},
          roleMenuPermission: {}
        },
      }
    },
    computed: {
      showCheckbox () {
        return !this.params.edit
      },
      cardTreeStyle () {
        return {
          height: this.height.cardTreeHeight + 'px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }
      }
    },
    methods: {
      /**
       * 初始化
       */
      init () {
        // 设置用户信息
        this.initUser()
        // 获取角色信息
        this.initUserRoles()
        // 获取所有的菜单树
        this.initMenuTree()
      },
      /**
       * 设置当前操作的用户信息
       */
      initUser () {
        this.user.currentUser.userId = this.params.userId
        this.user.currentUser.username = this.params.username
      },
      /**
       * 初始化用户拥有的角色信息
       */
      initUserRoles () {
        this.getAllRoles()
        this.getRolesByUserId(this.user.currentUser.userId)
      },
      /**
       * 获取所有的角色
       */
      getAllRoles () {
        this.$http.get(this.url.role.findAll).then((response) => {
          this.roles.data = response.content
        })
      },
      /**
       * 根据userId获取拥有的菜单组
       * @param userId 用户id
       */
      getRolesByUserId (userId) {
        this.$http.post(this.url.role.findByUserId, userId).then((response) => {
          let roles = response.content
          this.roles.currentRoles = []
          roles.forEach(k => {
            this.roles.currentRoles.push(k.roleId)
          })
          this.getMenusByRoleIds(this.roles.currentRoles)
          this.roles.initRoles = this.roles.currentRoles.concat()
        })
      },
      /**
       * 根据用户roleIds获取菜单组
       * @param roleIds 菜单id
       */
      getMenusByRoleIds (roleIds) {
        this.userMenus.addChecked = {}
        this.userMenus.removeChecked = {}
        this.userMenus.show = false
        if (undefined === roleIds || '' === roleIds || (roleIds instanceof Array && roleIds.length === 0)) {
          this.userMenus.menus = []
          this.handleMenuTreeData(this.tree.data, this.userMenus.menus)
          this.userMenus.initMenus = this.userMenus.menus.concat()
          return
        }
        let roleIdArray = []
        let userManage = this.modelSwitch.userManage
        if (userManage) {
          roleIdArray = roleIds.concat()
        } else {
          roleIdArray.push(roleIds)
        }
        this.$http.post(this.url.menu.getMenusByRoleIds, roleIdArray).then((response) => {
          this.userMenus.menus = response.content
          this.handleMenuTreeData(this.tree.data, this.userMenus.menus)
          this.userMenus.initMenus = this.userMenus.menus.concat()
        })
      },
      /**
       * 初始化整个菜单树信息
       */
      initMenuTree () {
        this.$http.post(this.url.menu.getMenuNodeForAll).then((response) => {
          this.tree.data[0].children = response.content.children
          this.handleMenuTreeData(this.tree.data, this.userMenus.menus)
        })
      },
      /**
       * 模式切换
       */
      modelChange (value) {
        if (value) {
          this.init()
        } else {
          this.user.currentUser.username = ''
          this.roles.currentRoles = []
        }
      },
      /**
       * 对菜单树数据进行一些必要的预处理
       * 设置selected、expand属性
       * 由于menuNode是一个数组，VUE不能监测到 数组内的对象的属性值改变，
       * 使用this.$set()方法触发VUE的值改变监控
       *
       * @param menuNode 菜单树节点数组
       * @param menus 用户拥有的菜单数组
       */
      handleMenuTreeData (menuNode, menus) {
        for (let i = 0; i < menuNode.length; i++) {
          let node = menuNode[i]
          // 选中
          this.$set(node, 'checked', false)
          // 半选中
          this.$set(node, 'indeterminate', false)
          // 复选框禁用
          this.$set(node, 'disabled', this.modelSwitch.userManage)
          // 加载鉴权组件
          if (node.nodeId === '0') {
            continue
          }
          if (i === 0) {
            this.$set(node, 'expand', true)
          }
          let menu = menus.find((v) => {
            return v.menuId === node.element.nodeId
          })
          if (menu) {
            this.$set(node.element.data, 'permissionType', menu.permissionType)
            this.$set(node.element.data, 'permissionCode', menu.permissionCode)
          }
          if (!node.hasChild) {
            let checked = undefined !== menu
            this.$set(node, 'checked', checked)
          }
          if (node.hasChild) {
            this.handleMenuTreeData(node.children, menus)
          }
        }
      },
      /**
       * 标记选中的菜单
       * 取消旧数据的选中，标记新数据选中
       * @param data 选中的菜单的数据
       */
      markSelectedMenu (data) {
        this.$set(data, 'selected', false)
      },
      /**
       * 自定义解析菜单树
       */
      renderContent (h, {root, node, data}) {
        // 分类图标
        let iconName = ''
        switch (data.element.data.type) {
          case 1:
          case 2:
            iconName = 'icon-font icon-folder'
            break
          case 3:
            iconName = 'icon-font icon-menu'
            break
          case 4:
            iconName = 'icon-font icon-html'
            break
          case 5:
            iconName = 'icon-font icon-button'
            break
          case 6:
            iconName = 'icon-font icon-link'
            break
          default:
            iconName = 'icon-font icon-folder'
        }
        const iconCategory = h('Icon', {
          props: {
            custom: iconName
          },
          style: {
            marginRight: '0.5em'
          }
        })
        // 展示文字
        const text = h('span', {}, data.element.data.name)
        // 是否可用图标
        const iconState = h('Icon', {
          props: {
            custom: data.element.data.state === 0 ? 'icon-font icon-usable' : 'icon-font icon-unusable',
          },
          style: Object.assign({}, this.tree.buttonStyle, {
            color: data.element.data.state === 0 ? 'green' : 'red'
          })
        })
        // 权限等级图标
        let iconPermissionCustom = 'icon-font icon-show'
        let iconPermissionColor = 'green'
        const permissionType = data.element.data.permissionType
        switch (permissionType) {
          case 1:
            iconPermissionCustom = 'icon-font icon-show'
            break
          case 2:
            iconPermissionCustom = 'icon-font icon-disabled'
            iconPermissionColor = 'orange'
            break
          case 3:
            iconPermissionCustom = 'icon-font icon-hidden'
            iconPermissionColor = 'black'
            break
          default:
            iconPermissionCustom = 'icon-font icon-show'
            break
        }
        if (data.element.data.state !== 0 || (!data.indeterminate && !data.checked)) {
          iconPermissionCustom = 'icon-font icon-hidden'
          iconPermissionColor = 'black'
        }
        const iconPermission = h('Icon', {
          props: {
            custom: iconPermissionCustom,
          },
          style: Object.assign({}, this.tree.buttonStyle, {
            color: iconPermissionColor
          }),
        })
        // 编辑按钮
        const edit = h('Button', {
          props: Object.assign({}, this.tree.buttonProps, {
            type: 'success'
          }),
          style: Object.assign({}, this.tree.buttonStyle, {}),
          on: {
            click: () => {
              this.markSelectedMenu(data)
              this.edit(root, node, data)
            }
          }
        }, [h('Icon', {
          props: {
            custom: 'icon-font icon-editor'
          }
        })])
        // 新增按钮
        const add = h('Button', {
          props: Object.assign({}, this.tree.buttonProps, {
            type: 'primary'
          }),
          style: Object.assign({}, this.tree.buttonStyle, {}),
          on: {
            click: () => {
              this.markSelectedMenu(data)
              this.append(root, node, data)
            }
          }
        }, [h('Icon', {
          props: {
            custom: 'icon-font icon-add'
          }
        })])
        // 切换状态按钮
        const swap = h('Button', {
          props: Object.assign({}, this.tree.buttonProps, {
            type: 'warning'
          }),
          style: Object.assign({}, this.tree.buttonStyle, {}),
          on: {
            click: () => {
              this.markSelectedMenu(data)
              this.swap(data)
            }
          }
        }, [h('Icon', {
          props: {
            custom: 'icon-font icon-swap'
          }
        })])
        // 删除按钮
        const remove = h('Button', {
          props: Object.assign({}, this.tree.buttonProps, {
            type: 'error',
          }),
          style: Object.assign({}, this.tree.buttonStyle, {}),
          on: {
            click: () => {
              this.markSelectedMenu(data)
              this.remove(root, node, data)
            }
          }
        }, [h('Icon', {
          props: {
            custom: 'icon-font icon-remove'
          }
        })])
        const auth = this.$auth.createAuth(h, this.menuData.menuId)
        const authAdd = auth.config('新增子菜单', '新增子菜单', 'insert', 'button').setSlot(add).build()
        const authEdit = auth.config('编辑', '编辑菜单', 'update', 'button').setSlot(edit).build()
        const authSwap = auth.config('切换', '切换菜单状态', 'update', 'button').setSlot(swap).build()
        const authRemove = auth.config('删除', '删除菜单', 'delete', 'button').setSlot(remove).build()
        let buttons = []
        if (data.element.nodeId === '0') {
          buttons = [authAdd]
        } else {
          buttons = [authAdd, authEdit, authSwap, authRemove]
        }
        // 按钮组
        const buttonGroup = h('span', {
          style: {
            display: this.modelSwitch.userManage ? 'none' : 'inline-block',
            float: 'right',
            marginRight: '3em',
          }
        }, buttons)
        return [iconCategory, text, iconState, iconPermission, buttonGroup]
      },
      /**
       * 编辑菜单
       */
      edit (root, node, data) {
        this.systemForm.title = `编辑${data.hasChild ? '菜单目录' : '菜单'} 【${data.element.data.name}】`
        this.systemForm.url = this.url.menu.modify
        let keys = Object.keys(this.systemForm.fields)
        // 为每个field赋值
        keys.forEach(k => {
          this.systemForm.fields[k]['value'] = data.element.data[k]
        })
        // 获取所有的菜单目录
        let menuDir = []
        root.forEach(k => {
          if (k.node.element.nodeId === '0') {
            menuDir.push({
              value: '0',
              label: '根目录'
            })
          } else if (node.node.depth > k.node.depth && k.children.length > 0) {
            menuDir.push({
              value: k.node.element.data.menuId,
              label: k.node.element.data.name
            })
          }
        })
        // 上级菜单为下拉选（单选）
        this.systemForm.fields.superMenuId.select.data = menuDir
        // 如果是一级陌路，上级目录是root
        if (node.node.depth === 1) {
          this.systemForm.fields.superMenuId.value = '0'
        }
        this.systemForm.fields.superMenuId.disabled = false
        // 如果是菜单目录，组件名称非必填
        this.systemForm.fields.componentName.value = data.element.data.componentName
        if ([3, 4].includes(data.element.data.type)) {
          this.systemForm.fields.componentName.rule = [{required: true, message: `请输入组件名称`, trigger: 'blur'}]
        } else {
          this.systemForm.fields.componentName.rule = [{required: false}]
        }
        this.systemForm.fields.permissionCode.value = data.element.data.permissionCode
        if (this.$refs[this.ref.systemForm]) {
          this.$refs[this.ref.systemForm].init()
        }
        this.systemForm.extraParams = {
          menuId: data.element.data.menuId,
          roleId: this.roles.currentRoles
        }
        this.systemForm.show = true
        this.userMenus.show = false
      },
      /**
       * 新增子菜单
       */
      append (root, node, data) {
        this.systemForm.url = this.url.menu.add
        this.systemForm.title = `新增子菜单 【${data.element.data.name}】`
        let keys = Object.keys(this.systemForm.fields)
        keys.forEach(k => {
          let field = this.systemForm.fields[k]
          field.value = ''
        })
        // 上级菜单为当前菜单，不可改
        this.systemForm.fields.superMenuId.select.data = [
          {
            value: data.element.data.menuId,
            label: data.element.data.name
          }
        ]
        this.systemForm.fields.superMenuId.value = data.element.data.menuId
        this.systemForm.fields.superMenuId.disabled = true
        // 校验规则
        this.systemForm.fields.componentName.rule = [{required: false}]
        this.systemForm.fields.desc.rule = [{required: false}]
        if (this.$refs[this.ref.systemForm]) {
          this.$refs[this.ref.systemForm].init()
        }
        this.systemForm.extraParams = {
          rankNo: data.depth + 1,
          sortNo: data.children.length
        }
        this.systemForm.show = true
        this.userMenus.show = false
      },
      /**
       * 切换菜单及其下级菜单的状态 number类型
       * 0-可用
       * 1-不可用
       */
      swap (data) {
        this.modalState.menus = this.getSelectedAndSubMenus(data)
        this.modalState.params = this.modalState.menus.map(k => k.element.data.menuId)
        this.modalState.titleColor = 'Orange'
        if (data.element.data.state === 0) {
          this.modalState.url = this.url.menu.stop
          this.modalState.title = '确定要停用以下记录吗？'
        } else {
          this.modalState.url = this.url.menu.restart
          this.modalState.title = '确定要启用以下记录吗？'
        }
        this.modalState.show = true
        this.systemForm.show = false
        this.userMenus.show = false
      },
      /**
       * 删除菜单及其下级菜单
       */
      remove (root, node, data) {
        // const parentKey = root.find(el => el === node).parent
        // const parent = root.find(el => el.nodeKey === parentKey).node
        // const index = parent.children.indexOf(data)
        this.modalState.menus = this.getSelectedAndSubMenus(data)
        this.modalState.params = this.modalState.menus.map(k => k.element.data.menuId)
        this.modalState.url = this.url.menu.del
        this.modalState.title = '确定要删除以下记录吗？'
        this.modalState.titleColor = 'red'
        this.modalState.show = true
        this.systemForm.show = false
        this.userMenus.show = false
      },
      /**
       * 异常加载子节点数据
       */
      loadData (item, callback) {
        let htmlComponentName = baseUtil.generateCompName(item.element.data.url)
        this.$http.post(this.url.component.findByHtmlComponentName, htmlComponentName).then((response) => {
          callback(response.content.children)
        })
      },
      /**
       * 获取选中菜单及其所有下级菜单
       * @param data
       * @returns {*[]}
       */
      getSelectedAndSubMenus (data) {
        let menus = [data]
        if (data.hasChild) {
          data.children.forEach(v => {
            menus = menus.concat(this.getSelectedAndSubMenus(v))
          })
        }
        return menus
      },
      /**
       * 选中节点
       */
      checked (data) {
        this.userMenus.addChecked = {}
        this.userMenus.removeChecked = {}
        if (!this.roles.currentRoles) {
          alert('请先选择角色')
          return
        }
        // 点击复选框
        let currentChecked = this.$refs[this.ref.card.menuTree].getCheckedAndIndeterminateNodes()
        currentChecked = currentChecked.filter(k => {
          return k.element.data.menuId !== '0'
        }).map((k) => {
          return k.element.data
        })
        let initChecked = this.userMenus.initMenus
        if (initChecked.length === 0) {
          this.userMenus.removeChecked = initChecked
        } else {
          initChecked.filter(k => {
            return !currentChecked.find(e => {
              return e.menuId === k.menuId
            })
          }).forEach(k => {
            this.$set(this.userMenus.removeChecked, k.menuId, {
              menuId: k.menuId,
              name: k.name
            })
            this.userMenus.roleMenuPermission[k.menuId] = 'show'
          })
        }
        if (currentChecked.length === 0) {
          this.userMenus.addChecked = initChecked
        } else {
          currentChecked.filter(k => {
            return !initChecked.find(e => {
              return e.menuId === k.menuId
            })
          }).forEach(k => {
            this.$set(this.userMenus.addChecked, k.menuId, {
              menuId: k.menuId,
              name: k.name
            })
            this.userMenus.roleMenuPermission[k.menuId] = 'show'
          })
        }
        this.userMenus.show = true
        this.systemForm.show = false
      },
      roleMenusSubmit () {
        let addChecked = this.userMenus.addChecked
        let removeChecked = this.userMenus.removeChecked
        let addMenus = []
        const addKeys = Object.keys(addChecked)
        addKeys.forEach(k => {
          let v = addChecked[k]
          addMenus.push({
            menuId: v.menuId,
            permissionCode: this.userMenus.roleMenuPermission[v.menuId]
          })
        })
        let removeMenus = []
        const removeKeys = Object.keys(removeChecked)
        removeKeys.forEach(k => {
          let v = addChecked[k]
          removeMenus.push({
            menuId: v.menuId,
            permissionCode: this.userMenus.roleMenuPermission[v.menuId]
          })
        })
        this.$http.post(this.url.setRoleMenus, {
          roleId: this.roles.currentRoles,
          addMenus: addMenus,
          removeMenus: removeMenus
        }).then((response) => {
          this.reload()
        })
        this.userMenus.show = false
        this.userMenus.addChecked = {}
        this.userMenus.removeChecked = {}
      },
      roleMenusReset () {
        let initData = JSON.parse(JSON.stringify(this.initTreeData))
        this.$set(this, 'data', initData)
        this.userMenus.show = false
      },
      /**
       * 用户自动完成搜索框 搜索用户
       */
      searchUsers (value) {
        this.$http.post(this.url.user.findByUsernameLike, value).then((response) => {
          this.user.data = response.content
        })
      },
      /**
       * 用户自动完成搜索框选中用户
       * @param value
       */
      selectUser (value) {
        this.user.currentUser = this.user.data.find((v) => {
          return v.username === value
        })
        this.getRolesByUserId(this.user.currentUser.userId, true)
      },
      /**
       * 计算菜单树卡片的高度
       * @returns {number}
       */
      computeCardTreeHeight () {
        let cardUserHeight = this.$refs[this.ref.card.user].$el.clientHeight
        let cardRolesHeight = this.$refs[this.ref.card.roles].$el.clientHeight
        this.height.cardTreeHeight = this.height.splitHeight - cardUserHeight - cardRolesHeight
      },
      /**
       * 展开/折叠 节点
       * @param data
       */
      expand (data) {
        this.$set(data, 'expand', data.expand)
      },
      /**
       * 重新加载菜单树
       */
      reload () {
        this.initMenuTree()
        this.getMenusByRoleIds(this.roles.currentRoles)
      },
      /**
       * 菜单切换状态、删除操作成功
       */
      modalOk () {
        this.initMenuTree()
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.$nextTick(() => {
        this.computeCardTreeHeight()
      })
    },
    watch: {
      'params' () {
        this.init()
      }
    }
  }
</script>

<style scoped>
  /deep/ .ivu-card-body {
    padding: 0.5em;
  }

  /deep/ .ivu-tree-title {
    width: 100%;
  }

  /deep/ .switch {
    width: 6em;
  }

  /deep/ .switch .ivu-switch-checked {
    width: 6em;
  }

  /deep/ .ivu-switch-large.ivu-switch-checked:after {
    right: 1px;
    left: auto;
  }

  /deep/ .ivu-switch-checked .ivu-switch-inner {
    left: 10px;
  }

  /deep/ .user-disabled {
    background-color: #f3f3f3
  }
</style>
