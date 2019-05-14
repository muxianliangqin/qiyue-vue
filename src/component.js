import $ from 'jquery'
import baseUtil from '@/assets/util/baseUtil.js'

const requireComponent = require.context(
  // 其组件目录的相对路径
  '@/components',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /(\.\/)(?!home|menu).+\.(vue|js)$/
)

let components = []
// let suffix_id = ['NewsShowIndex','WechatShowIndex']

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // console.log(fileName)
  // 获取组件的 PascalCase 命名
  const componentName = baseUtil.generateCompName(fileName)
  console.log(componentName)

  let path = '/' + componentName + '/'
  let name = componentName
  let component = componentConfig.default || componentConfig
  // if ($.inArray(componentName,suffix_id) != -1) {
  //   path = path + ':id'
  // }
  components.push({
    path: path,
    name: name,
    component: component
  })

})

// console.log(components)

export default components

