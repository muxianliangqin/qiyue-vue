import Vue from 'vue'
import baseUtil from '@/assets/utils/baseUtil.js'

const htmlRequire = require.context(
  // 其组件目录的相对路径
  '@/html',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /(\.\/).+\.(vue|js)$/
)
const componentsRequire = require.context('@/components', true, /(\.\/).+\.(vue|js)$/)

function newComponents (requires, prefix) {
  let components = []
  requires.keys().forEach(fileName => {
    // console.log(fileName)
    // 获取组件的 PascalCase 命名
    const componentName = baseUtil.generateCompName(fileName)
    let path = '/' + componentName + '/'
    let name = componentName
    // 获取组件配置
    const componentConfig = requires(fileName)
    let component = componentConfig.default || componentConfig
    Vue.component(name, component)
    components.push({
      path: path,
      name: name,
      component: component
    })
  })
  return components
}

let htmlComponents = newComponents(htmlRequire, '@/html')
let selfComponents = newComponents(componentsRequire, '@/components')
let components = htmlComponents.concat(selfComponents)
// console.log(components)

export default components

