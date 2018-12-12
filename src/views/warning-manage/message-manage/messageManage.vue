<!--alertStrategyManage差接口联调-->
<template>
  <div v-loading="loading" element-loading-text="加载中。。。">
    <el-card>
      <el-row >
          <el-col :md="3" :lg="2">
              <el-button type='primary' size='mini' icon='el-icon-plus' class='b-button' @click="toggleAddPop" v-if="btnPermission('Button_ShotMessage_Add')">添加</el-button>
          </el-col>
          <el-col :md="3" :lg="2">
              <el-button type='primary' size='mini' icon='el-icon-edit'  class='b-button' @click="toggleEditPop" :disabled="selection.length!=1" v-if="btnPermission('Button_ShotMessage_Edit')">修改</el-button>
          </el-col>
          <el-col :md="3" :lg="2">
              <el-button type='danger' size='mini' icon='el-icon-delete'  class='b-button' @click="deleteConfirm" :disabled="selection.length!=1" v-if="btnPermission('Button_ShotMessage_Delete')">删除</el-button>
          </el-col>
      </el-row>
      <el-table ref="tableData" style="margin-top:20px" height="400"
        :data='tableData' @selection-change="tableSelect" 
        header-row-class-name="tableHeaderClass"
        border
        >
            <el-table-column type='selection' width="40px"></el-table-column>
            <!-- 这里的prop按照返回的字段去更新 -->
            <el-table-column prop='umId' label='短信联系人工号' min-width="110px" fixed></el-table-column>
            <el-table-column prop='uName' label='短信联系人姓名' min-width="110px"></el-table-column>
            <el-table-column prop='phoneNumber' label='短信联系人电话' min-width="110px"></el-table-column>
            <el-table-column prop='emails' label='邮箱地址' min-width="110px"></el-table-column>
            <el-table-column prop='isSend' label='是否发送' min-width="94px" :formatter="dataFormatSend"></el-table-column>
            <el-table-column prop='startTime' label='发送开始时间'  :formatter="dataFormatTime" min-width="144px"></el-table-column>               
            <el-table-column prop='endTime' label='发送结束时间'  :formatter="dataFormatTime" min-width="144px"></el-table-column>
            <el-table-column prop='brno' label='机构号'  min-width="144px"></el-table-column>
            <el-table-column prop='role' label='人员技能' :formatter="roleFormat"  min-width="144px"></el-table-column>               
      </el-table>
      <div class="box">
        <el-pagination background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50,100]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tableData.length"> 
        </el-pagination>
      </div>
    </el-card> 
    <!-- 弹窗 -->
    <keep-alive>
      <component :is='dialogList.addMessage' :option='addDialogOptions' @refreshTable="queryMessage"></component>
    </keep-alive>
    <keep-alive>
      <component :is='dialogList.editMessage' :option='editDialogOptions'  @refreshTable="queryMessage" :current-select='selection'></component>
    </keep-alive>
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import addMessage from "./dialog/addMessage";
import editMessage from "./dialog/editMessage";
//通讯相关
import request from "@/utils/request";
import messageQueryList from "@/message/alertManage/message/message-query";
import messageDel from "@/message/alertManage/message/message-del";
// import InquireModel from "@/message/dev-run-info-query";
import toolBox from "@/utils/toolBox";

export default {
  name: "alert-strategy-manage",
  data() {
    return {
      loading: false,
      umId: "",
      total: 0,
      tableData: [],
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      selection: [],
      dialogList: { addMessage, editMessage },
      addDialogOptions: { isShow: false },
      editDialogOptions: { isShow: false },
      bindDialogOptions: { isShow: false },
      role: getGlobalParams.get("role"), //引入全局变量枚举
      isSend: {
        "0": "否",
        "1": "是"
      }
    };
  },
  created() {
    this.queryMessage();
  },
  methods: {
    delStrategy() {
      //删除短信联系人
      let resBody = new messageDel();
      resBody.data.umID = this.umId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.$message({
              type: "success",
              message: "短信参数删除成功!"
            });
            this.queryMessage();
          }
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: error
          });
        });
    },
    dataFormatSend(row, column) {
      //格式化表格
      return this.isSend[row[column.property]];
    },
    dataFormatTime(row, column) {
      //格式化表格
      return toolBox.timeFormat2Time(row[column.property]);
    },
    toggleAddPop() {
      this.addDialogOptions.isShow = !this.addDialogOptions.isShow;
    },
    toggleEditPop() {
      this.editDialogOptions.isShow = !this.editDialogOptions.isShow;
    },
    deleteConfirm() {
      this.$confirm("此操作将永久删除该联系人, 是否继续？", "提示", {
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
    toggleBindPop() {
      //应该是用传入的选中信息查表并且做绑定
      this.bindDialogOptions.isShow = !this.bindDialogOptions.isShow;
    },
    tableSelect(selection, val) {
      this.selection = selection; //控制按钮的使用
      this.umId = "";
      selection.forEach(element => {
        this.umId = this.umId + element.umId + ",";
      });
      this.umId = this.umId.slice(0, this.umId.length - 1);
    },
    clearForm(item) {
      //清除表单数据
      this.$refs["" + item].resetFields();
    },
    roleFormat(row, column) {
      return this.role[row[column.property]];
    },
    detailInfo() {
      //  this.dialogOptions.isShow=true
    },
    async queryMessage() {  //查询
      this.loading = true;
      let resBody = new messageQueryList(); //这里需要改
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.resultSet;
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
      // this.queryModel();
    },
    handleCurrentChange() {
      // this.queryModel();
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
</style>
