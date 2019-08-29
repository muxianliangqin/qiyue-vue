<template>
  <div>
    <TablePage :url="url.findAll"
              :columns="columns"
              :ref="ref.page"
              v-bind="$attrs"
              v-on="$listeners">
      <div slot="buttons"
           class="self-buttons">
        <Button type="primary" size="small" style="float: left;margin-left: 20px" @click="menuTree">菜单树展示</Button>
        <Button type="primary" size="small" style="margin-right: 80px" @click="addItem">新增</Button>
        <divider style="margin: 4px 0px 0px 0px"></divider>
      </div>
    </TablePage>
    <ModalForm v-model="form.modal"
               :title="form.title"
               :url="form.url"
               :fields="form.fields"
               :extraParams="form.extraParams"
               @modal-ok="reload">
    </ModalForm>
    <ModalState v-model="state.modal"
                  :url="state.url"
                  :params="state.params"
                  :title="state.title"
                  @modal-ok="reload">
      <div slot="msg" style="text-align: center">
        <p>{{state.msg}}</p>
      </div>
    </ModalState>
  </div>
</template>

<script>
  export default {
    name: "menus",
    data () {
      return {
        form: {
          modal: false,
          title: '',
          url: '',
          fields: [
            {key: 'code', value: '', label: '菜单编码'},
            {key: 'name', value: '', label: '菜单名称'},
            {key: 'superCode', value: '', label: '上级菜单'},
          ],
          extraParams: {}
        },
        url: {
          findAll: 'user/menu/findAllPage',
          add: 'user/menu/add',
          modify: 'user/menu/add',
          del: 'user/menu/add',
          stop: 'user/menu/add',
          restart: 'user/menu/add',
        },
        ref: {
          page: 'Page'
        },
        state: {
          modal: false,
          title: undefined,
          url: '',
          msg: '',
          params: null
        },
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 100
          },
          {
            title: '菜单代码',
            key: 'code'
          },
          {
            title: '菜单名称',
            key: 'name'
          },
          {
            title: '上级菜单',
            key: 'superCode'
          },
          {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let state = params.row.state;
              let stateCn = '';
              if (state === '0') {
                stateCn = '正常';
              } else if (state === '1') {
                stateCn = '停用';
              } else {
                stateCn = '未知';
              }
              return h('span',stateCn)
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 250,
            render: (h, params) => {
              let modify = h('Button', {
                attrs: {
                  type: 'primary',
                  size: 'small',
                  style: 'margin: 0 1em;'
                },
                on: {
                  click: () => {
                    this.form.modal = true;
                    this.form.title = '修改记录';
                    this.form.url = this.url.modify;
                    this.form.fields.forEach((v) => {v.value = params.row[v.key]});
                    this.form.extraParams = {id: params.row.id}
                  }
                }
              }, '修改');
              let stop = h('Button', {
                attrs: {
                  type: 'primary',
                  size: 'small',
                  style: 'margin: 0 1em;'
                },
                on: {
                  click: () => {
                    this.state.modal = true;
                    this.state.url = this.url.stop;
                    this.state.msg = '菜单：' + params.row.name;
                    this.state.title = '确定要停用以下记录吗？';
                    this.state.params = {id: params.row.id}
                  }
                }
              }, '停用');
              let restart = h('Button', {
                attrs: {
                  type: 'primary',
                  size: 'small',
                  style: 'margin: 0 1em;'
                },
                on: {
                  click: () => {
                    this.state.modal = true;
                    this.state.msg = '菜单：' + params.row.name;
                    this.state.url = this.url.restart;
                    this.state.title = '确定要启用以下记录吗？';
                    this.state.params = {id: params.row.id}
                  }
                }
              }, '启用');
              let del = h('Button', {
                attrs: {
                  type: 'primary',
                  size: 'small',
                  style: 'margin: 0 1em;'
                },
                on: {
                  click: () => {
                    this.state.modal = true;
                    this.state.msg = '菜单：' + params.row.name;
                    this.state.url = this.url.del;
                    this.state.params = {id: params.row.id}
                  }
                }
              }, '删除');
              let ops = [];
              if (params.row.state === '0') {
                ops = [modify, stop, del];
              } else {
                ops = [modify, restart, del];
              }
              return ops;
            }
          }
        ]
      }
    },
    methods: {
      addItem () {
        this.form.modal = true;
        this.form.title = '新增记录';
        this.form.url = this.url.add;
        this.form.fields.forEach((v) => {v.value = ''})
      },
      menuTree () {
        let component = {
          name: 'UserSetMenuTree',
          desc: '菜单树',
          show: true,
          new: true,
          params: {
            edit: true
          }
        };
        this.$store.dispatch('addComponent', component)
      },
      reload (value) {
        if (value) {
          this.$refs[this.ref.page].reload()
        }
      }
    }
  }
</script>

<style scoped>

</style>
