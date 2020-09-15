/**
 * 在table或其他组件的render函数中，创建权限组件
 * render 组件嵌套时应使用数组[]类型
 * @type {{createAuth: Auth.createAuth}}
 */
const Auth = {
  // 1-module,模块 2-menuFolder,菜单目录。3-menu,菜单。 4-html,页面，非菜单直接打开的页面。5-button,按钮。6-link,链接
  TYPE: {
    MODULE: 'module',
    MENU_FOLDER: 'menuFolder',
    MENU: 'menu',
    HTML: 'html',
    BUTTON: 'button',
    LINK: 'link',
  },
  // 插槽组件执行后台逻辑的操作行为 select：读，update：更新，insert：新增，delete：删除
  OPERATE: {
    SELECT: 'select',
    UPDATE: 'update',
    INSERT: 'insert',
    DELETE: 'delete',
  },

  /**
   * @param createElement render时渲染元素组件的函数
   * @param superMenuId 页面组件menuId
   */
  createAuth: (createElement, superMenuId) => {
    let auth = {}
    // render时渲染元素组件的函数, 通常为 h
    auth.createElement = createElement
    // 页面组件名称
    auth.superMenuId = superMenuId
    // 插槽组件名称
    auth.name = undefined
    // 插槽组件描述
    auth.desc = undefined
    // 组件类型代码
    // 默认button
    auth.typeCode = Auth.TYPE.BUTTON
    // 默认 delete
    auth.operateCode = Auth.OPERATE.DELETE
    auth.config = function (name, desc, operateCode, typeCode) {
      auth.name = name
      auth.desc = desc
      auth.operateCode = operateCode
      auth.typeCode = typeCode
    }
    // 按钮类型
    auth.button = function (name, desc, operateCode) {
      auth.name = name
      auth.desc = desc
      auth.operateCode = operateCode
      auth.typeCode = Auth.TYPE.BUTTON
      return this
    }
    // a链接类型
    auth.link = function (name, desc, operateCode) {
      auth.name = name
      auth.desc = desc
      auth.operateCode = operateCode
      auth.typeCode = Auth.TYPE.LINK
      return this
    }
    auth.build = (slot) => {
      if (undefined === slot) {
        alert('创建鉴权组件时插槽组件slot必须设置')
      }
      if (undefined === auth.name) {
        alert('创建鉴权组件时配置信息name必须设置')
      }
      // 替换插槽组件的style
      const style = Object.assign({}, slot.data.style)
      // 如果插槽组件为行内元素，转换auth显示为行内元素，
      const inlines = ['a', 'button', 'span']
      let tag = ''
      if (slot.componentOptions) {
        tag = slot.componentOptions.tag
      } else {
        tag = slot.tag
      }
      if (inlines.includes(tag.toLowerCase())) {
        style.display = 'inline'
      }
      slot.data.style = {}
      // 时间戳做版本号，确保重复创建时能更新权限
      let version = new Date().getTime()
      return auth.createElement('SystemAuth', {
        props: {
          version: version,
          superMenuId: auth.superMenuId,
          name: auth.name,
          operateCode: auth.operateCode,
          typeCode: auth.typeCode,
          desc: auth.desc,
        },
        style: style,
      }, [slot])
    }
    return auth
  }
}

export default {
  Auth
}
