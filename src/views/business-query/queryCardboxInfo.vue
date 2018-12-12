<template>
  <div 
  v-loading="loading"
        element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px;overflow: visible;">
      <el-form :model="formInline" ref="formInline" label-position="top" size="mini">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="机构" prop="branchNo">
               <select-tree :tree-data="brnoList"
               :single-check="true"  
                v-model="formInline.selBrno" :node-key="'branchId'" 
                :props="{id:'branchId',label:'branchName',children:'childBranch'}"
              ></select-tree>
            </el-form-item>        
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="设备编号" prop="devNum">
              <el-input v-model="formInline.devNum" placeholder="请输入设备编号"></el-input>
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
              @click="export_CardboxInfo" v-if="btnPermission('Button_CardBoxQue_Export')">导出</el-button>
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
              fixed prop="cardboxno" label="卡箱号" width="150">
            </el-table-column>
            <el-table-column
              prop="devNum" label="设备编号" width="120">
            </el-table-column>
            <el-table-column
              prop="branchNo" label="机构号" width="120">
            </el-table-column>
            <el-table-column
              prop="operater" label="上次清机操作员" width="120">
            </el-table-column>
            <el-table-column
              prop="lastcleandate" :formatter="dFormat" label="上次清机日期" width="150">
            </el-table-column>
            <el-table-column
              prop="lastcleantime" :formatter="tFormat" label="上次清机时间" width="150">
            </el-table-column>
            <el-table-column
              prop="virtualteller" label="虚拟柜员号" width="130">
            </el-table-column>
            <el-table-column
              prop="addcardnum" label="加卡数量" width="130">
            </el-table-column>
            <el-table-column
              prop="fknum" label="成功发卡数量" width="120">
            </el-table-column>
            <el-table-column
              prop="kxxczs" label="卡箱现存张数" width="120">
            </el-table-column>
            <el-table-column
              prop="reatincardnum" label="吞卡数量" width="180">
            </el-table-column>
            <el-table-column
              prop="operatetype" label="操作" min-width="120">
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
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import toolBox from "@/utils/toolBox";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import queryCardboxInfo from "@/message/businessQuery/queryCardboxInfo/query-cardbox-info"
import exportCardboxInfo from "@/message/businessQuery/queryCardboxInfo/export-cardbox-info"

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
        devNum: undefined,
        selBrno: [],
      },
      currentPage: 1,
      loading:false,
      tableData: []
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
    queryInfoList() {
      this.loading = true;
      let resBody = new queryCardboxInfo();

      resBody.data.branchNo = this.formInline.selBrno[0]
      resBody.data.devNum = this.formInline.devNum

      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableData = response.RSP_BODY.cardInfoList||[];
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
    export_CardboxInfo() {
      let resBody = new exportCardboxInfo();
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