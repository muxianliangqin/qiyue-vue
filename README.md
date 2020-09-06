# 个人网页
实现语言：VUE

## 自定义功能及组件
`自定义form表单组件`
实现功能：
- 支持各种input组件如：输入框、下拉选等
- 支持自定义添加各种rule校验规则
- 支持自定义标题、图标、简单排版等
- 支持初始化、重置等功能
- 支持表单提交时添加额外的参数
- 统一校验、提交数据

详情可见：src/components/system/form.vue

主要属性说明：
```
url: {type: String, required: true},// form表单提交的url
fields: {type: Object},// form表单的属性，标准格式:{key:{key:'',value:'',label:''...},...}
fieldValue: {type: String, default: 'value'},//获取属性value时的关键字
fieldLabel: {type: String, default: 'label'},//获取属性label时的关键字
fieldRule: {type: String, default: 'rule'},//获取属性rule时的关键字
extraParams: {
  type: Object,
  default: () => {
    return {}
  }
},//form提交时所需的额外参数
span: {type: Number, default: 24},    //24栅格系统,input框的栅格占用
/*
* 一些隐藏设置：
* 每个field都有type属性，如未填默认为:text
* 如type=select，field有select属性，select结构如下：
* {...type: 'select',
*   select: {value: 'id', label: 'title', data: [{id: '', title: '',...},...]}
* }
* select中的value和label分别表示从data中获取option的value和label属性关键字
* option默认value和label属性
* 下拉选 如果value是数字，form检测必填时，不能检测通过，尽量用String类型
*/
/**
 * type=radio，也依上例
 * {..., type: 'radio',
 *   radio: {value: 'label',label: 'content',data: [{label: 'show', content: '展示', icon: 'icon-font icon-show'},...]}
 * }
 */
```
