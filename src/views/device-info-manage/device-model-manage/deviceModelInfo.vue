<template>
  <div class='dev-model-manage'  v-loading="loading"
          element-loading-text="加载中。。。">
    <el-card>
      <el-form ref='devModelMgrQueryForm' :model='devModelMgrQueryForm' size='mini' label-position="top">
        <el-row :gutter="10">
          <el-col  :lg="4" :md="6">
            <el-form-item label='型   号' class='typeInfo-el-form-item' prop='devModel'>
                    <el-input v-model='devModelMgrQueryForm.devModel' 
                      placeholder='请输入型号' ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col  :lg="4" :md="6">
            <el-form-item label='设备形式' class='typeInfo-el-form-item' prop='devForm'>
                    <el-cascader v-model='devModelMgrQueryForm.devForm'  :options="devForm"
                                 :props="{value:'devForm',label:'devFormName'}"
                placeholder="请选择设备形式"  filterable></el-cascader>
            </el-form-item>
          </el-col> -->
          <el-col :lg="4" :md="6">
            <el-form-item label='设备类型' class='typeInfo-el-form-item' prop='devType'>
              <el-select v-model="devModelMgrQueryForm.devType"  placeholder="请选择设备类型" >
                <el-option
                v-for="item in deviceTypeSpinner"
                :key="item.devTypeNum"
                :label="item.devType"
                :value="item.devTypeNum"
                :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="6">
            <el-form-item label='品    牌' class='typeInfo-el-form-item' prop='brandId'>
              <el-select v-model="devModelMgrQueryForm.brandId"  placeholder="请选择品牌" >
                <el-option
                v-for="item in devBrand"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
                :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3"  class="searchBtnMarginTop">
            <el-button type='primary' size='mini' icon='el-icon-search'
              :loading="loading" @click="modelQuery">查询</el-button>
          </el-col>
            <el-col :lg="2" :md="3"  class="searchBtnMarginTop">
              <el-button type='warning' size='mini' icon='el-icon-refresh'
                @click="clearForm('devModelMgrQueryForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px;" >
       <el-tabs type="border-card" style="min-height:564px;">
          <el-tab-pane label="柜式">
            <el-row>
              <el-col :lg="2" :md="3" >
                  <el-button type='primary' size='mini' icon='el-icon-plus' class='b-button' v-if="btnPermission('Button_DevModel_Add')"
                  @click='addModel("1")'>新增</el-button>
              </el-col>
                <el-col :lg="2" :md="3" >
                  <el-button type='primary' size='mini' icon='el-icon-edit' class='b-button' v-if="btnPermission('Button_DevModel_Edit')"
                  @click='dialogOptionsMod.isShow=true'  :disabled="!checkedUser">修改</el-button>
              </el-col>
                <el-col :lg="2" :md="3" >
                  <el-button type='danger' size='mini' icon='el-icon-delete' class='b-button'   :disabled="!isDisabledDel" v-if="btnPermission('Button_DevModel_Delete')"
                  @click='delModelClick'>删除</el-button>
              </el-col>
            </el-row>
              <keep-alive>
                <component :is='dialogList.listDevModel' :optionModel='dialogOptionsListGS' @rowDate="rowDate" @isEnabled="isEnabled"></component>
              </keep-alive>
            </el-tab-pane>
            <el-tab-pane label="PAD">
              <el-row>
                <el-col :lg="2" :md="3" >
                    <el-button type='primary' size='mini' icon='el-icon-plus' class='b-button' v-if="btnPermission('Button_DevModel_Add')"
                    @click='addModel("2")'>新增</el-button>
                </el-col>
                  <el-col :lg="2" :md="3" >
                    <el-button type='primary' size='mini' icon='el-icon-edit' class='b-button' v-if="btnPermission('Button_DevModel_Edit')"
                    @click='dialogOptionsMod.isShow=true'  :disabled="!checkedModPad">修改</el-button>
                </el-col>
                  <el-col :lg="2" :md="3" >
                    <el-button type='danger' size='mini' icon='el-icon-delete' class='b-button'   :disabled="!isDisabledDelPad" v-if="btnPermission('Button_DevModel_Delete')"
                    @click='delModelClick'>删除</el-button>
                </el-col>
              </el-row>
              <keep-alive>
                <component :is='dialogList.listDevModel' :optionModel='dialogOptionsListPad' @rowDate="rowDate" @isEnabled="isEnabledPad"></component>
              </keep-alive>
          </el-tab-pane>
      </el-tabs>
    </el-card>
    <keep-alive>
      <component :is='dialogList.createModel' :createModel='dialogOptionsCreate' @refreshTableModel="modelQuery"></component>
    </keep-alive>
      <keep-alive>
        <component :is='dialogList.modModel' :modModel='dialogOptionsMod'  @refreshTableModel="modelQuery"></component>
    </keep-alive>
  </div>
