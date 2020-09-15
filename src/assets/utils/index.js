import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

/**
 * 根据组件实际相对路径生成组件名称
 * @param componentPath
 */
const generateComponentName = (componentPath) => {
  return upperFirst(
    camelCase(
      // 剥去文件名开头的 `./`或 `/` 和结尾的扩展名
      componentPath.replace(/^\.?\/(.*)\.\w+$/, '$1')
    )
  )
}

/**
 * 根据节点ID（nodeId），从菜单树中某一个节点开始，查找对应的菜单节点
 * @param menuNode
 * @param nodeId
 * @returns {*}
 */
const findByNodeId = (menuNode, nodeId) => {
  if (menuNode.element.nodeId === nodeId) {
    return menuNode
  }
  if (!menuNode.hasChild) {
    return
  }
  for (let node of menuNode.children) {
    if (node.element.nodeId === nodeId) {
      return node
    }
    if (node.hasChild) {
      return findByNodeId(node, nodeId)
    }
  }
}

/**
 * 使用ModalForm/SystemForm自定义组件时，根据table的行数据row，进行初始化
 * @param fields 表单字段
 * @param data 数据
 */
const initModalFields = (fields, data) => {
  const keys = Object.keys(fields)
  keys.forEach(v => {
    // 下拉选 如果value是数字，form检测必填时，不能检测通过，尽量用String类型
    if (v.type && v.type === 'select') {
      fields[v]['value'] = `${data[v]}`
    } else {
      fields[v]['value'] = data[v]
    }
  })
}

/**
 * 使用ModalForm自定义组件时，重置所有字段值为undefined
 * @param fields
 */
const resetModalFields = (fields) => {
  const keys = Object.keys(fields)
  keys.forEach(v => {
    fields[v]['value'] = undefined
  })
}

export default {
  generateComponentName,
  findByNodeId,
  initModalFields,
  resetModalFields,
}
