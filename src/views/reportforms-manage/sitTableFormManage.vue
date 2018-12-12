<template>
  <div class="sit-table-form-manage" v-loading="loading"
             element-loading-text="加载中。。。">
    <div>
       <el-card class='type-info-box-card'>
         <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top'>
              <el-row  :gutter="10">
                  <el-col :md="6" :lg="4">
                        <el-form-item label='坐席工号' class='typeInfo-el-form-item' prop='sitNum'>
                            <el-input v-model='queryForm.sitNum'
                            placeholder="请输入坐席工号"  ></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                        <el-form-item label='报表类型' class='typeInfo-el-form-item'>
                                 <el-cascader v-model='formType' :props="{value:'type',label:'typeName'}" 
                             :options='formTypeOptions' filterable></el-cascader>
                        </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                        <el-form-item label='开始日期' class='typeInfo-el-form-item' prop='sTime'>
                          <el-date-picker
                            v-model="queryForm.sTime"
                            :type="formType[0]=='day'?'date':formType[0]=='mon'?'month':formType[0]=='year'?'year':'date'"
                            :value-format="formType[0]=='day'?'yyyyMMdd':formType[0]=='mon'?'yyyyMM':formType[0]=='year'?'year':'yyyy'"
                            placeholder="选择日期">
                          </el-date-picker>
                                 <!-- <el-input type="date" v-model='queryForm.sTime'  
                            placeholder="起始日期"  ></el-input> -->
                        </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                        <el-form-item label='结束日期' class='typeInfo-el-form-item' prop='eTime'>
                          <el-date-picker
                            v-model="queryForm.eTime"
                            :type="formType[0]=='day'?'date':formType[0]=='mon'?'month':formType[0]=='year'?'year':'date'"
                            :value-format="formType[0]=='day'?'yyyyMMdd':formType[0]=='mon'?'yyyyMM':formType[0]=='year'?'year':'yyyy'"
                            placeholder="选择日期">
                          </el-date-picker>
                                 <!-- <el-input type="date" v-model='queryForm.eTime'  
                            placeholder="结束日期"  ></el-input> -->
                        </el-form-item>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                      <el-button type='primary' size='mini' class='b-button' icon="el-icon-download" @click="getExcel" v-if="btnPermission('Button_SitTableRep_Export')">导出</el-button>
                  </el-col>
              </el-row>
         </el-form>
      </el-card>
       <el-card class='type-info-bottom'>
          <!-- <el-row >
              <el-col :md="3" :lg="2" >
                  <el-button type='primary' size='mini' class='b-button' @click="getExcel">导出报表</el-button>
              </el-col>
          </el-row> -->
          <el-table 
          ref="tableData" 
          :data='tableData' 
          header-row-class-name="tableHeaderClass"
          class="tableMarginTop"
          border
          >
               <!-- 这里的prop按照返回的字段去更新 -->
                 <el-table-column prop='WORKDATE' :formatter="dateFormat" label='日期' ></el-table-column>
                 <el-table-column prop='AGENTID' label='工号' ></el-table-column>
                 <el-table-column prop='AGENTNAME' label='姓名' ></el-table-column>
                 <el-table-column prop='CONNECTNUM' label='接通通数' ></el-table-column>
                 <el-table-column prop='BUSNUM' label='办理业务笔数' ></el-table-column>
                 <el-table-column prop='CONNECTIME' label='通话时长' ></el-table-column>
                 <el-table-column prop='BUSAVGTIME' label='单笔业务办理时长' width="160px"></el-table-column>
                 <el-table-column prop='BUSOCCUPCY' label='呼入项目占有率' ></el-table-column>
          </el-table>
           <div class="box">
                    <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10, 20, 50,100]"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="tableTotal"> 
                    </el-pagination>
         </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import toolBox from "@/utils/toolBox";
//通讯相关
import request from "@/utils/request";
import sitTableDayIns from "@/message/reportFormsManage/sit-form-table-day";
import sitTableMonIns from "@/message/reportFormsManage/sit-form-table-mon";
import sitTableYearIns from "@/message/reportFormsManage/sit-form-table-year";
import sitExcelDayIns from "@/message/reportFormsManage/sit-form-excel-day";
import sitExcelMonIns from "@/message/reportFormsManage/sit-form-excel-mon";
import sitExcelYearIns from "@/message/reportFormsManage/sit-form-excel-year";
// import devRunList from '@/message/spinnerDataQuery/spinner-data-query';
// import InquireModel from "@/message/dev-run-info-query";

export default {
  name: "sit-table-form-manage",
  data() {
    return {
      loading:false,
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      formType: ["day"],
      branchIdOptions: [
        { branchId: "", branchName: "" },
        { branchId: "0322", branchName: "北京银行万寿路支行" },
        { branchId: "0321", branchName: "浦发银行支行" },
        { branchId: "0323", branchName: "北行金融街支行" },
        {
          branchId: "0327",
          branchName: "花旗银行",
          children: [
            {
              value: "032784",
              label: "花旗银行北京分行",
              children: [
                {
                  value: "032781",
                  label: "花旗银行北京分行xx支行"
                },
                {
                  value: "032783",
                  label: "花旗银行北京分行xxx支行"
                },
                {
                  value: "032787",
                  label: "花旗银行北京分行xxxx支行"
                },
                {
                  value: "032782",
                  label: "花旗银行北京分行xxxxxx支行"
                }
              ]
            }
          ]
        }
      ],
      formTypeOptions: [
        { type: "day", typeName: "日报" },
        { type: "mon", typeName: "月报" },
        { type: "year", typeName: "年报" }
      ],
      tableData: [],
      tableTotal: 0,
      currentPage: 1,
      queryForm: {
        agentId: "",
        sTime: "",
        eTime: ""
      }
    };
  },
   mounted() {
    // console.log(this.devNumberTableData);
    this.queryModel();
  },
  methods: {
    dateFormat(row, column){
      return toolBox.timeFormat2Date(row[column.property]);
    },
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    async queryModel() {
      this.loading = true;
      if (this.formType[0] == "day") {
        var resBody = new sitTableDayIns();
      } else if (this.formType[0] == "mon") {
        var resBody = new sitTableMonIns();
      } else if (this.formType[0] == "year") {
        var resBody = new sitTableYearIns();
      } else {
        return;
      }
      resBody.data.agentId = this.queryForm.sitNum;
      resBody.data.startTime = this.queryForm.sTime;
      resBody.data.endTime = this.queryForm.eTime;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.resultSet;
        this.tableTotal = response.RSP_BODY.total||response.QUERY_INFO_HEAD.QueryAllDataCount;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    async getExcel() {
      this.loading = true;
      if (this.formType[0] == "day") {
        var resBody = new sitExcelDayIns();
      } else if (this.formType[0] == "mon") {
        var resBody = new sitExcelMonIns();
      } else if (this.formType[0] == "year") {
        var resBody = new sitExcelYearIns();
      } else {
        return;
      }
      resBody.data.agentId = this.queryForm.agentId;
      resBody.data.startTime = this.queryForm.sTime;
      resBody.data.endTime = this.queryForm.eTime;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.downloadFile(response.RSP_BODY.fileName);
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    handleSizeChange() {
      this.queryModel();
    },
    handleCurrentChange() {
      this.queryModel();
    }
  },
  watch:{
    formType(){
      this.queryForm.sTime="";
      this.queryForm.eTime="";
    }
  },
  created() {}
};
</script>


<style lang="scss" scoped>
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
</style>
