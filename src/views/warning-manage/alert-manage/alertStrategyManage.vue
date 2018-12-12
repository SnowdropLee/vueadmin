<!--alertStrategyManage差接口联调-->
<template>
  <div class="alert-strategy-manage" v-loading="loading"
             element-loading-text="加载中。。。">
    <div>
      <el-card class='type-info-box-card'>
        <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top'>
            <el-row  :gutter="10">
                <el-col :md="6" :lg="4">
                      <el-form-item label='策略编号' class='typeInfo-el-form-item' prop='strategyId'>
                                <el-input v-model='queryForm.strategyId'
                          placeholder="请输入策略编号"  ></el-input>
                      </el-form-item>
                </el-col>

                <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                      <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                </el-col>
                <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                      <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                </el-col>
            </el-row>
            
        </el-form>
      </el-card>
      <el-card class='type-info-bottom' style="min-height:500px;">
        <el-row >
          <el-col :md="3" :lg="2">
            <el-button type='primary' size='mini' icon='el-icon-plus'  @click="toggleAddPop" v-if="btnPermission('Button_Warning_Add')">添加</el-button>
          </el-col>
          <el-col :md="3" :lg="2">
            <el-button type='primary' size='mini' icon='el-icon-edit'   @click="toggleEditPop" :disabled="selection.length!=1" v-if="btnPermission('Button_Warning_Edit')">修改</el-button>
          </el-col>
          <el-col :md="3" :lg="2">
            <el-button type='danger' size='mini' icon='el-icon-delete'   @click="deleteConfirm" :disabled="selection.length!=1" v-if="btnPermission('Button_Warning_Delete')">删除</el-button>
          </el-col>
          <el-col :md="3" :lg="2" style="margin-right:10px">
            <el-button type='primary' size='mini'  @click="toggleBindPop"  :disabled="selection.length!=1" v-if="btnPermission('Button_Warning_Bind')">设备绑定</el-button>
          </el-col>
          <el-col :md="3" :lg="2">
            <el-button type='primary' size='mini'  @click="toggleUnbindPop"  :disabled="isEnabled || selection.length!=1" v-if="btnPermission('Button_Warning_Unbind')">解除绑定</el-button>
          </el-col>
        </el-row>
        <el-table ref="tableData" style="margin-top:20px;"
          :data='tableData' @selection-change="tableSelect" 
          header-row-class-name="tableHeaderClass"
          border
          >
          <el-table-column type='selection' width="40px"></el-table-column>
          <!-- 这里的prop按照返回的字段去更新 -->
          <el-table-column prop='policyId' label='预警策略' min-width="94px" fixed></el-table-column>
          <el-table-column prop='type' label='策略类型' min-width="100px"></el-table-column>
          <!-- <el-table-column prop='policyFunction' label='策略表达式' min-width="100px"></el-table-column>
          <el-table-column prop='policyValue' label='策略值' min-width="100px"></el-table-column> -->
          <el-table-column prop='notifyMethod' label='通知方式' :formatter="notifyMethodFormat" min-width="94px"></el-table-column>
          <!-- <el-table-column prop='collectSTime' label='数据收集开始时间' width="160px" ></el-table-column>
          <el-table-column prop='collectETime' label='数据收集结束时间' width="160px"></el-table-column> -->
          <el-table-column prop='count_StartTime' label='统计开始时间'  :formatter="dataFormatTime" min-width="144px"></el-table-column>               
          <el-table-column prop='count_EndTime' label='统计结束时间'  :formatter="dataFormatTime" min-width="144px"></el-table-column>
          <el-table-column prop='execute_StartTime' label='异常排查开始时间'  :formatter="dataFormatTime" min-width="144px"></el-table-column>
          <el-table-column prop='execute_EndTime' label='异常排查结束时间'  :formatter="dataFormatTime" min-width="144px"></el-table-column>               
          <el-table-column prop='working_Interval' label='时间间隔(ms)' min-width="110px"></el-table-column>
          <el-table-column prop='create_User' label='创建人' min-width="100px"></el-table-column>
          <el-table-column prop='create_Time' label='创建时间' min-width="160px"></el-table-column>
          <el-table-column prop='update_User' label='更新人' min-width="100px"></el-table-column>
          <el-table-column prop='update_Time' label='更新时间' min-width="160px" ></el-table-column>
          <el-table-column prop='policyProperty' label='策略属性' fixed="right"  :formatter="dataFormatProperty" min-width="200px">
          
          </el-table-column>
          <!-- 暂时取消查看详情！！！！！！！！！！！！！！！！！！！！！！！！！！！ -->
          <!-- <el-table-column prop='' label='操作' align="center" fixed="right" width="80">
              <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="detailInfo">查看详情</el-button>
              </template>
          </el-table-column> -->
          <!-- <template slot-scope="scope">
                  {{scope.row.policyProperty}} 
                <span v-for="item in scope.row.policyProperty" :key="item.policyPropertyId">{{item.policyPropertyValue+","}}</span>
              </template> -->
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
      <keep-alive>
         <component :is='dialogList.addPopPage' :option='addDialogOptions' @refreshTable="queryModel"></component>
      </keep-alive>
      <keep-alive>
         <component :is='dialogList.editPopPage' :option='editDialogOptions'  @refreshTable="queryModel" :current-select='selection'></component>
      </keep-alive>
       <keep-alive>
         <component :is='dialogList.unbindPopPage' :option='unbindDialogOptions'  @refreshTable="queryModel" :current-select='selection'></component>
      </keep-alive>
      <keep-alive>
         <component :is='dialogList.bindPopPage' :option='bindDialogOptions'  @refreshTable="queryModel" :current-select='selection'></component>
      </keep-alive>
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import addPopPage from "./dialog/addPopPage";
import editPopPage from "./dialog/editPopPage";
import bindPopPage from "./dialog/bindPopPage";
import unbindPopPage from "./dialog/unbindPopPage";

