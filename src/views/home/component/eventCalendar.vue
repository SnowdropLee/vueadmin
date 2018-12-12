<template>
  <el-row>
    <el-col>
      <el-card>
        <vue-event-calendar 
          :events="demoEvents">
        </vue-event-calendar>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      demoEvents: [
        {
          date: "2018/05/12", // 必填
          title: "Foo"
        },
        {
          date: "2018/05/15",
          title: "Bar",
          desc: "description",
          customClass: "disabled highlight" // 自定义日历单元格的Class，会加到对应的日历单元格上
        }
      ]
    }
  }
}
</script>

