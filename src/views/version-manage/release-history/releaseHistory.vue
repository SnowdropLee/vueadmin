<template>
  <div v-loading="loading" element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px">
      <el-form :model="formInline" label-position="top" ref="formInline" size="mini">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="版本编号" prop="versionCode">
              <el-select v-model="formInline.versionCode" placeholder="请选择版本编号查询" clearable>
                <el-option v-for="item in verBaseInfo" :key="item.adID" :label="item.versionCode" :value="item.versionCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="设备编号" prop="devNum">
              <el-input v-model="formInline.devNum" placeholder="请输入设备编号检索"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="版本操作结果" prop="adStatus">
              <el-select v-model="formInline.adStatus" placeholder="请选择版本操作结果">
                <el-option v-for="item in adStatusSpinner" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="3" :lg="2" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" @click="queryInfoList" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type='warning' icon='el-icon-refresh' @click="clearForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" header-row-class-name="tableHeaderClass" border>
        <el-table-column fixed prop="devNum" label="设备编号" width="100"></el-table-column>
        <el-table-column prop="versionCode" label="版本编号" width="150"></el-table-column>
        <el-table-column prop="verUpdateCreateTime" :formatter="dtFormat" label="初始发布时间" width="180"></el-table-column>
        <el-table-column prop="verUpdateUpdateTime" :formatter="dtFormat" label="更新汇报时间" width="180"></el-table-column>
        <el-table-column prop="adDescription" label="版本描述" width="150"></el-table-column>
        <el-table-column prop="adStatus" :formatter="Format" label="版本操作结果" width="150"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
      </el-table>

      <el-pagination style="text-align: right; margin-top:20px;" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 50,100]" :page-size="pageSize" background layout="total, prev, pager, next, jumper" :total="tableTotal">
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
import toolBox from "@/utils/toolBox";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import releaseHistory from "@/message/version/releaseHistory/release-history";
import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
export default {
  data() {
    return {
      pageSize: getGlobalParams.get("PageSize"),
      tableTotal: 0,
      formInline: {
        versionCode: "",
        devNum: "",
        adStatus: ""
      },
      currentPage: 1,
      loading: false,
      tableData: [],
      verBaseInfo: [],
      adStatusSpinner: [
        { label: "已发送通知", value: "0" },
        { label: "C端已受理", value: "1" },
        { label: "C端更新策略已下载", value: "2" },
        { label: "版本升级成功", value: "3" },
        { label: "版本升级失败", value: "4" }
      ],
      adStatustype: getGlobalParams.get("adStatustype")
    };
  },
  created() {
    this.initSpinnerList();
    this.queryInfoList()
  },
  methods: {
    initSpinnerList() {
      let resBody = new spinnerDataQuery();
      resBody.data.spinnerList = [{ spinnerName: "branchVerBaseInfo" }];
      request(resBody)
        .then(response => {
          // console.log(response)
          this.verBaseInfo = response.RSP_BODY.verBaseInfoSpinner || [];
          // this.verBaseInfo.unshift({});
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },
    Format(row, column) {
      return this.adStatustype[row[column.property]];
    },
    dtFormat(row, column) {
      return toolBox.timeFormat(row[column.property]);
    },
    handleSizeChange(val) {
      this.queryInfoList();
    },
    handleCurrentChange(val) {
      this.queryInfoList();
    },

    /**
     * @desc 查询版本发布记录列表信息
     */
    queryInfoList() {
      this.loading = true;
      let resBody = new releaseHistory();
      resBody.data.versionCode = this.formInline.versionCode;
      resBody.data.adStatus = this.formInline.adStatus;
      resBody.data.devNum = this.formInline.devNum;

      resBody.QueryRowNum = this.pageSize;
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          // console.log(response)
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableData = response.RSP_BODY.verUpdateLogInfoList || [];
            this.tableTotal = Number(
              response.QUERY_INFO_HEAD.QueryAllDataCount ||
                this.tableData.length
            );
          } else {
            this.loading = false;
            console.log(response);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log("error", error);
        });
    },
    clearForm(item) {
      this.$refs[item].resetFields();
    }
  }
};
</script>

<style scope>
</style>