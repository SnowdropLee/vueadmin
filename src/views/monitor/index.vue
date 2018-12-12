<template>
<div class="real-time-monitor" v-loading="loading" >
  <el-row :gutter="10">
    <el-col>
      <el-card class="monitor_header " style="height:8vh;">
        <div class="monitor_header_title">
          <div style="position:relative;top:15px;">XXX银行自助渠道监控平台</div>
        </div>
        <div class="monitor_header_date">
          <span v-text="date"></span>
          <span v-text="time"></span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="panel_header" style="height:46vh">
        <div slot="header">
          <span>交易总笔数</span>
        </div>
        <panel-group :endVal="totalTrade"></panel-group>

      </el-card>
    </el-col>
    <el-col :span='12'>
      <el-card style="height:46vh">
        <!-- <chart-view></chart-view> -->
        <chart-map :rowData="mapDevRunningStatusList"></chart-map>

      </el-card>
    </el-col>
    <el-col :span='6'>
      <el-card class="panel_header" style="height:46vh">
        <div slot="header">
          <span>交易TOP10</span>
        </div>
        <!-- <el-table ref="tableData" 
        :data='tableData'
        height="345" width='100%'
        highlight-current-row >
          <el-table-column prop='date' label='交易日期' width='110' fixed></el-table-column>
          <el-table-column prop='a' label='交易流水' width='100'></el-table-column>
          <el-table-column prop='b' label='设备编号' width='90'></el-table-column>
          <el-table-column prop='c' label='处理状态' width='80'></el-table-column>
          <el-table-column prop='d' label='交易名称' min-width='100'></el-table-column>
          <el-table-column prop='e' label='交易金额' width='90'></el-table-column>
        </el-table> -->
        <chart-bar :rowData="trandeTopTenList"></chart-bar>
      </el-card>
    </el-col>
  </el-row>

  <!-- <el-card class="item_group">
    <el-row :gutter="20">
      <el-col :lg="4" v-for="v in devList" :key="v.id">
        <item-group :option="v"></item-group>
      </el-col>
    </el-row>
  </el-card> -->

  <!-- <el-card class="panel_header" > -->
    <el-row :gutter="10" class="devPanel">
      <el-col :span="6">
        <el-card style="height:41vh;">
          <div slot="header"> 
            <span>设备运行情况</span>
          </div>
          <chart-ring :rowData="devRunningStatusList"></chart-ring>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height:41vh">
          <div slot="header">
            <span>交易类型统计</span>
          </div>
          <chart-trade :rowData="tradeTypeQueryInfoList"></chart-trade>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="height:41vh">
          <div slot="header">
            <span>设备厂商排名</span>
          </div>
          <chart-histogram :rowData="devBrandQueryInfoList"></chart-histogram>
        </el-card>
      </el-col>
    </el-row>
  <!-- </el-card> -->
</div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import {
  ChartView,
  PanelGroup,
  ChartBar,
  ItemGroup,
  ChartMap,
  ChartRing,
  ChartHistogram,
  ChartTrade
} from "./components";
import { parseTime } from "@/utils";

//通讯相关
import request from "@/utils/request";
import tradeTableIns from "@/message/reportFormsManage/trade-form-table";
import tradeExcelIns from "@/message/reportFormsManage/trade-form-excel";
import monitorList from "@/message/monitor/index";

