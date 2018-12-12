<template>
  <div v-loading="loading"
        element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px;overflow:visible">
      <el-form :model="formInline" ref="formInline" label-position="top" size="mini">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="机构" prop="branchNo">
              <select-tree :tree-data="brnoList"
              v-model="formInline.selBrno" :node-key="'branchId'"
              :single-check="true" 
              :props="{id:'branchId',label:'branchName',children:'childBranch'}"
              ></select-tree>
            </el-form-item>        
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="开始日期" prop="startdate">
              <el-date-picker
                v-model="formInline.startdate"
                value-format="yyyyMMdd" 
                :editable=false
                 :picker-options="pickerOptionsStart"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="结束日期"  prop="enddate">
              <el-date-picker
                v-model="formInline.enddate"
                :editable=false
                 :picker-options="pickerOptionsStart"
                 value-format="yyyyMMdd" 
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="交易类型"  prop="tradetype">
              <el-select v-model="formInline.tradetype" placeholder="请选择交易类型">
                <el-option
                  v-for="item in typeSpinner"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="设备编号" prop="devNum">
              <el-input v-model="formInline.devNum" placeholder="请选择设备编号"></el-input>
            </el-form-item>
          </el-col>
           <el-col :md="6" :lg="4">
            <el-form-item label="交易流水号" prop="agentserialno">
              <el-input v-model="formInline.agentserialno" placeholder="请输入交易流水号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="处理状态" prop="tradestatus">
              <el-select v-model="formInline.tradestatus" placeholder="请选择处理状态">
                <el-option
                  v-for="item in tranSpinner"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :md="6" :lg="4">
            <el-form-item label="坐席工号" prop="assistno">
              <el-input v-model="formInline.assistno" placeholder="请输入坐席工号"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :md="6" :lg="4">
            <el-form-item label="证件号码" prop="idnum">
              <el-input v-model="formInline.idnum" placeholder="请输入证件号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="客户姓名" prop="customername">
              <el-input v-model="formInline.customername" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="客户账号" prop="cardno">
              <el-input v-model="formInline.cardno" placeholder="请输入客户账号"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :md="6" :lg="4">
            <el-form-item label="多媒体连接号" prop="multimediano">
              <el-input v-model="formInline.multimediano" placeholder="请输入多媒体连接号"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :md="3" :lg="2" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" @click="queryTransaction" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type='warning' icon='el-icon-refresh' @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" @click="exportTransaction" icon="el-icon-download" v-if="btnPermission('Button_TradeDetailQue_Export')">导出</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" >凭证预览</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary">视频下载</el-button>
            </el-form-item>
          </el-col> -->

        </el-row>

      </el-form>
    </el-card>
    
    <el-card>
        <el-table :data="tableDataTransaction" 
        header-row-class-name="tableHeaderClass"
        border style="min-height=390px">
            <el-table-column fixed
               prop="agentserialno" label="交易流水号" width="200px">
            </el-table-column>
            <el-table-column
              prop="workdate" :formatter="dFormat" label="交易日期"  width="100px">
            </el-table-column>
            <el-table-column
              prop="worktime" :formatter="tFormat" label="工作时间"  width="100px">
            </el-table-column>
            <el-table-column
              prop="tradetype" :formatter="typedataFormat" label="交易类型"  width="100px">
            </el-table-column>
            <el-table-column
              prop="tradename" label="交易名称"  width="200px">
            </el-table-column>
            <el-table-column
              prop="tradestatus" :formatter="trandataFormat" label="交易结果"  width="100px">
            </el-table-column>
            <el-table-column
              prop="channeldate" :formatter="dFormat" label="渠道日期"  width="100px">
            </el-table-column>
            <el-table-column
              prop="channelserno" label="渠道流水"  width="290px">
            </el-table-column>
            <el-table-column
              prop="devNum" label="设备编号"  width="100px">
            </el-table-column>
            <el-table-column
              prop="branchName" label="机构名称"  width="200px">
            </el-table-column>
            <el-table-column
              prop="amount" label="交易金额"  width="100px">
            </el-table-column>
            <el-table-column
              prop="bankdate" :formatter="dFormat" label="主机日期"  width="100px">
            </el-table-column>
            <el-table-column
              prop="hostserialno" label="主机流水"  width="200px">
            </el-table-column>
            <el-table-column
              prop="customername" label="客户姓名"  width="100px">
            </el-table-column>
            <el-table-column
              prop="idnum" label="证件号码"  width="200px">
            </el-table-column>
            <el-table-column
              prop="payeraccno" label="付款账号"  width="200px">
            </el-table-column>
            <el-table-column
              prop="payeraccname" label="付款账号名称"  width="200px">
            </el-table-column>
            <el-table-column
              prop="payeeaccno" label="收款账号"  width="200px">
            </el-table-column>
            <el-table-column fixed="right"
              prop="payeeaccname" label="收款账号名称"  width="200px">
            </el-table-column>
        </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        layout="total, prev, pager, next, jumper"
        :total="tableDataTransaction.length">
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import toolBox from "@/utils/toolBox";
import getGlobalParams from "@/utils/getGlobalParams";
import queryTransactionDetail from "@/message/businessQuery/transctionDetail/queryTransactionDetail";
import exportTransactionDetail from "@/message/businessQuery/transctionDetail/exportTransactionDetail";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
export default {
  components: { selectTree },
  data() {
    return {
      pickerOptionsStart:{
        disabledDate(time) {
              let curDate = (new Date()).getTime();
              let one= 30 * 24 * 3600 * 1000;//一个月
              let threeMonths = curDate - one;
              return time.getTime() > Date.now() || time.getTime() < threeMonths;;
        }
      },
      brnoList: [],
      formInline: {
        selBrno: []
      },
      currentPage:1,
      loading: false,
      tableDataTransaction: [],
      typeSpinner: [
        { label: "账务类", value: "0" },
        { label: "签约类", value: "1" },
        { label: "信息维护类", value: "2" }
      ],
      tranSpinner: [
        { label: "成功", value: "0" },
        { label: "失败", value: "1" },
        { label: "超时", value: "2" },
        { label: "已冲正", value: "3" },
        { label: "未处理", value: "4" }
      ],
      transactionType : getGlobalParams.get("transactionType"),
      tradeStatus : getGlobalParams.get("tradeStatus")
    };
  },
  created() {
    //更新进入后的时间输入框的日期
    this.formInline.startdate=toolBox.getNowTime(29);
    this.formInline.enddate=toolBox.getNowTime(0);
    this.pageSize = getGlobalParams.get("PageSize");
    this.initBrno();
    this.queryTransaction();
  },
  methods: {
    dFormat(row, column){
      return toolBox.timeFormat2Date(row[column.property])
    },
    tFormat(row, column){
      return toolBox.timeFormat2Time(row[column.property])
    },
    // 初始化机构下拉框
    initBrno() {
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brnoList = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    typedataFormat(row, column) {
      return this.transactionType[row[column.property]];
    },
    trandataFormat(row, column) {
      return this.tradeStatus[row[column.property]];
    },
    queryTransaction() {
      this.loading = true;
      let resBody = new queryTransactionDetail();
      resBody.data.branchNo=this.formInline.selBrno[0]
      resBody.data.startdate=this.formInline.startdate
      resBody.data.enddate=this.formInline.enddate
      resBody.data.tradetype=this.formInline.tradetype
      resBody.data.devNum=this.formInline.devNum
      resBody.data.agentserialno=this.formInline.agentserialno
      resBody.data.tradestatus=this.formInline.tradestatus
      resBody.data.assistno=this.formInline.assistno
      resBody.data.idnum=this.formInline.idnum
      resBody.data.customername=this.formInline.customername
      resBody.data.cardno=this.formInline.cardno
      resBody.data.multimediano=this.formInline.multimediano

      resBody.QueryPageNo = this.currentPage
      resBody.QueryRowNum = this.pageSize
      request(resBody)
        .then(response => {
          console.log(response);
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableDataTransaction=response.RSP_BODY.tradeinfoList||[];
          }else{
            this.tableDataTransaction=[];
            this.loading = false;
            console.log(response);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    exportTransaction() {
      let resBody = new exportTransactionDetail();
      resBody.data.branchNo=this.formInline.selBrno[0]
      resBody.data.startdate=this.formInline.startdate
      resBody.data.enddate=this.formInline.enddate
      resBody.data.tradetype=this.formInline.tradetype
      resBody.data.devNum=this.formInline.devNum
      resBody.data.agentserialno=this.formInline.agentserialno
      resBody.data.tradestatus=this.formInline.tradestatus
      resBody.data.assistno=this.formInline.assistno
      resBody.data.idnum=this.formInline.idnum
      resBody.data.customername=this.formInline.customername
      resBody.data.cardno=this.formInline.cardno
      resBody.data.multimediano=this.formInline.multimediano

      resBody.QueryPageNo = this.currentPage
      resBody.QueryRowNum = this.pageSize
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.downloadFile(response.RSP_BODY.fileName);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    resetForm(formName) {
      this.formInline.selBrno=[];
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scope>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>