<template>
  <div class="dev-number-form-manage" v-loading="loading"
             element-loading-text="加载中。。。">
    <div  v-if="!dialogOptions.isShow">
       <el-card class='type-info-box-card'>
         <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top'>
              <el-row  :gutter="10">
                  <el-col :md="6" :lg="4">
                        <el-form-item label='机构编号' class='typeInfo-el-form-item' prop='branchId'>
                            <select-tree ref="tree" v-model="queryForm.branchId"
                               :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                        </el-form-item>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                      <el-button type='primary' size='mini' class='b-button' icon="el-icon-download" @click="getExcel" v-if="btnPermission('Button_DevNumRep_Export')">导出</el-button>
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
          ref="devNumberTableData" 
          :data='devNumberTableData' 
          header-row-class-name="tableHeaderClass"
            class="tableMarginTop"
            border
          >
               <el-table-column prop='BRANDNAME' label='设备品牌' ></el-table-column>
               <el-table-column prop='DEVTYPE' label='设备类型'></el-table-column>
               <el-table-column prop='DEVMODEL' label='设备型号' ></el-table-column>
               <el-table-column prop='SUMDEVID' label='设备数量' ></el-table-column>
               <!-- 暂时去掉查看详情!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
               <!-- <el-table-column prop='' label='操作' align="center" fixed="right" width="80">
                   <template slot-scope="scope">
                       <el-button size="mini" type="text" @click="detailInfo">查看详情</el-button>
                   </template>
               </el-table-column> -->
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
import selectTree from "@/components/selectTree2/index";

//通讯相关
import request from "@/utils/request";
import devNumberExcelIns from "@/message/reportFormsManage/dev-number-Excel";
import devNumberTableIns from "@/message/reportFormsManage/dev-number-table";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "dev-number-form-manage",
  components: { selectTree },
  data() {
    return {
      //页面公用
      loading: false,
      //form表单
      brno: [],
      queryForm: {
        branchId: [] //这里要和组件的类型和规则一致，在提交前自己做格式化 不然绑定数据后会报错
      },
      //table
      devNumberTableData: [],
      currentPage: 1,
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      //弹窗
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
      let resBody = new devNumberTableIns();
      resBody.data.branchId = this.queryForm.branchId;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        var resultArr = response.RSP_BODY.resultSet;
        this.devNumberTableData = resultArr;
        console.log(this.devNumberTableData);
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
      let resBody = new devNumberExcelIns();
      resBody.data.branchId = this.queryForm.branchId[0];
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
  overflow: inherit;
}
</style>
