<template>
  <div class="cash-plan-form-manage" v-loading="loading"
             element-loading-text="加载中。。。">
    <div>
       <el-card class='type-info-box-card'>
         <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top'>
              <el-row  :gutter="10">
                  <el-col :md="6" :lg="4">
                        <el-form-item label='机构编号' class='typeInfo-el-form-item' prop='branchId'>
                              <select-tree ref="tree" v-model="queryForm.branchId"
                               :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                        </el-form-item>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop" >
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop" >
                        <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop" >
                    <el-button type='primary' size='mini' class='b-button' icon="el-icon-download" @click="getExcel" v-if="btnPermission('Button_CashRep_Export')">导出</el-button>                    
                  </el-col>
                  
              </el-row>
         </el-form>
      </el-card>
       <el-card class='type-info-bottom'>
          <el-row >
              <!-- <el-col :md="3" :lg="2" >
                  <el-button type='primary' size='mini' class='b-button' @click="getExcel">导出报表</el-button>
              </el-col> -->
              <!-- <el-col :md="3" :lg="2" >
                  <el-button type='danger' size='mini'  class='b-button'>其他功能</el-button>
              </el-col> -->
          </el-row>
          <el-table 
          ref="tableData" 
          :data='tableData' 
          header-row-class-name="tableHeaderClass"
          class="tableMarginTop"
          border
          >
               <!-- 这里的prop按照返回的字段去更新 -->
                 <el-table-column prop='BRNO' label='机构' ></el-table-column>
                 <el-table-column prop='DEVID' label='设备ID' ></el-table-column>
                 <el-table-column prop='ADDRESS' label='安装地址' ></el-table-column>
                 <el-table-column prop='CASHPLANDATE' label='推荐加钞日期'  :formatter="dateFormat"></el-table-column>
                 <el-table-column prop='CASHPLANAMOUNT' label='推荐加钞金额（元）' ></el-table-column>
                 <el-table-column prop='DAYUSEAMOUNT' label='日均消耗金额（元）' ></el-table-column>
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
import selectTree from "@/components/selectTree2/";
import toolBox from "@/utils/toolBox";
//通讯相关
import request from "@/utils/request";
import cashTableIns from "@/message/reportFormsManage/cash-plan-form-table";
import cashExcelIns from "@/message/reportFormsManage/cash-plan-form-excel";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "cash-plan-form-manage",
  components: { selectTree },
  data() {
    return {
      //页面公用
      loading: false,
      //表格
      brno: [],
      tableTotal: 0,
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
        { type: 1, typeName: "a型报表" },
        { type: 2, typeName: "b型报表" },
        { type: 3, typeName: "c型报表" },
        { type: 4, typeName: "d型报表" }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      queryForm: {
        branchId: []
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
      let resBody = new cashTableIns();
      resBody.data.branchNo = this.queryForm.branchId;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.resultSet;
        this.tableTotal = response.RSP_BODY.total * 1||response.QUERY_INFO_HEAD.QueryAllDataCount;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    async getExcel() {
      this.loading = true;
      let resBody = new cashExcelIns();
      resBody.data.branchNo = this.queryForm.branchId.join(",");
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
  async created() {
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
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
    }
  }
};
</script>


<style lang="scss">
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
.el-card {
  overflow: inherit;
}
</style>
