<template>
  <div>
    <h2>welcome</h2>
   <!-- <Collapse style="text-align: left">
      <Panel>
        关于系统的一些说明
        <div slot="content">
          <p>本系统为个人网站，暂不开放注册</p>
        </div>
      </Panel>
      <Panel>
        版本历史
        <div slot="content">
          <Collapse>
            <Panel>
              初始版本1.0.1
              <div slot="content">
                <h3>系统前端使用Vue框架开发。</h3>
                <p>
                  该前端以Vue为基础，使用iview、axios、store、router等组件，
                  菜单随数据库自动变化，页面布局自适应屏幕尺寸，页面简介美观，操作方便。
                </p>
                <h3>系统后端采用Eureka分布式开发，目前有三个子系统：用户管理、网络爬虫结果展示、微信消息记录。</h3>
                <p>用户管理子系统主要管理注册用户、菜单、菜单权限设置，菜单权限租借等功能。</p>
                <p>网络爬虫结果展示子系统和chrome插件以及python爬虫配合，实时获取选定网页分类的新闻更新。</p>
                <p>微信消息记录子系统配合python程序展示指定微信群组的聊天消息</p>
              </div>
            </Panel>
            <Panel>
              未来展望
              <div slot="content">
                <h3>计划上线宗族子系统，主要内容有：</h3>
                <p>1、上线人工智能训练的OCR模型，将族谱内容识别成电子版搬到线上保存</p>
                <p>2、收录现有宗族成员信息，理清成员间关系，记录姓名、联系方式等个人信息。</p>
              </div>
            </Panel>
          </Collapse>
        </div>
      </Panel>
    </Collapse>-->
  </div>
</template>

<script>
export default {
  name: 'index',
  mounted () {
  }
}
</script>

<style scoped>
p{
  text-indent: 2em;
}
</style>
