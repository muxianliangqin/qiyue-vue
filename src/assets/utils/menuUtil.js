function findByNodeId(menuNode, nodeId) {
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

export default {
  findByNodeId
}
