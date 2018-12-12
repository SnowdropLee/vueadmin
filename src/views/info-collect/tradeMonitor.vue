<template>
  <div class="real-time-monitor" v-loading="loading">
    <div>
        <el-row :gutter="10">
            <el-col :md="24" :lg="12">
                <el-card shadow="hover" style="overflow:inherit;">
                    <div slot="header">
                        <span>概览</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="openConfigPop">监控配置</el-button>
                    </div>
                    <!-- <div style="border-top: 1px solid #ccc;margin: 21px 32px;"></div> -->
                    <el-row>
                      <el-col :md="{span:24,offset:0}" :lg="{span:24,offset:0}">
																	<el-row>
																		<el-col :sm="12" class="splitLineBottom">
																			<div class="panel splitLine">
																				<h1>{{tradeOutline.count}}</h1>
																				<p>当日总笔数</p>
																			</div>
																		</el-col>
																		<el-col :sm="12" class="splitLineBottom">
																			<div class="panel">
																				<h1>{{tradeOutline.amount}}</h1>
																				<p>交易总金额（元）</p>
																			</div>
																		</el-col>
																		<el-col :sm="12">
																			<div class="panel splitLine">
																				<h1>{{tradeOutline.succCount}}</h1>
																				<p>成功笔数</p>
																			</div>
																		</el-col>
																		<el-col :sm="12">
																			<div class="panel">
																				<h1>{{tradeOutline.succRate}}</h1>
																				<p>成功率</p>
																			</div>
																		</el-col>
																	</el-row>
																</el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :md="24" :lg="12">
                <el-card shadow="hover">
                    <div slot="header">
                        <span>交易量TOP10</span>
                    </div>
                    <el-row>
                      <el-col :sm="24">
                        <bar-charts :data="chartData" height="200px" :grid="grid" :settings="chartSettings" :extend="chartExtend" :legend-visible="false"></bar-charts>
                      </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col  :md="24" :lg="24" style="margin:10px 0 0 0">
                <el-card  shadow="hover">
                    <div slot="header">
                        <span>最新交易流水</span>
                    </div>
                    <el-row>
                        <el-col :sm="24">
                          <el-table 
                          header-row-class-name="tableHeaderClass"
                          ref="tableData" 
                          :data='tableData'  
                          max-height="500" 
                          width='100%'
                          class="tableMarginTop"
                          border
                          >
                              <el-table-column prop='tradeDate' label='交易日期' :formatter="tableDateFormat" min-width="140px"></el-table-column>
                              <el-table-column prop='tradeTime' label='交易时间' :formatter="tableTimeFormat"></el-table-column>
                              <el-table-column prop='tradeSerialNumber' label='交易流水号' min-width="240px"></el-table-column>
                              <el-table-column prop='devNum' label='设备编号'></el-table-column>
                              <!-- <el-table-column prop='xx' label='交易处理状态'></el-table-column> -->
                              <el-table-column prop='tradeName' label='交易名称' min-width="140px"></el-table-column>
                              <el-table-column prop='tradeStatus' :formatter="trandataFormat" label='交易结果'></el-table-column>
                              <el-table-column prop='tradeAccount' label='交易账号' min-width="240px"></el-table-column>
                              <el-table-column prop='tradeType' :formatter="typedataFormat" label='交易类型' min-width="120px"></el-table-column>
                              <el-table-column prop='tradeAmount' label='交易金额'></el-table-column>
                              <!-- <el-table-column prop='xx' label='柜员号'></el-table-column>
                              <el-table-column prop='xx' label='卡类型'></el-table-column>
                              <el-table-column prop='xx' label='卡介质'></el-table-column>
                              <el-table-column prop='xx' label='降级标志'></el-table-column>
                              <el-table-column prop='xx' label='交易类型'></el-table-column>
                              <el-table-column prop='xx' label='C端流水号'></el-table-column> -->
                              <el-table-column prop='channelSerialNumber' label='渠道流水号' min-width="320px"></el-table-column>
                              <el-table-column prop='hostSerialNumber' label='核心流水号' min-width="120px"></el-table-column>
                          </el-table>
                            <!-- <div class="box" style="text-align:right;margin-top: 10px;">
                                    <el-pagination background
                                        :page-sizes="[5, 10, 20,50]"
                                        @current-change="handleCurrentChange"
                                        :current-page.sync="currentPage"
                                        :page-size="10"
                                        layout="total, prev, pager, next, jumper"
                                        :total="tableTotal"> 
                                    </el-pagination>
                            </div> -->
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
    <!-- 弹窗 -->
    <!-- 配置页弹窗 -->
    <el-dialog title="监控配置" :visible.sync="configPopStatu" :lock-scroll=false width="600px">
          <el-card>
            <el-form ref='queryFormConfig' :model='queryFormConfig'  size='mini' label-position="top">
              <el-row :gutter="10">
                <el-col :md="24">
                  <h4>筛选配置</h4>
                </el-col>
                  <el-col :md="6" :lg="12">
                          <el-form-item label='设备编号'  prop='devNum'>
                                  <el-input v-model='queryFormConfig.devNum'  
                              placeholder="请输入设备编号"  ></el-input>
                          </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                          <el-form-item label='机构编号' prop='branchId'>
                              <select-tree ref="tree" v-model="queryFormConfig.branchId" @select-check="selectChange" 
                              :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                          </el-form-item>
                  </el-col>
                  <!-- <el-col :md="6" :lg="4">
                          <el-form-item label='设备类型'  prop='devType'>
                              <el-cascader v-model='queryFormConfig.devType' :props=" {value: 'devTypeNum',label: 'devType'}" 
                              placeholder="---请选择---" :options='deviceTypeSpinner' filterable></el-cascader>
                          </el-form-item>
                  </el-col> -->
              </el-row>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row>
                <el-col :md="24">
                  <h4>轮询配置</h4>
                </el-col>
                <el-col :md="7" :lg="12">
                  <el-form ref='timeForm' :model='timeForm'  size='mini' label-position="top">
                    <el-form-item label='轮询间隔（秒）' prop='queryTimeSpaceConfig' :rules="[
                                  { required: true, message: '间隔不可为空'},
                                  { validator: this.timeSpaceVali},
                                  { type: 'number', message: '请输入数字'}
                                ]">
                      <el-input type="number" v-model.number="timeForm.queryTimeSpaceConfig" placeholder="请输入轮询间隔"></el-input>
                      <span style="color:red;font-size:12px;">间隔过短会导致服务器压力过大，请谨慎配置</span>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="configPopStatu=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitConfig('timeForm')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import barCharts from "v-charts/lib/bar";
