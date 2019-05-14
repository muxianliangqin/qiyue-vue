import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

function generateCompName(compPath) {
  return upperFirst(
    camelCase(
      // 剥去文件名开头的 `./` 和结尾的扩展名
      compPath.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )
}

export default {
  generateCompName
}
