<template>
  <div class="selfser-dev-form-manage" v-loading="loading"
             element-loading-text="加载中。。。">
    <div  v-if="!dialogOptions.isShow">
       <el-card class='type-info-box-card'>
         <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top'>
              <el-row  :gutter="10">
                  <el-col :md="6" :lg="4">
                        <el-form-item label='机构名称' class='typeInfo-el-form-item' prop='branchId'>
                            <select-tree ref="tree" v-model="queryForm.branchId"
                               :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                        </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                        <el-form-item label='设备号' class='typeInfo-el-form-item' prop='devId'>
                                 <el-input v-model='queryForm.devId'  
                            placeholder="请输入设备号"  ></el-input>
                        </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                        <el-form-item label='设备IP' class='typeInfo-el-form-item' prop='devIp'>
                                 <el-input v-model='queryForm.devIp'  
                            placeholder="请输入设备IP"  ></el-input>
                        </el-form-item>
                  </el-col>
                  
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                      <el-button type='primary' size='mini' class='b-button' icon="el-icon-download" @click="getExcel" v-if="btnPermission('Button_SelfDevInfoRep_Export')">导出</el-button>
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
           ref="tableData" :data='tableData' 
           header-row-class-name="tableHeaderClass"
            class="tableMarginTop"
            border
           >
               <el-table-column prop='DEVBRANCHID' label='机构编码' ></el-table-column>
               <el-table-column prop='DEVID' label='设备号'></el-table-column>
               <el-table-column prop='DEVUSESTATE' label='离行/在行标志' ></el-table-column>
               <el-table-column prop='DEVMODEL' label='设备型号' ></el-table-column>
               <el-table-column prop='BRANCHNAME' label='机构名称' ></el-table-column>
               <el-table-column prop='DEVIP' label='IP地址' ></el-table-column>
               <el-table-column prop='DEVSTATE' label='设备使用状态' ></el-table-column>
               <el-table-column prop='DEVFORMNUM' label='装机方式' ></el-table-column>
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
      
      <!-- 弹窗 -->
      <!-- <keep-alive>
         <component :is='dialogList.devRunDetailInfo' :option='dialogOptions'></component>
      </keep-alive> -->
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import selectTree from "@/components/selectTree2/";

//通讯相关
import request from "@/utils/request";
import selfserTableIns from "@/message/reportFormsManage/selfser-table";
import selfserExcelIns from "@/message/reportFormsManage/selfser-excel";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "selfser-dev-form-manage",
  components: { selectTree },
  data() {
    return {
      //页面公用
      loading: "",
      //
      brno: [],
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      tableData: [],
      currentPage: 1,
      queryForm: {
        branchId: [],
        devIp: "",
        devId: ""
      },
      // deviceTypeSpinner: [],
      // defaultProps: {
      //   value: "devTypeNum",
      //   label: "devType"
      // },
      //    dialogList:{devRunDetailInfo},
      dialogOptions: { isShow: false }
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
    detailInfo() {
      console.log("应该做点什么");
      //  this.dialogOptions.isShow=true
    },
    async queryModel() {
      this.loading = true;
      let resBody = new selfserTableIns();
      resBody.data.branchId = this.queryForm.branchId;
      resBody.data.devIp = this.queryForm.devIp;
      resBody.data.devId = this.queryForm.devId;
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
      this.loading=true;
      let resBody = new selfserExcelIns();
      resBody.data.branchId = this.queryForm.branchId.join(",");
      resBody.data.devIp = this.queryForm.devIp;
      resBody.data.devId = this.queryForm.devId;

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
.el-card {
  overflow: visible;
}
</style>
