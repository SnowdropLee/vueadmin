<template>
  <div class="boot-rate-form-manage" v-loading="loading"
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
                  <el-col :md="6" :lg="4">
                        <el-form-item label='开始日期' class='typeInfo-el-form-item' prop='sTime'>
                          <el-date-picker
                            v-model="queryForm.sTime"
                            value-format="yyyyMMdd"
                            type="date"
                            placeholder="选择日期">
                          </el-date-picker>
                        </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                        <el-form-item label='结束日期' class='typeInfo-el-form-item' prop='eTime'>
                          <el-date-picker
                            v-model="queryForm.eTime"
                            value-format="yyyyMMdd"
                            type="date"
                            placeholder="选择日期">
                          </el-date-picker>
                        </el-form-item>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                      <el-button type='primary' size='mini' class='b-button' icon="el-icon-download" @click="getExcel" v-if="btnPermission('Button_RunRateRep_Export')">导出</el-button>
                      <!-- <el-button type="primary" icon="el-icon-download" @click="exportList">导出</el-button> -->
                  </el-col>
              </el-row>
         </el-form>
      </el-card>
       <el-card class='type-info-bottom' >
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
                 <el-table-column fixed prop='devid' label='设备编号' ></el-table-column>
                 <el-table-column prop='BRNO' label='机构编号' ></el-table-column>
                 <el-table-column prop='BRNONAME' label='机构名称' ></el-table-column>
                 <el-table-column prop='DEVADRESS' label='装机地址' ></el-table-column>
                 <el-table-column prop='SERVICESTOPTIME' label='维护停机时间' width="120px"></el-table-column>
                 <el-table-column prop='TROUBLESTOPTIME' label='故障停机时间' width="120px"></el-table-column>
                 <el-table-column prop='OFFLINESTOPTIME' label='离线停机时间' width="120px"></el-table-column>
                 <el-table-column prop='TROUBLEALLTIME' label='合计故障时间' width="120px"></el-table-column>
                 <el-table-column prop='DEVSTOPTIME' label='设备报停时间' width="120px"></el-table-column>
                 <el-table-column prop='ALLWORKTIME' label='累计工作时间' width="120px"></el-table-column>
                 <el-table-column prop='OPENINGTIME' label='规定营业时间' width="120px"></el-table-column>
                 <el-table-column prop='OPENRATE' label='开机率' ></el-table-column>
                 <el-table-column prop='OFFLINESTOPRATE' label='离线停机率' width="100px"></el-table-column>
                 <el-table-column prop='SERVICESTOPRATE' label='维护停机率' width="100px"></el-table-column>
                 <el-table-column prop='TROUBLESTOPRATE' label='故障停机率' width="100px"></el-table-column>
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
//通讯相关
import request from "@/utils/request";
import bootRateTableIns from "@/message/reportFormsManage/boot-rate-table";
import bootRateExcelIns from "@/message/reportFormsManage/boot-rate-excel";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "boot-rate-form-manage",
  components: { selectTree },
  data() {
    return {
      loading: false,
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
      brno: [],
      tableData: [],
      tableTotal: 0,
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      queryForm: {
        branchId: [],
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
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    async queryModel() {
      this.loading = true;
      let resBody = new bootRateTableIns();
      resBody.data.branchNo = this.queryForm.branchId;
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
      let resBody = new bootRateExcelIns();
      resBody.data.branchNo = this.queryForm.branchId.join(",");
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
  async created() {
    let resBody = new spinnerList();
    resBody.data.spinnerList = [{ spinnerName: "branch" }];
    let response = await request(resBody);

    if (response.SYS_HEAD.ReturnCode == "000000") {
      //在之后要塞入空选项
      this.brno = response.RSP_BODY.branchSpinner;
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
