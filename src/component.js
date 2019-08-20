import Vue from 'vue'
import baseUtil from '@/assets/util/baseUtil.js'

const htmlRequire = require.context(
  // 其组件目录的相对路径
  '@/html',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /(\.\/).+\.(vue|js)$/
);
const componentsRequire = require.context('@/components', true, /(\.\/).+\.(vue|js)$/);

function newComponents(requires) {
  let components = [];
  requires.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requires(fileName);
    // console.log(fileName)
    // 获取组件的 PascalCase 命名
    const componentName = baseUtil.generateCompName(fileName);
    // console.log(componentName)

    let path = '/' + componentName + '/';
    let name = componentName;
    let component = componentConfig.default || componentConfig;
    // if ($.inArray(componentName,suffix_id) != -1) {
    //   path = path + ':id'
    // }
    Vue.component(name,component);
    components.push({
      path: path,
      name: name,
      component: component
    })
  });
  return components;
}

let htmlComponents = newComponents(htmlRequire);
let selfComponents = newComponents(componentsRequire);
let components = htmlComponents.concat(selfComponents);
console.log(components);

export default components

