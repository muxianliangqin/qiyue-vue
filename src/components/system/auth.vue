<template>
  <div v-if="show">
    <slot></slot>
  </div>
</template>

<script>
  /**
   * 通过改变插槽中的data数据可以改变slot的属性、样式等
   * const slot = this.$slots.default[0]
   * slot.data.attrs = Object.assign(slot.data.attrs || {}, {disabled: true})
   * 1、改变slot属性方法只能在组件创建周期执行一次，
   * 2、父页面更新再次创建组件时，由于VUE会复用组件，改变slot属性的方法就不会执行
   * 3、所以添加版本号version，并监听之，每次变更就调用方法改变slot属性
   *
   */
  export default {
    name: 'system-auth',
    props: {
      version: {type: String | Number, default: -1, required: true},
      superMenuId: {type: String, required: true}, // 页面组件menuId,
      name: {type: String, default: '', required: true}, // 鉴权组件名称
      typeCode: {type: String, default: 'link', required: true}, // 鉴权组件类型代码
      desc: {type: String, default: '', required: false}, // 鉴权组件描述
      operateCode: {type: String, default: 'select', required: true}, // 后台对数据的操作类型 select-查询，insert-新增，update-更新，delete-删除
    },
    data () {
      return {
        show: false,
        authMenu: {},
        url: {
          save: '/user/menu/add'
        }
      }
    },
    methods: {
      /**
       * 鉴权
       */
      auth () {
        // 超级管理员拥有所有菜单及页面元素的使用权限，如果此时元素是数据库不存在的，则新增数据
        // TODO 是否是超级管理员
        const isSuperAdmin = true
        // 从store中获取组件是否已授权
        let authHtml = this.$store.getters.findMenuByMenuId(this.superMenuId)
        if (!authHtml) {
          return
        }
        let authButton = undefined
        authButton = authHtml.children.find((k) => {
          return k.element.data.name === this.name
        })
        // 如果可以找到授权元素数据，展示元素，
        if (authButton) {
          this.show = true
          this.authMenu = authButton
          return
        }
        if (isSuperAdmin) {
          const menu = {
            superMenuId: this.superMenuId,
            name: this.name,
            desc: this.desc,
            rankNo: authHtml.element.data.rankNo + 1,
            sortNo: authHtml.children.length + 1,
            typeCode: this.typeCode,
            operateCode: this.operateCode,
          }
          if (this.$store.getters.newAuthHasSave(this.superMenuId, this.name)) {
            return
          }
          this.$store.dispatch('saveNewAuthMenu', {
            superMenuId: this.superMenuId,
            name: this.name
          }).then(() => {
            this.$http.post(this.url.save, menu).then((response) => {
              if (response.code === this.$const.RESPONSE_SUCCESS) {
                this.$store.dispatch('alerts', {
                  message: `保存鉴权组件【${this.name}】成功，请重新刷新页面查看效果`
                })
              }
            })
          })
        }
      },
      setPermission () {
        const slot = this.$slots.default[0]
        if (undefined === slot) {
          return
        }
        const permissionType = this.authMenu.element.data.permissionType
        switch (permissionType) {
          case 1:
            break
          case 2:
            slot.data.attrs = Object.assign(slot.data.attrs || {}, {disabled: true})
            if (slot.componentOptions) {
              slot.componentOptions.propsData = Object.assign(slot.componentOptions.propsData || {}, {disabled: true})
            }
            break
          case 3:
            if (this.show) {
              this.show = false
            }
            break
          default:
            break
        }
      },
    },
    mounted () {
      this.auth()
      this.setPermission()
    },
    watch: {
      'version' () {
        this.setPermission()
      }
    },
  }
</script>

<style scoped>

</style>
