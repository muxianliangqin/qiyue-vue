<template>
  <TablePage :url="findRecords"
            :columns="columns"
            v-bind="$attrs"
            v-on="$listeners">
  </TablePage>
</template>

<script>
  export default {
    name: "records",
    data () {
      return {
        findRecords: '/weChat/findRecords',
        columns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '用户名',
            key: 'nickName'
          },
          {
            title: '用户群组显示名',
            key: 'actualNickName'
          },
          {
            title: '信息内容',
            key: 'textOrFilename'
          },
          {
            title: '记录时间',
            key: 'recordTime'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
