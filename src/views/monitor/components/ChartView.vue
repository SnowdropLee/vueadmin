<template>
  <div>
    <line-charts 
    :data="chartData"
    :extend="extend"
    :settings="chartSettings">
    </line-charts>
  </div>
</template>

<script>
import lineCharts from "v-charts/lib/line";

export default {
  name: "ChartView",
  components: { lineCharts },
  data() {
    this.extend = {
      series: {
        label: {
          normal: {
            show: true
          }
        }
      }
    };
    this.theme = {
        backgroundColor: "rgba(57,64,86,.81)",
        color: [
            "#40c9c6",
            "#36a3f7",
            "#f4516c"
        ],
        textStyle: {
          color: 'rgba(255, 255, 255, 0.5)'
        }

    };

    this.backgroundColor = [
      {
        backgroundColor: "rgba(128, 128, 128, 0.5)"
      },
    ];
    this.chartSettings = {
      metrics: ["交易笔数",  "成功率"],
      dimension: ["时间"],
      axisSite: { right: ["成功率"] },
      yAxisType: ["KMB", "percent"],
      yAxisName: ["交易数", "成功率"]
    };
    return {
      chartData: {
        //图表数据
        columns: ["时间", "交易笔数", "同比", "成功率"],
        rows: [
          { 时间: "9:00", 交易笔数: 1423, 同比: 1623, 成功率: 0.99 },
          { 时间: "10:00", 交易笔数: 1223, 同比: 1323, 成功率: 0.9 },
          { 时间: "11:00", 交易笔数: 2123, 同比: 2023, 成功率: 0.8 },
          { 时间: "12:00", 交易笔数: 4123, 同比: 4823, 成功率: 1.0 },
          { 时间: "13:00", 交易笔数: 3123, 同比: 2123, 成功率: 0.8 },
          { 时间: "14:00", 交易笔数: 7123, 同比: 6123, 成功率: 0.87 },
          { 时间: "15:00", 交易笔数: 8123, 同比: 6123, 成功率: 0.97 }
        ]
      }
    };
  },
  created() {

  },
  computed: {},
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>

</style>