//通讯相关
import request from "@/utils/request";
import alertQueryList from "@/message/alertManage/warning/alert-query";
import strategyDel from "@/message/alertManage/warning/alert-del";
// import InquireModel from "@/message/dev-run-info-query";
import toolBox from "@/utils/toolBox";
// import placeholderIe from '@/utils/ie9'//兼容ie9 plaehold

export default {
  name: "alert-strategy-manage",
  data() {
    return {
      isEnabled: true,
      loading: false,
      policyId: "",
      total: 0,
      tableData: [],
      tableTotal: 0,
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      selection: [],
      oldstrId: "",
      queryForm: {
        strategyId: ""
      },
      notifyMethod: getGlobalParams.get("notifyMethod"), //通知方式
      // deviceTypeSpinner: [],
      // defaultProps: {
      //   value: "devTypeNum",
      //   label: "devType"
      // },
      dialogList: { addPopPage, editPopPage, bindPopPage, unbindPopPage },
      addDialogOptions: { isShow: false },
      editDialogOptions: { isShow: false },
      bindDialogOptions: { isShow: false },
      unbindDialogOptions: { isShow: false }
    };
  },
  methods: {
    delStrategy() {
      this.loading = true;
      let resBody = new strategyDel();
      resBody.data.policyId = this.policyId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            if (response.RSP_BODY.resultSet.resultFlag) {
              this.$message({
                type: "success",
                message: "该预警策略删除成功!"
              });
              this.queryModel();
            } else {
              this.$message({
                type: "warning",
                message: response.RSP_BODY.resultSet.alertMsg
              });
            }
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message({
            type: "info",
            message: error
          });
        });
    },
    dataFormatTime(row, column) {
      return toolBox.timeFormat2Time(row[column.property]);
    },
    dataFormatProperty(row, column) {
      let arr = [];
      row[column.property].forEach(element => {
        arr.push(element.policyPropertyValue);
      });
      return arr.join(" , ");
    },
    //添加通知方式格式转化表单
    notifyMethodFormat(row, column) {
      return this.notifyMethod[row[column.property]];
    },
    toggleAddPop() {
      this.addDialogOptions.isShow = !this.addDialogOptions.isShow;
    },
    toggleEditPop() {
      this.editDialogOptions.isShow = !this.editDialogOptions.isShow;
    },
    deleteConfirm() {
      this.$confirm("此操作将永久删除该预警策略, 是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delStrategy();
          // this.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toggleUnbindPop() {
      this.unbindDialogOptions.isShow = !this.unbindDialogOptions.isShow;
    },
    toggleBindPop() {
      //应该是用传入的选中信息查表并且做绑定
      this.bindDialogOptions.isShow = !this.bindDialogOptions.isShow;
    },
    tableSelect(selection) {
      if (selection.length == 1) {  //控制解除绑定按钮得使用
        selection[0].isEnable == "0"
          ? (this.isEnabled = true)
          : (this.isEnabled = false);
      }
      this.selection = selection; //控制按钮的使用
      this.policyId = "";  //多选删除 ID列表
      selection.forEach(element => {
        this.policyId = this.policyId + element.policyId + ",";
      });

      this.policyId = this.policyId.slice(0, this.policyId.length - 1);
    },
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    detailInfo() {
      //  this.dialogOptions.isShow=true
    },
    async queryModel() {  //查询
      this.loading = true;
      let resBody = new alertQueryList(); //这里需要改
      resBody.data.policyId = this.queryForm.strategyId;
      if (this.queryForm.strategyId != this.oldstrId) {
        this.currentPage = 1;
        this.oldstrId = this.queryForm.strategyId;
      }
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.resultSet || [];
        this.tableTotal = Number(
          response.RSP_BODY.resultSet.total ||
            response.QUERY_INFO_HEAD.QueryAllDataCount ||
            this.tableData.length
        );
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
    },
    handleSizeChange() {
      this.queryModel();
    },
    handleCurrentChange() {
      this.queryModel();
    }
  },
  created() {
    this.queryModel();
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
</style>
