<template>
  <ve-histogram :data="chartData" 
  :settings="chartSettings" 
  :height="histogramHeight"
  :theme="theme" 
  :data-empty="dataEmpty"></ve-histogram>
</template>

<script>
import veHistogram from "v-charts/lib/histogram";
  export default {
    name: "ChartHistogram",
    props:{rowData:Array},
    components: { veHistogram },
    data () {
      this.theme={
        textStyle: {
        color: 'rgba(255, 255, 255, 1)'
        },
        legend: {
          textStyle: {
            color: '#ffffff'
          }
        }
      },
      this.histogramHeight="35vh"
      this.chartSettings = {
        axisSite: { right: ['下单率'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['数值', '比率'],
        metrics: ['totalNum', 'failNum'],//维度
        dimension: ['brandName'],//指标
        labelMap: {
        'totalNum': '总台数',
        'failNum': '问题台数'
      },
      }
      return {
        dataEmpty:false,
        chartData: {
          columns: ['日期', '总台数', '问题台数'],
          rows: this.rowData
        }
      }
    },
    watch:{
    rowData: function (newQuestion, oldQuestion) {
      if(this.rowData!=undefined && this.rowData.length>0){
          this.chartData.rows=Object.assign([],this.rowData) //取到数据放到图表中
          this.dataEmpty=false;
        }else{
          this.dataEmpty=true;
        }
    }
    },
  }
</script>