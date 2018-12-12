<template>
  <ve-ring
    :data="chartData"
    :settings="chartSettings"
    :height="ringHeight" 
    :theme="theme" 
    :series="series"
    :data-empty="dataEmpty"></ve-ring>
</template>

<script>
import veRing from "v-charts/lib/ring";
import pie from "v-charts/lib/pie";

  export default {
    name: "ChartRing",
      props:{rowData:Array},
    components: { veRing },
    data () {
    
    return {
      dataEmpty:false,
     theme : {
      legend: {
        textStyle: {
          color: '#ffffff'
        }
      }
    },
    series:[ 
       {
            name:'访问用户',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[],
            // [
            //   { name: '正常', value: 1393 },
            //   { name: '正常', value: 3530 },
            //   // { name: '暂停', value: 2923 },
            //   // { name: '维护', value: 1723 },
            //   // { name: '停用', value: 3792 },
            //   // { name: '服务停止', value: 4593 }
            // ],
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }],
    ringHeight: "35vh",
    chartSettings :{
      dimension: 'runningStatusDesc',
      metrics: 'devStatusNum',
      radius : '55%',
      center: ['50%', '50%'],
    },
      chartData: {
        columns: ['runningStatusDesc', 'devStatusNum'],
        rows:this.rowData
        // [
        //   { 'runningStatusDesc': '正常', 'devStatusNum': 5393 },
        //   { 'runningStatusDesc': '故障', 'devStatusNum': 3530 },
        //   // { '日期': '暂停', 'devStatusNum': 2923 },
        //   // { '日期': '维护', '访问用户': 1723 },
        //   // { '日期': '停用', '访问用户': 3792 },
        //   // { '日期': '服务停止', '访问用户': 4593 }
        // ]
      },
      dataList:[]
    }
    },
    watch:{
      rowData: function (newQuestion, oldQuestion) {
        if(this.rowData!=undefined && this.rowData.length>0){
          this.dataList=JSON.parse(JSON.stringify(this.rowData).replace(/devStatusNum/g,"value"));
          this.dataList=JSON.parse(JSON.stringify(this.dataList).replace(/runningStatusDesc/g,"name"));
          this.chartData.rows=Object.assign([],this.dataList) //取到数据放到图表中
          this.series[0].data=Object.assign([],this.dataList) //取到数据放到图表中
          this.dataEmpty=false;
        }else{
          this.dataEmpty=true;
        }
        this.loading=false;
        
      }
      
    },
  }
</script>

<style lang="scss" scoped>

</style>
