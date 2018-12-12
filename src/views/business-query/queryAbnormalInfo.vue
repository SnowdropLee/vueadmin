<template>
  <div v-loading="loading"
      element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px;overflow: visible;" >
      <el-form :model="formInline" ref="formInline" label-position="top" size="mini">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="机构" prop="branchNo">
              <select-tree :tree-data="brnoList"  v-model="formInline.selBrno"
              :single-check="true" 
              :node-key="'branchId'" 
              :props="{id:'branchId',label:'branchName',children:'childBranch'}"
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
            <el-form-item label="柜员号" prop="tellerNo">
              <el-input v-model="formInline.tellerNo" placeholder="请输入柜员号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="处理标志" prop="expflag">
              <el-select v-model="formInline.expflag" placeholder="请选择处理标志">
                <el-option
                  v-for="item in expflagSpinner"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="渠道编号" prop="channeltype">
              <el-input v-model="formInline.channeltype" placeholder="请输入渠道编号"></el-input>
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
              @click="exportList" v-if="btnPermission('Button_ErrorInfoQue_Export')">导出</el-button>
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
          fixed prop="agentserialno" label="异常流水号" width="120">
        </el-table-column>
        <el-table-column
          prop="workdate" :formatter="dFormat" label="异常日期" width="100">
        </el-table-column>
        <el-table-column
          prop="channeltype" label="渠道号" width="80">
        </el-table-column>
        <el-table-column
          prop="devid" label="设备编号" width="100">
        </el-table-column>
        <el-table-column
          prop="exptype" label="异常类型" width="100">
        </el-table-column>
        <el-table-column
          prop="branchNo" label="机构号" width="80">
        </el-table-column>
        <el-table-column
          prop="tellerNo" label="柜员号" width="80">
        </el-table-column>
        <el-table-column
          prop="expflag" :formatter="expflagFormat" label="处理标志" width="80">
        </el-table-column>
        <el-table-column
          prop="operatetype" :formatter="operatetypeFormat" label="处理类型" width="80">
        </el-table-column>
        <el-table-column
          prop="exptrytimes" label="重复次数" width="80">
        </el-table-column>
        <el-table-column
          prop="expdealstatus" label="处理状态" width="80">
        </el-table-column>
        <el-table-column
          prop="operaterecord" label="处理信息" min-width="150">
        </el-table-column>
        <el-table-column
          prop="explevel" label="异常级别" width="80">
        </el-table-column>
        <el-table-column
          prop="expdesc" label="异常场景描述" width="130">
        </el-table-column>
        <el-table-column
          prop="expbegintime" label="异常开始时间" width="180">
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
import toolBox from "@/utils/toolBox";
import getGlobalParams from "@/utils/getGlobalParams";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import queryAbnormalInfo from "@/message/businessQuery/queryAbnormalInfo/query-abnormal-info";
import exportList from "@/message/businessQuery/queryAbnormalInfo/export";
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
      brnoList: [],
      formInline: {
        startdate: "",
        enddate: "",
        selBrno: [],
        tellerNo: undefined,
        expdealstatus: undefined,
        channeltype: undefined
      },
      currentPage: 1,
      loading:false,
      tableData: [],
      expflagSpinner: [
        { label: "系统", value: "A" },
        { label: "人工", value: "M" }
      ],
      operatetype : getGlobalParams.get("operatetype"),
      expflag : getGlobalParams.get("expflag")
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
    expflagFormat(row, column) {
      return this.expflag[row[column.property]];
    },
    operatetypeFormat(row, column) {
      return this.operatetype[row[column.property]];
    },
    queryInfoList() {
      this.loading = true;
      let resBody = new queryAbnormalInfo();
      resBody.data.startdate = this.formInline.startdate
      resBody.data.enddate = this.formInline.enddate
      resBody.data.branchNo = this.formInline.selBrno[0]
      resBody.data.tellerNo = this.formInline.tellerNo
      resBody.data.expdealstatus = this.formInline.expdealstatus
      resBody.data.channeltype = this.formInline.channeltype
      
      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableData=response.RSP_BODY.expinfoList||[];
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
    exportList() {
      let resBody = new exportList();
      resBody.data.startdate = this.formInline.startdate
      resBody.data.enddate = this.formInline.enddate
      resBody.data.branchNo = this.formInline.selBrno[0]
      resBody.data.tellerNo = this.formInline.tellerNo
      resBody.data.expdealstatus = this.formInline.expdealstatus
      resBody.data.channeltype = this.formInline.channeltype

      
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