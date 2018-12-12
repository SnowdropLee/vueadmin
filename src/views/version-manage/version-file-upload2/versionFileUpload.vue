<template>
  <div v-loading="loading" element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px">
      <el-form :model="formInline" label-position="top" ref="formInline" size="mini">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="版本编号" prop="versionCode">
              <el-select v-model="formInline.versionCode" placeholder="请选择版本编号查询" clearable >
                <el-option v-for="item in verBaseInfo" :key="item.adID" :label="item.versionCode" :value="item.versionCode">
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
      <el-button type='primary' size='mini' icon="el-icon-upload" @click="dialogFileUpload" v-if="btnPermission('Button_VersionUpload_Upload')">上传</el-button>
      <el-button type='danger' size='mini' icon="el-icon-delete" @click="deleteVertionFile" :disabled="isdeleteDisabled" v-if="btnPermission('Button_VersionUpload_Delete')">删除</el-button>

      <el-table :data="tableData" class="tableMarginTop" header-row-class-name="tableHeaderClass" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column fixed prop="versionCode" label="版本编号" min-width="150"></el-table-column>
        <el-table-column prop="verOptionsTemplateName" label="所属模版分类" min-width="180"></el-table-column>
        <el-table-column prop="verCreateTime" label="上传时间" min-width="160"></el-table-column>
        <el-table-column prop="adDescription" label="版本描述" min-width="200"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="80">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="dialogVersionFileList(scope.$index, tableData)">查看详情</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination style="text-align: right; margin-top:20px;" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 50,100]" :page-size="pageSize" background layout="total, prev, pager, next, jumper" :total="tableTotal">
      </el-pagination>
    </el-card>
    <!-- 弹窗 -->
    <keep-alive>
      <component :is='dialogList.fileUploadVersionselection' :option='dialogOptionsFileUpload'></component>
    </keep-alive>

    <keep-alive>
      <component :is='dialogList.versionDeailList' :option='dialogOptionsVersionDetail'></component>
    </keep-alive>

  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import {fileUploadVersionselection} from './dialog';
import versionDeailList from "./dialog/versionDetailList";
import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
import versionQueryList from "@/message/version/versionFileUpload2/query-version-list";
import versionDeleteFile from "@/message/version/versionFileUpload2/version-delete-file";
export default {
  data() {
    return {
      oldvcode: "",
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      formInline: {
        versionCode: ""
      },
      currentPage: 1,
      loading: false,
      tableData: [],
      dialogList: {
        fileUploadVersionselection,
        versionDeailList,
        
      },
      dialogOptionsFileUpload: {
        isShow: false
      },
      dialogOptionsVersionDetail: {
        isShow: false,
        versionCode: "",
        adDescription: ""
      },
      multipleSelection: [],
      verBaseInfo: []
    };
  },
  created() {
    // 调用版本基础信息方法
    this.initSpinnerList();
    // 调用版本文件信息列表
    this.queryInfoList();
  },
  computed: {
    isdeleteDisabled() {
      return !(this.multipleSelection.length === 1);
    }
  },
  methods: {
    /**
     * @desc 初始化版本基础信息下拉框
     */
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
    setversionCode(versioncode) {
      this.formInline.versionCode = versioncode;
    },

    /**
     * @desc 页数改变后查询
     * @param val
     */
    handleSizeChange(val) {
      this.queryInfoList();
    },

    /**
     * @desc 当前页数改变查询
     * @param val
     */
    handleCurrentChange(val) {
      this.queryInfoList();
    },
    /**
     * @description 查询版本信息
     * @param versionCode
     * @param oldvcode
     * @param QueryRowNum
     * @param QueryPageNo
     */
    queryInfoList() {
      this.loading = true;
      let resBody = new versionQueryList();
      resBody.data.versionCode = this.formInline.versionCode; // 都为空
      if (this.formInline.versionCode != this.oldvcode) {
        this.currentPage = 1;
        this.oldvcode = this.formInline.versionCode;
      }
      resBody.QueryRowNum = this.pageSize; // 10
      resBody.QueryPageNo = this.currentPage; // 1
      request(resBody)
        .then(response => {
          // console.log(response)
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableData = response.RSP_BODY.verInfoList || [];
            this.tableTotal = Number(
              response.QUERY_INFO_HEAD.QueryAllDataCount ||
                this.tableData.length
            );
          } else {
            this.$message({
              message: response.SYS_HEAD.ReturnMessage,
              type: "error"
            });
            this.loading = false;
            console.log(response);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log("error", error);
        });
    },

    /**
     * @desc 重置表单
     * @param item
     */
    clearForm(item) {
      this.$refs[item].resetFields();
    },

    /**
     * @desc 上传方法
     * @function dialogFileUpload
     */
    dialogFileUpload() {
      this.dialogOptionsFileUpload.isShow = true;
    },

    /**
     * @desc 查看版本详情
     * @param index
     * @param rows
     */
    dialogVersionFileList(index, rows) {
      this.dialogOptionsVersionDetail.versionCode = rows[index].versionCode;
      this.dialogOptionsVersionDetail.adDescription = rows[index].adDescription;
      this.dialogOptionsVersionDetail.isShow = true;
    },

    /**
     * @desc 选中表格行数据
     * @param val
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * @desc 删除版本文件
     */
    deleteVertionFile() {
      this.$confirm("此操作将永久删除该版本文件, 是否继续?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          this.versionDeleteFile();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * @desc 删除版本文件服务
     * @param versionCode：版本
     */
    versionDeleteFile() {
      let resBody = new versionDeleteFile();
      resBody.data.versionCode = this.multipleSelection[0].versionCode;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.queryInfoList();
            this.initSpinnerList();
            this.clearForm("formInline");
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message({
              message: response.SYS_HEAD.ReturnMessage,
              type: "error"
            });
            console.log(response);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    
  }
};
</script>

<style scope>
</style>