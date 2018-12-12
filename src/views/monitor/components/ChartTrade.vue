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
    name: "ChartTrade",
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
        },
        itemStyle	:{
          barWidth :"30px"
        }
      },
      this.histogramHeight="35vh"
      this.chartSettings = {
        axisSite: { right: ['下单率'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['数值', '比率'],
        metrics: ['totalNum'],//维度
        dimension: ['tradeTypeDesc'],//指标
        labelMap: {
          'totalNum': '总比数',
          // 'tradeTypeDesc': '成功笔数'
        },
      }
      return {
        loading:false,
        dataEmpty:false,
        chartData: {
          columns: ['地区', '现金', '签约', '查询', '发卡', '排队', '回单', '其他'],
          rows:[]
          // [
          //   { '地区': '北京北京北京', '现金': 1393, '签约': 1093, '查询': 1093, '发卡': 1093, '排队': 1093, '回单': 1093,'其他':10},
          //   { '地区': '上海', '现金': 3530, '签约': 3230, '查询': 1093, '发卡': 1093, '排队': 1093, '回单': 1093,'其他':10},
          //   { '地区': '天津', '现金': 2923, '签约': 2623, '查询': 1093, '发卡': 1093, '排队': 1093, '回单': 1093,'其他':10},
          //   { '地区': '深圳', '现金': 1723, '签约': 1423, '查询': 1093, '发卡': 1093, '排队': 1093, '回单': 1093,'其他':10},
          //   { '地区': '广州', '现金': 3792, '签约': 3492, '查询': 1093, '发卡': 1093, '排队': 1093, '回单': 1093,'其他':10},
          //   { '地区': '厦门', '现金': 4593, '签约': 4293, '查询': 1093, '发卡': 1093, '排队': 1093, '回单': 1093,'其他':10}
          // ]
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