</template>

<script>
import createModel from "./dialog/createModel";
import modModel from "./dialog/modModel";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import devModelInfo from "@/message/deviceInfoManage/model/dev-model-query";
import devModelDel from "@/message/deviceInfoManage/model/model-del";
import listDevModel from "./dialog/listDevModel";
export default {
  data() {
    return {
      devModelId: "", //存放要删除的设备型号ID
      devForm: [],
      devModule: [],
      devBrand: [], //设备品牌
      pageSize: undefined,
      deviceFormEnum: {}, //设备形式初始化
      enumModule: {  //设备模块枚举值
        // 1: "发卡器",
        // 2: "读卡器",
        // 3: "指纹仪",
        // 4: "扫码器",
        // 5: "身份证阅读器",
        // 6: "存折阅读器"
      },
      devModelMgrQueryForm: {  //查询表单
        devModel: "",
        devForm: [],
        devType: "",
        brandId: ""
      },
      modelInfoList: [],  //存放表格所有数据
      deviceTypeSpinner: [],  //设备类型下拉框
      dialogList: { createModel, modModel, listDevModel },
      dialogOptionsCreate: { isShow: false, devForm: "" },
      dialogOptionsMod: { isShow: false, currentRow: [] },
      dialogOptionsListGS: { devModelList: [], enumModule: {} },
      dialogOptionsListPad: { devModelList: [], enumModule: {} },
      addBrand: {},
      loading: false,
      currentPage: 1,
      checkedUser: false, //柜式修改按钮是否可用
      isDisabledDel: false,//柜式删除按钮是否可用
      checkedModPad: false, //PAD修改按钮是否可用
      isDisabledDelPad: false//PAD删除按钮是否可用
    };
  },
  created() {
    this.deviceFormEnum = getGlobalParams.get("deviceForm"); //设备形式初始化
    let resBody = new devRunList();
    resBody.data.spinnerList = [
      { spinnerName: "devType" },
      // { spinnerName: "devForm" },
      { spinnerName: "devBrand" },
      { spinnerName: "devModule" }
    ];
    request(resBody)
      .then(response => {
        this.deviceTypeSpinner = response.RSP_BODY.deviceTypeSpinner;
        // this.devForm = response.RSP_BODY.devFormSpinner;
        this.devBrand = response.RSP_BODY.devBrandInfoSpinner || [];
        this.devModule = response.RSP_BODY.devModuleInfoSpinner || [];
        this.devBrand.unshift({});
        this.deviceTypeSpinner.unshift({});
        for (let i = 0; i < this.devModule.length; i++) {
          this.enumModule[this.devModule[i].devModuleNum] = this.devModule[
            i
          ].devModule;
        }
        this.dialogOptionsListGS.enumModule = this.enumModule;
        this.dialogOptionsListPad.enumModule = this.enumModule;
      })
      .catch(error => {
        console.error("查询错误", error);
      });
    // this.pageSize=getGlobalParams.get("PageSize");
    this.$nextTick(function() {
      this.modelQuery();
    });
  },
  methods: {
    addModel(val) {  //根据柜式和PAD打开相应的新增弹框
      this.dialogOptionsCreate.isShow = true;
      this.dialogOptionsCreate.devForm = val;
    },
    rowDate(val) { //表格当前选中行的数据
      this.dialogOptionsMod.currentRow = val[0];
      this.devModelId = "";
      val.forEach(element => {
        this.devModelId = this.devModelId + element.devModelId + ",";
      });
      this.devModelId = this.devModelId.slice(0, this.devModelId.length - 1);
    },
    isEnabled(checkedUser, isDisabledDel) {  //判断柜式的修改和删除按钮是否可用
      this.checkedUser = checkedUser;
      this.isDisabledDel = isDisabledDel;
    },
    isEnabledPad(checkedUser, isDisabledDel) { //判断PAD的修改和删除按钮是否可用
      this.checkedModPad = checkedUser;
      this.isDisabledDelPad = isDisabledDel;
    },
    //  handleCurrentChangeTable(val) {
    //   this.currentRow = val[0];
    //   if (val.length == 1) {
    //     this.checkedUser = true;
    //     this.isDisabledDel = true;
    //   } else if (val.length > 1) {
    //     this.checkedUser = false;
    //     this.isDisabledDel = true;
    //   } else {
    //     this.checkedUser = false;
    //     this.isDisabledDel = false;
    //   }
    // },
    sureDel() {  //删除设备型号
      this.loading = true;
      let resBody = new devModelDel();
      resBody.data.devModelId = this.devModelId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: "设备型号删除成功!"
            });
            this.modelQuery();
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
    delModelClick() {
      this.$confirm("此操作将永久删除该设备型号, 是否继续?", "提示", {
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
    // dataFormat(row, column) {
    //   //枚举设备形式
    //   return this.deviceFormEnum[row[column.property]];
    // },
    // moduleFormat(row, column, cellValue, index) {
    //   //格式化模块
    //   var date = row[column.property];
    //   if (date == undefined) {
    //     return "";
    //   }
    //   let value = cellValue.split("|");
    //   let module1 = "";
    //   for (let i = 0; i < value.length; i++) {
    //     module1 = module1 + this.enumModule[value[i]] + ",";
    //   }
    //   return module1.slice(0,module1.length-1);
    // },
    clearForm(item) { //清除查询表单数据
      this.$refs["" + item].resetFields();
    },
    handleCurrentChange(val) {  //返回当前选中的表格页
      this.currentPage = val;
    },
    modelQuery() {      //查询型号列表
      this.loading = true;
      this.modelInfoList = [];
      this.dialogOptionsListGS.devModelList = [];
      this.dialogOptionsListPad.devModelList = [];
      let resBody = new devModelInfo();
      resBody.data.devForm = this.devModelMgrQueryForm.devForm[0];
      resBody.data.devModel = this.devModelMgrQueryForm.devModel;
      resBody.data.brandId = this.devModelMgrQueryForm.brandId;
      resBody.data.devType = this.devModelMgrQueryForm.devType;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            if (response.RSP_BODY) {
              let modelList = response.RSP_BODY.devModelList;
              for (let i = 0; i < modelList.length; i++) { //格式化表格模块列数据
                let box = modelList[i].devBoxCount.split("|");
                let boxShort = modelList[i].devBoxId.split("|");
                for (let j = 0; j < box.length; j++) {
                  boxShort[j] == "1"
                    ? (modelList[i].cardBox = box[j])
                    : boxShort[j] == "2"
                      ? (modelList[i].moneyBox = box[j])
                      : (modelList[i].discard = box[j]);
                }
              }
              this.modelInfoList = modelList;
              this.modelInfoList.forEach(element => { //按设备形式分表格数据
                if (element.devForm == "1") {
                  this.dialogOptionsListGS.devModelList.push(element);
                } else if (element.devForm == "2") {
                  //if(element.devForm=="2")
                  this.dialogOptionsListPad.devModelList.push(element);
                }
              });
            } else {
              this.loading = false;
              this.$message({
                type: "warning",
                message: "没有满足条件得记录!"
              });
            }
          }
        })
        .catch(error => {
          this.loading = false;
          //   this.logger.log("fail", error);
        });
    },
  }
};
</script>


<style lang="scss" scoped>
.el-table__body-wrapper {
  overflow: hidden !important;
}
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}

.listEdit {
  text-align: right;
  & a {
    margin: 5px;
  }
}
.demo-table-expand .el-form-item {
  margin-bottom: 5px;
}
.editClass {
  input.el-input__inner {
    border: none;
    background: rgba(0, 0, 0, 0) !important;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