export default {
  name: "real-time-monitor",
  components: {
    ChartView,
    PanelGroup,
    ChartBar,
    ItemGroup,
    ChartMap,
    ChartRing,
    ChartHistogram,
    ChartTrade
  },
  data() {
    return {
      loading:false,
      isHeight: true,
      date: "",
      time: "",
      totalTrade:{},//总交易笔数
      trandeTopTenList:[],//top10
      devRunningStatusList:[],//设备运行情况
      mapDevRunningStatusList:[],//地图
      devBrandQueryInfoList:[],//设备厂商
      tradeTypeQueryInfoList:[],//网点交易
      devList: [
        {
          id: 1,
          name: "XXX银行北京分行",
          devNum: 433,
          normalNum: 428,
          tranNum: 5938
        },
        {
          id: 2,
          name: "XXX银行上海分行",
          devNum: 390,
          normalNum: 377,
          tranNum: 4900
        },
        {
          id: 3,
          name: "XXX银行天津分行",
          devNum: 121,
          normalNum: 120,
          tranNum: 1321
        },
        {
          id: 4,
          name: "XXX银行广州分行",
          devNum: 322,
          normalNum: 310,
          tranNum: 4987
        },
        {
          id: 5,
          name: "XXX银行江苏分行",
          devNum: 211,
          normalNum: 200,
          tranNum: 2734
        },
        {
          id: 6,
          name: "XXX银行浙江分行",
          devNum: 323,
          normalNum: 323,
          tranNum: 3675
        }
      ],
      tableData: [
        {
          date: "2018-06-01",
          a: "012220001",
          b: "V00533",
          c: "成功",
          d: "转账",
          e: "$30000"
        }
      ]
    };
  },
  created() {
    this.$nextTick(() => {
      this.getTime();
      this.getMonitorList()
    });
  },
  methods: {
    getTime() {
      setTimeout(() => {
        let Timestamps = new Date();
        this.date = parseTime(Timestamps, "{y}年{m}月{d}日");
        this.time = parseTime(Timestamps, "{h}:{i}:{s}");
        this.getTime();
      }, 1000);
    },
    getMonitorList() {
      this.loading=true;
      let resBody = new monitorList();
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading=false;
            this.totalTrade=response.RSP_BODY.hasOwnProperty("trandeOutlineObject")?response.RSP_BODY.trandeOutlineObject[0]:{};
            this.trandeTopTenList=response.RSP_BODY.trandeTopTenList;  
            this.devRunningStatusList=response.RSP_BODY.devRunningStatusList;  
            this.mapDevRunningStatusList=response.RSP_BODY.mapDevRunningStatusList;   
            this.tradeTypeQueryInfoList=response.RSP_BODY.tradeTypeQueryInfoList;   
            this.devBrandQueryInfoList=response.RSP_BODY.devBrandQueryInfoList;   
          }else{
            this.loading=false;            
          }
        
        })
        .catch(error => {
          this.loading=false;          
          console.error("查询错误", error);
        });
    },
    async getExcel() {
      let resBody = new selfserExcelIns();
      let response = await request(resBody);
      try {
        this.loading = false;
        if (response.SYS_HEAD.ReturnCode == "000000") {
          // this.downloadFile(response.RSP_BODY.fileName);
        } else {
          alert("请求失败，错误码:" + response.SYS_HEAD.ReturnCode);
        }
        return output;
      } catch (err) {
        // this.logger.log("fail", err);
      }
    }
  }
};
</script>

<style>
.devPanel  .el-card__header {
   border-bottom: 1px solid #50576fa3;
  color: #81c2ff;
}
.panel_header .el-card__header {
  border-bottom: 1px solid #50576fa3;
  color: #81c2ff;
}
.monitor_header .el-card__body {
  padding: 0;
}
.item_group .el-card__body {
  margin-bottom: 0;
}
/* //图表数据为空得样式 */
.v-charts-data-empty{
  background-color: rgba(255, 255, 255, .0);
  bottom:50px;
}
</style>

<style lang="scss" scoped>

.monitor_header {
  position: relative;
  // text-shadow: 0px 0px 5px #d0dcff;
  color: #ffffff;
  .monitor_header_title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }
  .monitor_header_date {
    color: #81c2ff;
    position: absolute;
    top: 3vh;
    right: 20px;
    p:nth-child(1) {
      font-size: 16px;
      margin: 10px auto;
    }
    p:nth-child(2) {
      font-size: 20px;
      letter-spacing: 5px;
      margin: 0;
    }
  }
}
.el-card {
  margin-bottom: 1vh;
  // background-color: #6170a0bd;
  background-color: #243a85;
  border-color: #616a88;
  box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.5);
  // color: #1f3a71;
  font-weight: 600;
}
.item_group {
  margin-bottom: 0;
}
.isHeight {
  height: 100vh;
}
.real-time-monitor {
  //
  // background: -moz-radial-gradient(center, circle, #b3c5ff, #394056);
  // background: -ms-radial-gradient(center, circle, #b3c5ff, #394056);
  // background: -o-radial-gradient(center, circle, #b3c5ff, #394056);
  // background: radial-gradient(center, circle, #b3c5ff, #394056);
  // background: -webkit-radial-gradient(center, circle, #b3c5ff, #394056);
  background: #0f1c3c;
  padding: 1vh;
}
</style>
