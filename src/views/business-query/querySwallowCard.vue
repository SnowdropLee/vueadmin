<template>
  <div v-loading="loading"
        element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px;overflow: visible;">
      <el-form :model="formInline" ref="formInline" label-position="top" size="mini">
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
            <el-form-item label="吞卡标志" prop="reatincardtype">
              <el-select v-model="formInline.reatincardtype" placeholder="选择吞卡标志">
                <el-option
                  v-for="item in typereatincardtype"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>            
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="处理标志" prop="reatincarddealflag">
              <el-select v-model="formInline.reatincarddealflag" placeholder="请选择处理标志">
                <el-option
                  v-for="item in typereatincarddealflag"
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
              @click="export_SwallowCard" v-if="btnPermission('Button_SwallowCardQue_Export')">导出</el-button>
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
              fixed prop="busiseriNo" label="业务流水号" width="130">
            </el-table-column>
            <el-table-column
              prop="workDate" :formatter="dFormat" label="交易日期" width="100">
            </el-table-column>
            <el-table-column
              prop="workTime" :formatter="tFormat" label="工作时间" width="80">
            </el-table-column>
            <el-table-column
              prop="serviceCode" label="平台服务码" width="160">
            </el-table-column>
            <el-table-column
              prop="userCode" label="虚拟柜员" width="80">
            </el-table-column>
            <el-table-column
              prop="retCardFlag" :formatter="reatincardtypeFormat" label="吞卡标志" width="140">
            </el-table-column>
            <el-table-column
              prop="branch" label="机构号" width="80">
            </el-table-column>
            <el-table-column
              prop="dvcTp" label="设备类型" width="80">
            </el-table-column>
            <el-table-column
              prop="dvcNum" label="设备编号" width="100">
            </el-table-column>
            <el-table-column
              prop="cardNum" label="卡号" width="150">
            </el-table-column>
            <el-table-column
              prop="vchrNum" label="凭证号码" width="120">
            </el-table-column>
            <el-table-column
              prop="rsnCode" label="错误代码" width="80">
            </el-table-column>
            <el-table-column
              prop="rsnDsc" label="错误描述" min-width="120">
            </el-table-column>
            <el-table-column
              prop="reatincarddealflag" :formatter="reatincarddealflagFormat" label="吞卡处理标志" width="120">
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
import querySwallowCard from "@/message/businessQuery/querySwallowCard/query-swallow-card"
import exportSwallowCard from "@/message/businessQuery/querySwallowCard/export-Swallow-Card"

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
        startdate: "20180601",
        enddate: "20180630",
        selBrno: [],
        devNum: "",
        reatincardtype: "",
        reatincarddealflag: "",
        expdealstatus: ""
      },
      currentPage: 1,
      loading:false,
      tableData: [],
      typereatincardtype: [
        { label: "开卡过程中吞卡 ", value: "0" },
        { label: "非开卡过程中吞卡", value: "1" }
      ],
      typereatincarddealflag: [
        { label: "吞卡 ", value: "0" },
        { label: "已上缴", value: "1" },
        { label: "已处理 ", value: "2" }
      ],
      reatincarddealflagtype : getGlobalParams.get("reatincarddealflagtype"),
      reatincardtypetype : getGlobalParams.get("reatincardtypetype")
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
    reatincarddealflagFormat(row, column) {
      return this.reatincarddealflagtype[row[column.property]];
    },
    reatincardtypeFormat(row, column) {
      return this.reatincardtypetype[row[column.property]];
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
    queryInfoList() {
      this.loading = true;
      let resBody = new querySwallowCard();
      resBody.data.startDate = this.formInline.startdate
      resBody.data.endDate = this.formInline.enddate
      resBody.data.retCardFlag = this.formInline.reatincardtype
      resBody.data.solveFlag = this.formInline.reatincarddealflag
      // resBody.data.expdealstatus = this.formInline.expdealstatus
      resBody.data.branchNo = this.formInline.selBrno.length>0?this.formInline.selBrno[0]:[]
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
            console.log(response);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    export_SwallowCard() {
      let resBody = new exportSwallowCard();
      resBody.data.startDate = this.formInline.startdate
      resBody.data.endDate = this.formInline.enddate
      resBody.data.reatincardtype = this.formInline.reatincardtype
      resBody.data.reatincarddealflag = this.formInline.reatincarddealflag
      resBody.data.expdealstatus = this.formInline.expdealstatus
      resBody.data.branchNo = this.formInline.selBrno[0]
      resBody.data.devNum = this.formInline.devNum

      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.downloadFile(response.RSP_BODY.fileName);
          }else{
            console.log(response);
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
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
</style>