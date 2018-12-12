<template>
  <div v-loading="loading"
        element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px;overflow: visible;">
      <el-form :model="formInline" ref="formInline" size="mini" label-position="top">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="机构" prop="branchNo">
              <select-tree :tree-data="brnoList"  v-model="formInline.selBrno"
              :single-check="true" 
              :node-key="'branchNo'" 
              :props="{id:'branchNo',label:'branchName',children:'childBranch'}"
              ></select-tree>
            </el-form-item>        
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="开始日期" prop="startdate">
              <el-date-picker
                v-model="formInline.startdate"
                :editable=false
                :picker-options="pickerOptionsStart"
                value-format="yyyyMMdd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="结束日期" prop="enddate">
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
            <el-form-item label="设备编号" prop="devNum">
              <el-input v-model="formInline.devNum" placeholder="请选择设备编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="3" :lg="2" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" @click="queryInfoList"
              icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type='warning' icon='el-icon-refresh' 
              @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" icon="el-icon-download" 
              @click="exportInfoList" v-if="btnPermission('Button_CleanMachineQue_Export')">导出</el-button>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </el-card>
    
    <el-card>
        <el-table :data="tableData"
        
        header-row-class-name="tableHeaderClass"
        border style="min-height=390px">
            <el-table-column
              fixed prop="busiseriNo" label="业务流水号" width="120">
            </el-table-column>
            <el-table-column
              prop="workDate" :formatter="dFormat" label="工作日期" width="120">
            </el-table-column>
            <el-table-column
              prop="workTime" :formatter="tFormat" label="工作时间" width="100">
            </el-table-column>
            <el-table-column
              prop="branch" label="机构代码" width="100">
            </el-table-column>
            <el-table-column
              prop="dvcNum" label="设备编号" width="120">
            </el-table-column>
            <el-table-column
              prop="userCode" label="虚拟柜员号" width="100">
            </el-table-column>
            <el-table-column
              prop="operatorNo" label="操作柜员号" width="100">
            </el-table-column>
            <el-table-column
              prop="cardBoxNum" label="卡箱号" width="100">
            </el-table-column>
            <el-table-column
              prop="cardNum" label="清机卡数量" width="100">
            </el-table-column>
            <el-table-column
              prop="vchrserl" label="凭证号段" width="220">
            </el-table-column>
            <el-table-column
              prop="cardTpCode" label="凭证种类代码" width="120">
            </el-table-column>
            <el-table-column
              prop="remark" label="备注" min-width="100">
            </el-table-column>
        </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        layout="total, prev, pager, next, jumper"
        :total="tableData.length">
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import toolBox from "@/utils/toolBox";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import queryCleanManchineRecord from "@/message/businessQuery/queryCleanMachineRecord/query-clean-manchine-record"
import exportCleanManchineRecord from "@/message/businessQuery/queryCleanMachineRecord/export-clean-manchine-record"
export default {
  components: { selectTree },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let one = 30 * 24 * 3600 * 1000; //一个月
          let oneMonths = curDate - one;
          return time.getTime() > Date.now() || time.getTime() < oneMonths;
        }
      },
      brnoList: [], // 机构下拉框数据
      formInline: {
        startdate: "",
        enddate: "",
        devNum: "",
        selBrno: []
      },
      currentPage: 1,
      loading: false,
      tableData: [
        {
          agentserialno: "",
          workdate: "2018--16",
          worktime: "09:08:00",
          branchNo: "010002",
          devNum: "10002",
          virtualteller: "001",
          tellerNo: "02311",
          cardboxno: "F8333201",
          cardcleannum: "3",
          vouchersectionnumber: "18000232-12311123",
          voucherbusitype: "黄金会员",
          remark: ""
        }
      ]
    };
  },
  created() {
    // 初始化日期
    this.formInline.startdate = toolBox.getNowTime(29);
    this.formInline.enddate = toolBox.getNowTime(0);
    this.pageSize = getGlobalParams.get("PageSize");
    this.initBrno()
    this.queryInfoList()
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
    // 查询清机列表信息
    queryInfoList() {
      this.loading = true;
      let resBody = new queryCleanManchineRecord();
      resBody.data.startDate = this.formInline.startdate
      resBody.data.endDate = this.formInline.enddate
      resBody.data.branchNo =this.formInline.selBrno.length>0?this.formInline.selBrno[0]:[]
      resBody.data.devNum = this.formInline.devNum
      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableData = response.RSP_BODY.resultSet||[];
          }else{
            this.tableData=[];
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });

    },
    exportInfoList() {
      let resBody = new exportCleanManchineRecord();
      resBody.data.startDate = this.formInline.startdate
      resBody.data.endDate = this.formInline.enddate
      resBody.data.branchNo = this.formInline.selBrno[0]
      resBody.data.devNum = this.formInline.devNum

      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.downloadFile(response.RSP_BODY.fileName);
          }else{
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