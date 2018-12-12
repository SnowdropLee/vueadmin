<template>
  <ve-histogram 
  :data="chartData" 
  :settings="chartSettings" 
  :height="histogramHeight" 
  :theme="theme"
  :extend="extend"
  :grid="grid"
  :data-empty="dataEmpty"></ve-histogram>
</template>

<script>
import veHistogram from "v-charts/lib/histogram";
  export default {
    props:{rowData:Array},
    name: "ChartBar",
    components: { veHistogram },
    data () {
      this.grid={
        bottom: 80
      }
      this.extend={
        xAxis:{
          axisLabel:{
            interval:0,
            // rotate:-30
          }
        },
         series: {
          barWidth: 10 ,
          barGap: "-100%"
        },
        axisLabel: {//将横向改为纵向
          interval: 0,
          formatter:function(value)
            {
              return value.split("").join("\n");
            }
        }
      }
      
            

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
        metrics: ['tradeCount', 'successCount'],//维度
        dimension: ['tradeName'],//指标
        labelMap: {
          'tradeCount': '总比数',
          'successCount': '成功笔数'
        },
        label	:{
          show:true,
          position:'top',
        },
        legendName: {
          // '访问用户': '访问用户 total: 10000'
        },
        // dataOrder: {
        //   label: '总笔数',
        //   order: 'asc'
        // },
        // stack: {
        //   '总笔数': ['总笔数', '成功笔数']
        // }
      }
      return {
        dataEmpty:false,
        chartData: {
          columns: ['tradeName', 'tradeCount', 'successCount' ],
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