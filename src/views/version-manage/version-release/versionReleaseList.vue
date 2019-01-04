<template>
  <div v-loading="loading" element-loading-text="拼命加载中">
    <!-- <el-card style="margin-bottom:10px">
      <el-form :model="formInline" ref="formInline" label-position="top" size="mini">
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
              <el-input v-model="formInline.devNum" placeholder="请输入设备编号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="3" :lg="2" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" @click="queryInfoList" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('formInline')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card> -->

    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type='primary' size='mini' @click="dialogVersionRelease" v-if="btnPermission('Button_VersionRelease_Release')">版本发布</el-button>
        </el-col>
        <el-col :span="6" :offset="16" class="inlineform">
          <el-form :model="formInline" ref="formInline" label-position="top" size="mini" :inline="true">
            <el-form-item prop="versionCode">
              <el-select v-model="formInline.versionCode" placeholder="请选择版本编号查询" clearable>
                <el-option v-for="item in verBaseInfo" :key="item.adID" :label="item.versionCode" :value="item.versionCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryInfoList" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('formInline')">重置</el-button>
            </el-form-item>
          </el-form>  
        </el-col>
      </el-row>
      <!-- <el-button type='primary' size='mini' @click="dialogVersionRelease" v-if="btnPermission('Button_VersionRelease_Release')">版本发布</el-button> -->
      <el-table border class="tableMarginTop" :data="tableData" header-row-class-name="tableHeaderClass">
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <!-- <el-table-column fixed prop="devNum" label="设备编号" min-width="100" align="center"></el-table-column> -->
        <el-table-column prop="versioncode" label="版本编号" min-width="140" align="left"></el-table-column>
        <el-table-column prop="versiondesc" label="版本描述" min-width="220" align="left"></el-table-column>
        <el-table-column prop="strategy_template_name" label="版本策略" min-width="220" align="left"></el-table-column>
        <!-- <el-table-column prop="branchNo" label="所属网点" min-width="120" align="center"></el-table-column> -->
        <!-- <el-table-column prop="isEffective" :formatter="Format" label="是否立即生效" width="120"></el-table-column>
        <el-table-column prop="verUpdateInterval" label="升级时间间隔" width="120"></el-table-column>
        <el-table-column prop="verUpdateDevNum" label="升级机器数量" width="120"></el-table-column>
        <el-table-column prop="zip" label="开始时间" width="180"></el-table-column> -->
        <el-table-column prop="createtime" :formatter="dtFormat" label="发布时间" min-width="120" align="left"></el-table-column>
        <el-table-column label="版本发布状态" min-width="80" align="left" :formatter="computedVersionstatus"></el-table-column>
        <el-table-column prop="remark" label="发布备注" min-width="220"></el-table-column>
        <el-table-column align="left" fixed="right" label="操作" width="120" prop="versionstatus">
          <template slot-scope="scope">
            <el-button
                  :disabled="scope.row.versionstatus==1?false:true"
                  @click="versionRetreatRow(scope.$index,scope.row)"
                  type="primary"
                  size="mini">
                  回退版本
                </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="text-align: right;margin-top:20px;" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage" background :page-sizes="[10, 20, 50,100]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="tableTotal">
      </el-pagination>
    </el-card>

    <keep-alive>
      <component :is='dialogList.versionRelease' :option='dialogOptions'></component>
    </keep-alive>

  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import toolBox from "@/utils/toolBox";
import versionRelease from "./dialog/versionRelease";
import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
import versionToDevQuery from "@/message/version/versionRelease/version-to-dev-query";
import retreatbyvs from '@/message/version/versionRetreat/retreatbyversioncode';
export default {
  data() {
    return {
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      verBaseInfo: [],
      formInline: {
        devNum: undefined,
        versionCode: ""
      },
      oldvcode: "",
      currentPage: 1,
      loading: false,
      dialogList: {
        versionRelease
      },
      dialogOptions: {
        versionReleaseIsShow: false
      },
      tableData: [],
      isEffectivetype: getGlobalParams.get("isEffectivetype")
    };
  },
  created() {
    this.initSpinnerList();
    this.queryInfoList();
  },
  computed:{
    versioncom(){
      console.log(scope.row)
    }
  },
  methods: {
    isDisabled(val){
      if(val === "1"){
        return false
      }
      if(val === "2"){
        return true
      }
    },
    computedVersionstatus(row, column){
      if(row.versionstatus === '1'){
        return "已发布"
      }
      if(row.versionstatus === '2'){
        return "已回退"
      }
      
    },
    versionRetreatRow(index,row) {
      this.$confirm('是否回退版本?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
          this.dialogOptions.currentRow=row;
          // console.log(this.dialogOptions.currentRow)
          this.retreatvs()
          this.$message({
            type: 'success',
            message: '回退成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消回退'
          });          
        });
    },
    retreatvs(){
      this.loading = true;
      let resBody = new retreatbyvs();
      resBody.data.versionCode = this.dialogOptions.currentRow.versionCode;
      resBody.data.branchNo = this.$store.getters.branchNo;
      resBody.data.ruleId = this.dialogOptions.currentRow.ruleid
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          // console.log(response);
          this.loading = false;
          this.$message({
          message: '版本回退成功',
          type: 'success'
          });
          this.queryInfoList();
          this.isShow = false;
        } else {
          this.loading = false;
          this.$message({
            message: response.SYS_HEAD.ReturnMessage,
            type: "error"
          });
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false;
        console.log("error", error);
      })
    },
    // 初始化版本基础信息下拉框
    initSpinnerList() {
      let resBody = new spinnerDataQuery();
      resBody.data.spinnerList = [{ spinnerName: "branchVerBaseInfo" }];
      request(resBody)
        .then(response => {
          this.verBaseInfo = response.RSP_BODY.verBaseInfoSpinner || [];
          // this.verBaseInfo.unshift({});
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    /**
     * 格式化数据
     */
    Format(row, column) {
      return this.isEffectivetype[row[column.property]];
    },
    dtFormat(row, column) {
      return toolBox.timestampToTime(row[column.property]);
    },

    /**
     * 点击分页调用查询方法
     */
    handleSizeChange(val) {
      this.queryInfoList();
    },
    handleCurrentChange(val) {
      this.queryInfoList();
    },

    /**
     * 查询发布信息方法
     */
    queryInfoList() {
      this.loading = true;
      this.tableData = [];
      let resBody = new versionToDevQuery();
      resBody.data.versionCode = this.formInline.versionCode;
      resBody.data.devNum = this.formInline.devNum;
      if (this.formInline.versionCode != this.oldvcode) {
        this.currentPage = 1;
        this.oldvcode = this.formInline.versionCode;
      }

      resBody.QueryRowNum = this.pageSize;
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          // console.log(response.RSP_BODY.verToDevInfoList)
          // console.log(response)
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableData = response.RSP_BODY.verToDevInfoList || [];
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
     * 清除表单方法
     */
    clearForm(item) {
      this.$refs[item].resetFields();
    },

    /**
     * 关闭版本发布窗口方法
     */
    dialogVersionRelease() {
      this.dialogOptions.versionReleaseIsShow = true;
    }
  }
};
</script>

<style scope>
  .inlineform input {
    min-width: 200px;
  }
</style>