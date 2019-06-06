<template>
  <div style="text-align: left">
    <h3 style="padding-left: 2em">网站及其分类的信息设置可以使用插件辅助。</h3>
    <h3 style="padding-left: 2em">以下是插件的下载及使用教程：</h3>
    <Collapse v-model="unfold">
      <Panel name="1">
        获取插件的token
        <div slot="content">
          <Button type="primary">获取token</Button>
          <p></p>
        </div>
      </Panel>
      <Panel name="2">
        下载插件
        <div slot="content">
          <a type="download">crawler-assistant下载</a>
          <p></p>
        </div>
      </Panel>
      <Panel name="3">
        插件安装教程
        <div slot="content">

        </div>
      </Panel>
      <Panel name="4">
        token设置教程
        <div slot="content">

        </div>
      </Panel>
      <Panel name="4">
        插件使用教程
        <div slot="content">

        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  export default {
    name: "download",
    data () {
      return {
        unfold: "1"
      }
    }
  }
</script>

<style scoped>

</style>
