<template>
  <div class='dev-model-manage' v-loading="loading"
    element-loading-text="加载中。。。">
    <el-tabs type="border-card"  style="min-height:564px;">
      <el-tab-pane label="柜式">
        <el-row>
          <el-col :lg="2" :md="3">
            <el-button type='primary' size='mini' icon='el-icon-plus' 
             v-if="btnPermission('Button_DevProgram_Add')"
             @click='cProcedureAdd("1")'>新增</el-button>
          </el-col>
            <el-col :lg="2" :md="3">
            <el-button type='primary' size='mini' icon='el-icon-edit'  :disabled="!checkedUser"
              v-if="btnPermission('Button_DevProgram_Edit')"
              @click='cProcedureMod'>修改</el-button>
          </el-col>
          <el-col :lg="2" :md="3">
            <el-button type='danger' size='mini' icon='el-icon-delete'  :disabled="!isDisabledDel"
              v-if="btnPermission('Button_DevProgram_Delete')"
              @click='cProcedureDel'>删除</el-button>
          </el-col>
        </el-row>
        <keep-alive>
          <component :is='dialogList.listCProcedure' :optons='dialogOptionsList' @rowDate="rowDate" @isEnabled="isEnabledBtn"></component>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="PAD">
        <el-row>
          <el-col :lg="2" :md="3">
            <el-button type='primary' size='mini' icon='el-icon-plus'  v-if="btnPermission('Button_DevProgram_Add')"
            @click='cProcedureAdd("2")'>新增</el-button>
          </el-col>
          <el-col :lg="2" :md="3">
            <el-button type='primary' size='mini' icon='el-icon-edit' :disabled="!checkedUsePad" v-if="btnPermission('Button_DevProgram_Edit')"
            @click='cProcedureMod'>修改</el-button>
          </el-col>
          <el-col :lg="2" :md="3">
            <el-button type='danger' size='mini' icon='el-icon-delete'  :disabled="!isDisabledDelPad" v-if="btnPermission('Button_DevProgram_Delete')"
            @click='cProcedureDel'>删除</el-button>
          </el-col>
        </el-row>
        <keep-alive>
          <component :is='dialogList.listCProcedure' :optons='dialogOptionsListPad'  @rowDate="rowDate"  @isEnabled="isEnabledBtnPad"></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is='dialogList.createCInfo' :createCProcedure='dialogOptions' @refreshTableC="queryCProg"></component>
    </keep-alive>
    <keep-alive>
      <component :is='dialogList.modCInfo' :modCProcedure='modDialogOptions' @refreshTableC="queryCProg"></component>
    </keep-alive>   
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import listCProcedure from "./dialog/listCProcedure";
import cProcedureInfo from "@/message/deviceInfoManage/cProgram/c-procedure-query";
import sureDelC from "@/message/deviceInfoManage/cProgram/c-procedure-del";

import createCInfo from "./dialog/createCProcedure";
import modCInfo from "./dialog/updateCProcedure";
export default {
  data() {
    return {
      guiList: [],  //柜式数据
      padList: [],  //PAD数据
      currentRow: "",
      devForm: [],
      loading: false,
      currentPage: 1,
      dialogList: { createCInfo, modCInfo, listCProcedure },
      dialogOptions: { isShow: false, devForm: "" },
      dialogOptionsList: { isShow: true, CProcedureInfoList: [] },
      dialogOptionsListPad: { isShow: true, CProcedureInfoList: [] },
      modDialogOptions: { isShow: false, currentRow: "" },
      checkedUser: false,  //柜式修改是否可用
      isDisabledDel: false, //柜式删除是否可用
      checkedUsePad: false, //PAD修改是否可用
      isDisabledDelPad: false //PAD删除是否可用
    };
  },
  created() {
    //查询
    this.queryCProg();
  },
  methods: {
    rowDate(val) {
      //表格当前选中行的数据
      this.modDialogOptions.currentRow = val[0];
      // console.log(Val)
    },
    queryCProg() {  //查询C端程序
      this.loading = true;
      this.dialogOptionsList.CProcedureInfoList = [];  //清除查询列表的数据，不然会导致删除数据有问题
      this.dialogOptionsListPad.CProcedureInfoList = []; //清除查询列表的数据，不然会导致删除数据有问题
      this.CProcedureInfoList = []; //所有数据
      this.guiList = [];
      this.padList = [];
      let resBody1 = new cProcedureInfo();
      resBody1.QueryPageNo = this.currentPage;
      resBody1.QueryRowNum = getGlobalParams.get("PageSize");
      request(resBody1)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            if (response.RSP_BODY) {
              this.CProcedureInfoList = response.RSP_BODY.cProgramList;
              this.CProcedureInfoList.forEach(element => {
                if (element.devForm === "1") {
                  this.guiList.push(element);
                } else if (element.devForm === "2") {
                  this.padList.push(element);
                }
              }); 
              for (let i = 0; i < this.guiList.length; i++) { //将数据根据设备形式分类放入柜式
                this.$set(
                  this.dialogOptionsList.CProcedureInfoList,
                  i,
                  this.guiList[i]
                );
              }
              for (let i = 0; i < this.padList.length; i++) { //将数据根据设备形式分类放入PAD
                this.$set(
                  this.dialogOptionsListPad.CProcedureInfoList,
                  i,
                  this.padList[i]
                );
              }
              this.dialogOptionsList.isShow = false;
              this.dialogOptionsListPad.isShow = false;
              setTimeout(() => {
                this.dialogOptionsList.isShow = true;
                this.dialogOptionsListPad.isShow = true;
              }, 0);
            }
          } else {
            this.loading = false;
            this.$message({
              type: "warning",
              message: "没有满足条件得记录!"
            });
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    isEnabledBtn(checkedUser, isDisabledDel) {  //判断柜式的修改和删除按钮是否可用
      this.isDisabledDel = isDisabledDel;
      this.checkedUser = checkedUser;
    },
    isEnabledBtnPad(checkedUser, isDisabledDel) {  //判断PAD的修改和删除按钮是否可用
      this.isDisabledDelPad = isDisabledDel;
      this.checkedUsePad = checkedUser;
    },
    cProcedureAdd(item) {  //打开添加弹窗，item根据设备形式打开相应的弹窗
      this.dialogOptions.isShow = true;
      this.dialogOptions.devForm = item;
    },
    cProcedureMod() {  //修改弹窗
      this.modDialogOptions.isShow = true;
    },
    sureDel() {  //删除
      this.loading = true;
      let resBody = new sureDelC();
      resBody.data.cProgramID = this.modDialogOptions.currentRow.cProgramID;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: "C端程序删除成功!"
            });
            this.queryCProg();
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
    cProcedureDel() {
      this.$confirm("此操作将永久删除该C端程序, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.sureDel();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  }
};
</script>
<style lang="scss"  scoped>
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
.cardStyle {
  margin: 5px 0;
}
.demo-table-expand .el-form-item {
  margin-bottom: 5px;
}
.headerClass {
  background: #f7f7f7 !important;
}
</style>
