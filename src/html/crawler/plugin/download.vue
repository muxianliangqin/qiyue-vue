<template>
  <div style="text-align: left">
    <h3 style="padding-left: 2em">网站及其分类的信息设置可以使用插件辅助。</h3>
    <h3 style="padding-left: 2em">以下是插件的下载及使用教程：</h3>
    <Collapse v-model="unfold">
      <Panel name="1">
        获取插件的token
        <div slot="content">
          <Button type="primary" @click="getToken">获取token</Button>
          <span style="margin-left: 3em">{{ token }}</span>
        </div>
      </Panel>
      <Panel name="2">
        下载插件
        <div slot="content">
          <a href="http://47.106.140.189/download/crawler-assistant.zip" download="crawler-assistant">crawler-assistant下载</a>
          <p></p>
        </div>
      </Panel>
      <Panel name="3">
        插件安装教程
        <div slot="content">
          <p>一、下载插件后，复制到自选定目录，解压</p>
          <p>二、打开google浏览器，点击【设置】->【更多工具】->【扩展程序】</p>
          <p>三、打开右上角【开发者模式】，点击【加载已解压的扩展程序】，选择步骤一自选定的目录</p>
          <p>四、打开右下角开关，开启插件使用</p>
        </div>
      </Panel>
      <Panel name="4">
        token设置教程
        <div slot="content">
          <p>一、点击插件卡片的【详细信息】</p>
          <p>二、往下翻，选择【扩展程序选项】</p>
          <p>三、复制本页面的token填入，点击确认</p>
          <p>四、关闭选项配置页面</p>
        </div>
      </Panel>
      <Panel name="5">
        插件使用教程
        <div slot="content">
          <p>一、鼠标悬浮选择区域，蓝色边框的即为所选区域</p>
          <p>二、鼠标右击确认选择</p>
          <p>三、点击【确认选择】提交所选，点击【重新选择】重新选择</p>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
export default {
  name: 'download',
  data () {
    return {
      unfold: '1',
      token: ''
    }
  },
  methods: {
    getToken () {
      this.token = this.$store.getters.userInfo.token
    }
  }
}
</script>

<style scoped>

</style>