import selectTree from "@/components/selectTree2/";
import toolBox from "@/utils/toolBox";
//通讯相关
import request from "@/utils/request";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";
import top10AndOutlineIns from "@/message/infoCollect/tradeMonitor/trade-monitor-top10-query";
import tableIns from "@/message/infoCollect/tradeMonitor/trade-monitor-table-query";

export default {
  name: "real-time-monitor",
  components: { barCharts ,selectTree },  
  data() {
    return {
      loading: false,
      queryFormConfig:{
        branchId: [],
        branchNo: [],
        devNum:"",
      },
      configPopStatu:false,
      queryTimeSpace:120000,//轮询间隔
      timeForm:{
        queryTimeSpaceConfig:0,
      },
			brno: [],
			deviceTypeSpinner: [],
      tradeOutline: {
        count:"",
        amount:"",
        succCount:"",
        succRate:""
      },
      transactionType : getGlobalParams.get("transactionType"),
      tradeStatus : getGlobalParams.get("tradeStatus"),
      // tableData: [{ DEVMODEL: 1 }, { DEVMODEL: 2 }, { DEVMODEL: 3 }],
      tableTotal:0,
      currentPage: 1,
      pageSize: 10,
      queryForm: {
        branchId: [],
        branchNo: [],
        devNum:"",
        // devType:[]
      },
      chartData: {
        columns: ["交易种类", "交易量"],
        rows: []
      },
      chartExtend:{
        series: {
          barWidth: 10 ,
          barGap: "-100%"
        },
      },
      chartSettings: {
        // metrics: ["交易量"],
        dataOrder: {
          label: "交易量",
          order: "desc",
        },
        // xAxisType:["normal"],
        // xAxisName:["交易量"]
      },
      grid:{
        top: 0,
        bottom: 0
      }, 
      //图表设置数据
      tableData: []
    };
  },
  methods: {
    selectChange(checkedNode){
      //这里上送的不是branchId而是branchNum 所以使用暴露出来的事件 拿到选中项的branchNum
      var temp=[];
      checkedNode.map(function(item){temp.push(item.branchNo)});
      this.queryFormConfig.branchNo = temp;
      console.log(this.queryFormConfig.branchNo);
    },
    //配置项确认
    submitConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.configSubmit();
        } else {
          this.$message({
            type: "warning",
            message: "请按条件输入"
          });
          return false;
        }
      });
    },
    //输入轮询时间验证
    timeSpaceVali(rule, value, callback){
      if (this.timeForm.queryTimeSpaceConfig*1>1200000) {
        callback("间隔时间不得大于20分钟");
      }
      else if (this.timeForm.queryTimeSpaceConfig*1<0) {
        callback("间隔时间不得为负");
      }
      else {
        callback();
      }
    },
    //打开配置弹窗
    openConfigPop(){
      this.queryFormConfig=JSON.parse(JSON.stringify(this.queryForm));
      this.timeForm.queryTimeSpaceConfig=Number((this.queryTimeSpace/1000).toFixed(2));
      this.configPopStatu=true;
    },
    async configSubmit(){
      this.configPopStatu=false;
      this.loading=true;
      this.queryForm=JSON.parse(JSON.stringify(this.queryFormConfig));
      this.queryTimeSpace=this.timeForm.queryTimeSpaceConfig*1000;
      await this.queryTop10();
      await this.queryTable();
      this.loading=false;
    },
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    typedataFormat(row, column) {
      return this.transactionType[row[column.property]];
    },
    trandataFormat(row, column) {
      return this.tradeStatus[row[column.property]];
    },
    //格式化方法
    tableDateFormat(row, column){
      return toolBox.timeFormat2Date(row[column.property])
    },
    tableTimeFormat(row, column){
      return toolBox.timeFormat2Time(row[column.property])
    },
    //请求top10和概述//轮询时不应该有loading模态框
    async queryTop10() {
      // this.loading = true;
      let resBody = new top10AndOutlineIns();

      resBody.data.devNum = this.queryForm.devNum;
      // resBody.data.branchNoList = this.queryForm.branchId.join(",");
      resBody.data.branchNoList = this.queryForm.branchNo;

      // resBody.QueryPageNo = this.currentPage;
      // resBody.QueryRowNum = this.pageSize;

      let response = await request(resBody);
      // this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        //更新top10和概要
        //交易概述
        this.tradeOutline = {
          count:response.RSP_BODY.trandeOutlineObject[0].totalTradeCount,
          amount:response.RSP_BODY.trandeOutlineObject[0].totalTradeAmount,
          succCount:response.RSP_BODY.trandeOutlineObject[0].successTradeCount,
          succRate:response.RSP_BODY.trandeOutlineObject[0].tradeSuccessRate
        };
        //top10
        //将返回处理为chart需要的格式
        var resultArr=response.RSP_BODY.trandeTopTenList;
        var tempArr=[];
        //这里的key要和chartData中的colum进行匹配
        for(var i=0;i<resultArr.length;i++){
          tempArr.push({
            "交易种类":resultArr[i].tradeName,
            "交易量":resultArr[i].tradeCount
          })
        }
        this.chartData.rows = tempArr;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    //表格请求
    async queryTable() {//轮询无loading
      // this.loading = true;
      let resBody = new tableIns();

      resBody.data.devNum = this.queryForm.devNum;
      // resBody.data.branchNoList = this.queryForm.branchId.join(",");
      resBody.data.branchNoList = this.queryForm.branchNo;

      // resBody.QueryPageNo = this.currentPage;
      // resBody.QueryRowNum = this.pageSize;
      resBody.QueryPageNo = 1;
      resBody.QueryRowNum = 10;

      let response = await request(resBody);
      // this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.tradeMonitorList;
        this.tableTotal = response.QUERY_INFO_HEAD.QueryAllDataCount;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    //轮询方法
    polling(ifQuery,ifLoop){
      var vueIns=this;
      if(ifLoop){
        this.queryTimeout=setTimeout(function(){
          var tagsArr=vueIns.$store.state.tagsView.cachedViews;
          var currentPageName=vueIns.$router.currentRoute.name;
          var thisPageName=vueIns.$options.name
          if(tagsArr.indexOf(thisPageName)+1){
            //在页签中且是当前页时发送
            if(currentPageName==thisPageName){
              ifQuery&&vueIns.queryTop10();
              ifQuery&&vueIns.queryTable();
              vueIns.polling(true,true);
            }
            //在页签中有但不是当前页时停止发送请求
            else{
              ifQuery&&vueIns.queryTop10();
              ifQuery&&vueIns.queryTable();
              vueIns.polling(false,true);
            }
          }
          //不在页签中时直接关闭
          else{
            clearTimeout(vueIns.queryTimeout);//其实不用这步
            vueIns.polling(false,false);
          }
        },vueIns.queryTimeSpace)
      }
    },
    handleSizeChange() {},
    handleCurrentChange() {
      this.queryTable();
    }
  },
  async created() {
    this.loading=true;
    let resBody = new spinnerList();
    resBody.data.spinnerList = [
      { spinnerName: "branch" },
      { spinnerName: "devType" }
    ];
    let response = await request(resBody);

    if (response.SYS_HEAD.ReturnCode == "000000") {
      //在之后要塞入空选项
      this.brno = response.RSP_BODY.branchSpinner;
      this.deviceTypeSpinner = response.RSP_BODY.deviceTypeSpinner||[];
      this.deviceTypeSpinner.unshift({});
    } else {
      this.$message({
        type: "error",
        message:
          "请求失败，错误码:" +
          response.SYS_HEAD.ReturnCode +
          "，错误信息：" +
          response.SYS_HEAD.ReturnMessage
      });
    }
    await this.queryTop10();
    await this.queryTable();
    this.loading=false;
    //然后再开启轮询
    this.polling(true,true);
  },
  mounted() {
    console.log(this.$store.getters.button);
  },
  watch:{
    currentPage(){
      this.queryTable();
    }
  }
};
</script>


<style lang="scss" scoped>
.splitLine{
  // position: relative;
  // &::after{
  //   position: absolute;

  // }
  border-right: 1px solid #ebeef5;
}
.splitLineBottom{
  border-bottom: 1px solid #ebeef5;
}
.type-info-bottom {
  margin-top: 10px;
}
.box {
  margin-top: 20px;
  text-align: right;
}
.headerClass {
  background: #f7f7f7 !important;
}
.el-date-editor.el-input {
  width: 100% !important;
}
.panel {
  // background: #d9edf7;
  text-align: center;
  margin: 19px 0px;
  padding: 5px 0;
  box-sizing: border-box;
  // border-radius: 3px;
  color: #777;
}
.panel h1 {
  margin: 5px;
  font-size: 1.45em;
  font-weight: 400;
}
.panel p {
  margin: 0;
  font-size: 14px;
}
</style>
