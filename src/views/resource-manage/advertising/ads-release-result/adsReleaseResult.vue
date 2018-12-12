<template>
  <div v-loading="loading" element-loading-text="加载中。。。">
    <el-card style="margin-bottom:10px">
      <el-form :model="form" label-position="top" ref="form" size="mini">
          <el-row :gutter="10">
              <el-col :md="6" :lg="4">
                    <el-form-item label='机构编号' prop='branchId'>
                          <select-tree ref="tree" v-model="form.branchId"
                            :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                    </el-form-item>
              </el-col>
            <el-col :md="3" :lg="2" class="searchBtnMarginTop">
              <el-form-item>
                <el-button type="primary" @click="onSubmit"
                icon="el-icon-search">查询</el-button>
              </el-form-item>
            </el-col>
            <el-col :md="3" :lg="2" class="searchBtnMarginTop">
              <el-form-item>
                <el-button type='warning' icon='el-icon-search' 
                @click="clearForm('form')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
    </el-card>
    
    <el-card>
        <el-table
            :data="tableData"
            header-row-class-name="tableHeaderClass"
            border>
            <el-table-column
            fixed
            prop="devNum"
            label="设备编号">
            </el-table-column>
            <el-table-column
            prop="devBrnoName"
            label="所在机构">
            </el-table-column>
            <!-- <el-table-column
            prop="dqdhName"
            label="所在地区">
            </el-table-column> -->
            <el-table-column
            prop="tempIdName"
            label="模板名称">
            </el-table-column>
            <el-table-column
            prop="creatUser"
            label="发布人员">
            </el-table-column>
            <el-table-column
            prop="createDateTime"
            label="发布时间">
            </el-table-column>
        </el-table>
      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import selectTree from "@/components/selectTree2/";

import request from "@/utils/request";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";
import tableIns from "@/message/resourceManage/advertising/ad-release-table";

export default {
  data() {
    return {
      total: 0,
      form: {
        branchId: []
      },
      brIDwatch:[],
      brno: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
      tableData: []
    };
  },
  components: { selectTree },
  methods: {
    clearForm(formName){
      this.form.branchId=[],
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
      this.queryTabel();
    },
    onSubmit() {
      this.queryTabel();
    },
    async queryTabel() {
      //设备类型查询列表
      this.loading = true;
      let resBody = new tableIns();
      // console.log(this.form.branchId);
      resBody.data.branId = this.form.branchId;
      if(this.form.branchId != this.brIDwatch){
          this.currentPage=1;
          this.brIDwatch=this.form.branchId;
      }

      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.resultSet||[];
        this.total = Number(response.RSP_BODY.total||response.QUERY_INFO_HEAD.QueryAllDataCount||tableData.length);
      } else {
        this.$message({
          type: "error",
          message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
        });
      }
    },
  },
  async created() {
    let resBody = new spinnerList();
    resBody.data.spinnerList = [
      { spinnerName: "branch" }
    ];
    let response = await request(resBody);

    if (response.SYS_HEAD.ReturnCode == "000000") {
      //在之后要塞入空选项
      this.brno = response.RSP_BODY.branchSpinner;
    } else {
      this.$message({
        type: "error",
        message:
          "请求失败，错误码:" +
          response.SYS_HEAD.ReturnCode +
          "，错误信息：" +
          response.SYS_HEAD.ReturnMessage
      });
    }
    this.queryTabel();
  }
};
</script>

<style lang="scss" scope>
.el-card {
  overflow: inherit;
}
</style>