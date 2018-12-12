<template>
  <div class="type-info-manage" v-loading="loading"
    element-loading-text="加载中。。。">
      <el-card  style="overflow:visible">
        <el-form ref='devInfoMgrQueryForm' :model='devInfoMgrQueryForm'  size='mini' label-position="top">
          <el-row :gutter="10">
            <el-col  :lg="4" :md="6">
              <el-form-item label='设备分类'  prop='devAssortmentId'>
                <el-select v-model="devInfoMgrQueryForm.devAssortmentId"  placeholder="请选择设备分类" >
                  <el-option
                  v-for="item in devSort"
                  :key="item.value"
                  :label="item.devAssortmentName"
                  :value="item.devAssortmentId"
                  :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col  :lg="4" :md="6">
              <el-form-item label='设备使用状态'  prop='deviceRunState'>
                <el-select v-model="devInfoMgrQueryForm.deviceRunState"  placeholder="请选择设备运行状态" >
                  <el-option
                  v-for="item in deviceRunState"
                  :key="item.devState"
                  :label="item.devStateName"
                  :value="item.devState"
                  :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col  :lg="4" :md="6">
              <el-form-item label='设备编号'  prop='devNum'>
                <el-input v-model='devInfoMgrQueryForm.devNum'  
                placeholder="请输入设备编号"  ></el-input>
              </el-form-item>
            </el-col>  
            <el-col  :lg="4" :md="6">
              <el-form-item label='机构号'>
                <select-tree :tree-data="brnoList"  v-model="selBrno" :node-key="'branchId'" 
                        :props="{id:'branchId',label:'branchName',children:'childBranch'}"
                ></select-tree>
              </el-form-item>
            </el-col>
            <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
              <el-button type='primary' size='mini' icon='el-icon-search' @click="devQuery">查询</el-button>
            </el-col>
            <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
              <el-button type='warning' size='mini' icon='el-icon-refresh'
              @click="resetForm('devInfoMgrQueryForm')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card class='type-info-bottom'>
        <el-tabs type="border-card" style="min-height:564px;">
          <el-tab-pane label="柜式">
            <el-row >
              <el-col :lg='2' :md='3'  v-if="btnPermission('Button_DevInfo_Add')">
                  <el-button type='primary' size='mini' icon='el-icon-plus' class='b-button' 
                  @click='dialogShow("1")'>添加</el-button>
              </el-col>
              <el-col :lg='2' :md='3' v-if="btnPermission('Button_DevInfo_Edit')">
                  <el-button type='primary' size='mini' icon='el-icon-edit' class='b-button' :disabled="isUse"
                  @click='modDialogShow("1")'>修改</el-button>
              </el-col>
              <el-col :lg='2' :md='3' v-if="btnPermission('Button_DevInfo_Delete')">
                  <el-button type='danger' size='mini' icon='el-icon-delete' class='b-button' :disabled="isUse"
                  @click='delDialogShow'>删除</el-button>
              </el-col>
              <!-- <el-col :lg='2' :md='3'>
                  <el-button type='primary' size='mini' icon='el-icon-import' class='b-button' 
                  @click='this.uploadDialogVisible=true'>导入</el-button>
              </el-col> -->
              <el-col :lg="2" :md='3'>
                <el-dropdown trigger="click"  @command="handleCommand">
                  <el-button type="primary" size="mini" :disabled="isUse">
                    更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="scrapDialogVisible" v-if="btnPermission('Button_DevInfo_Scrap')">报废</el-dropdown-item>
                    <el-dropdown-item command="stopDialogVisible" v-if="btnPermission('Button_DevInfo_Disable')">暂停</el-dropdown-item>
                    <el-dropdown-item command="startDialogVisible" v-if="btnPermission('Button_DevInfo_Enable')">启用</el-dropdown-item>
                    <el-dropdown-item command="detailDev" v-if="btnPermission('Button_DevInfo_Detail')">详细信息</el-dropdown-item>
                    <!-- 暂时注释掉没有后台服务的按钮 <el-dropdown-item command="devRemove" v-if="btnPermission('Button_DevInfo_DevTransfer')">设备迁移</el-dropdown-item>                     -->
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
            <keep-alive>
              <component :is='dialogList.listDevInfo' :optons='dialogOptionsListGS' @isEnabled="isEnabled" @rowDate="rowDate"></component>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="PAD">
            <el-row >
              <el-col :lg='2' :md='3' v-if="btnPermission('Button_DevInfo_Add')">
                  <el-button type='primary' size='mini' icon='el-icon-plus' class='b-button' 
                  @click='dialogShow("2")'>添加</el-button>
              </el-col>
              <el-col :lg='2' :md='3' v-if="btnPermission('Button_DevInfo_Edit')">
                  <el-button type='primary' size='mini' icon='el-icon-edit' class='b-button' :disabled="isUsePad"
                  @click='modDialogShow("2")'>修改</el-button>
              </el-col>
                <el-col :lg='2' :md='3' v-if="btnPermission('Button_DevInfo_Delete')">
                  <el-button type='danger' size='mini' icon='el-icon-delete' class='b-button' :disabled="isUsePad"
                  @click='delDialogShow'>删除</el-button>
              </el-col>
                <!-- <el-col :lg='2' :md='3'>
                  <el-button type='primary' size='mini' icon='el-icon-delete' class='b-button' 
                  @click='this.uploadDialogVisible=true'>导入</el-button>
              </el-col> -->
              <el-col :lg="2" :md='3'>
                <el-dropdown trigger="click"  @command="handleCommand">
                  <el-button type="primary" size="mini" :disabled="isUsePad">
                    更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="scrapDialogVisible" v-if="btnPermission('Button_DevInfo_Scrap')">报废</el-dropdown-item>
                    <el-dropdown-item command="stopDialogVisible" v-if="btnPermission('Button_DevInfo_Disable')">暂停</el-dropdown-item>
                    <el-dropdown-item command="startDialogVisible" v-if="btnPermission('Button_DevInfo_Enable')">启用</el-dropdown-item>
                    <el-dropdown-item command="detailDev" v-if="btnPermission('Button_DevInfo_Detail')">详细信息</el-dropdown-item>
                    <el-dropdown-item command="devRemove" v-if="btnPermission('Button_DevInfo_DevTransfer')">设备迁移</el-dropdown-item>                    
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
            <keep-alive>
              <component :is='dialogList.listDevInfo' :optons='dialogOptionsListPad' @isEnabled="isEnabledPad" @rowDate="rowDate"></component>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹窗 -->
    <keep-alive>
        <component :is='dialogList.createTypeInfo' :option='dialogOptions' @refreshTable="devQuery"></component>
    </keep-alive>
    <keep-alive>
        <component :is='dialogList.updateTypeInfo' :option='UpdateDialogOptions'  @refreshTable="devQuery"></component>
    </keep-alive>
    <keep-alive>
        <component :is='dialogList.detailTypeInfo' :optionDetail='detailDialogOptions'></component>
    </keep-alive>
    <el-dialog 
        title="报废"
        :visible.sync="scrapDialogVisible"
        width="30%">
        <span class="dialog-text">请问确定要报废该设备吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="scrapDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="scrapDev" size="mini">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog 
        title="暂停"
        :visible.sync="stopDialogVisible"
        width="460px">
          <span class="dialog-text">请问确定要暂停该设备吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="stopDialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="stopDevInfo" size="mini">确 定</el-button>
          </span>
        
    </el-dialog>
    <el-dialog 
        title="启用"
        :visible.sync="startDialogVisible"
        width="30%">
        <span class="dialog-text">请问确定要启用该设备吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="startDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="startDev" size="mini">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog 
        title="导入"
        :visible.sync="uploadDialogVisible"
        width="40%">
        <el-upload
          class="upload-demo"
          action="http://localhost:9528"
          :on-success="onSucess"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList">
          <el-button size="mini" type="primary" >点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls、xlsx、doc、docx文件，且不超过10MB</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="uploadDialogVisible = false" size="mini">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import createTypeInfo from "./dialog/createDeviceInfo";
import detailTypeInfo from "./dialog/detailInfo";
import updateTypeInfo from "./dialog/updateDevInfo";
import listDevInfo from "./dialog/listDevInfo";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import devInfo from "@/message/deviceInfoManage/devInfo/dev-info-query";
import detailInfo from "@/message/deviceInfoManage/devInfo/dev-info-detail";
import devInfoDel from "@/message/deviceInfoManage/devInfo/dev-info-del";
import toolBox from "@/utils/toolBox";
import devUpdate from "@/message/deviceInfoManage/devInfo/dev-info-update";

export default {
  name: "type-info-manage",
  components: { selectTree },
  data() {
    return {
      loading: false,
      brnoList: [], //机构下拉列表
      selBrno: [], //机构选中项
      deviceRunState: [], //设备使用状态
      devInfoMgrQueryForm: {
        //表单数据
        branchIdList: [],
        devAssortmentId: "",
        deviceRunState: "",
        devNum: ""
      },
      devSort: [], //设备分类
      dialogList: {
        createTypeInfo,
        detailTypeInfo,
        updateTypeInfo,
        listDevInfo
      },
      dialogOptions: { isShow: false, active: 0, devForm: "" },
      dialogOptionsListGS: {
        //柜式页签数据
        isShow: true,
        devInfoList: [],
        comDeviceStatuSpinner: []
      },
      dialogOptionsListPad: { isShow: true, devInfoList: [] }, //PAD页签数据
      detailDialogOptions: { isShow: false, devId: "", dataTypeInfo: [] },
      UpdateDialogOptions: {
        isShow: false,
        devId: "",
        active: 0,
        dataTypeInfo: [],
        devForm: ""
      },
      dataTypeInfo: [],
      scrapDialogVisible: false, //控制弹窗的显示隐藏
      stopDialogVisible: false,
      startDialogVisible: false,
      uploadDialogVisible: false,
      fileList: [], //导入
      isUse: true, //控制按钮是否可用（柜式）
      isUsePad: true, //控制按钮是否可用（Pad）
      devId: "", //设备ID
      currentRow: [], //当前行数据
      comDeviceStatuSpinner: undefined //设备枚举值
    };
  },
  created() {
    this.initList();
  },
  mounted() {
    this.devQuery();
  },
  methods: {
    scrapDev() {
      this.scrapDialogVisible = false;
      this.devManage(3, "报废");
    },
    startDev() {
      this.startDialogVisible = false;
      this.devManage(1, "启用");
    },
    stopDevInfo() {
      //暂停设备
      this.stopDialogVisible = false;
      this.devManage(2, "暂停");
    },
    devManage(devState, msg) {
      //修改设备使用状态。devState---设备状态，msg---提示信息
      let resBody = new devUpdate();
      resBody.data.devState = devState;
      resBody.data.devId = this.currentRow[0].devId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.$message({
              type: "success",
              message: `设备${msg}成功`
            });
            this.devQuery();
          } else {
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    initList() {
      let resBody = new devRunList();
      resBody.data.spinnerList = [
        { spinnerName: "branch" },
        { spinnerName: "devStatus" },
        { spinnerName: "devAssortment" }
      ];
      request(resBody)
        .then(response => {
          this.brnoList = response.RSP_BODY.branchSpinner;
          this.devSort = response.RSP_BODY.deviceAssortmentSpinner || [];
          this.devSort.unshift({});
          this.deviceRunState =
            response.RSP_BODY.devRunningStatusSpinner.devStateList || [];
          //设备状态枚举值
          this.deviceRunState.unshift({});
          this.comDeviceStatuSpinner = toolBox.objArray2Hash(
            response.RSP_BODY.devRunningStatusSpinner.devStateList,
            "devState"
          );
          // this.dialogOptionsListPad.comDeviceStatuSpinner=this.comDeviceStatuSpinner
          // this.dialogOptionsListGS.comDeviceStatuSpinner=this.comDeviceStatuSpinner
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },
    rowDate(val) {
      //表格选中行数据
      this.currentRow = val; //设置表格选中行
      this.devId = ""; //选中行的设备ID，为了做多选删除
      val.forEach(element => {
        this.devId = this.devId + element.devId + ",";
      });
      this.devId = this.devId.slice(0, this.devId.length - 1);
    },
    devInfoDel() {
      //删除设备信息
      this.loading = true;
      let resBody = new devInfoDel();
      resBody.data.devId = this.devId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: "设备信息删除成功!"
            });
            this.devQuery();
          } else {
            this.loading = false;
            this.$message({
              type: "info",
              message: response.SYS_HEAD.ReturnMessage
            });
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
    delDialogShow() {
      //删除弹窗
      this.$confirm("此操作将永久删除该设备信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.devInfoDel();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    isEnabled(val) {
      //控制按钮是否可用，子组件传递回的值（柜式）
      this.isUse = !val;
    },
    isEnabledPad(val) {
      //控制按钮是否可用，子组件传递回的值（PAD）
      this.isUsePad = !val;
    },
    handleCommand(command) {
      //更多操作按钮下的弹窗显示
      if (command == "uploadDialogVisible") {
        this.uploadDialogVisible = true;
      }
      if (command == "scrapDialogVisible") {
        this.scrapDialogVisible = true;
      }
      if (command == "stopDialogVisible") {
        this.stopDialogVisible = true;
      }
      if (command == "startDialogVisible") {
        this.startDialogVisible = true;
      }
      if (command == "detailDev") {
        this.detailDev();
      }
      if (command == "devRemove") {
      }
    },
    detailDev() {
      //设备详情
      this.detailDialogOptions.devId = this.devId; //给子组件传入当前选定的devId准备后续参数请求操作
      this.detailDialogOptions.isShow = true;
    },
    devQuery() {
      //查询设备信息
      this.loading = true;
      this.dataTypeInfo = [];
      this.dialogOptionsListGS.devInfoList = [];
      this.dialogOptionsListPad.devInfoList = [];
      let resBody = new devInfo();
      resBody.data.branchIdList =
        this.selBrno.length > 0 ? this.selBrno[0] : "";
      resBody.data.devAssortmentId = this.devInfoMgrQueryForm.devAssortmentId;
      resBody.data.deviceRunState = this.devInfoMgrQueryForm.deviceRunState;
      resBody.data.devNum = this.devInfoMgrQueryForm.devNum;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            if (response.RSP_BODY) {
              this.dataTypeInfo = response.RSP_BODY.devinfoList;
              this.dialogOptionsListGS.devInfoList = [];
              this.dialogOptionsListPad.devInfoList = [];
              this.dataTypeInfo.forEach(element => {
                if (element.devForm == "1") {
                  this.dialogOptionsListGS.devInfoList.push(element);
                } else if (element.devForm == "2") {
                  //if(element.devForm=="2")
                  this.dialogOptionsListPad.devInfoList.push(element);
                }
              });
            }
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    resetForm(formName) {
      //重置查询表单
      this.$refs["" + formName].resetFields();
      this.selBrno = [];
    },
    dialogShow(val) {
      this.dialogOptions.isShow = true;
      this.dialogOptions.active = 0;
      this.dialogOptions.devForm = val;
    },
    modDialogShow(val) {
      this.UpdateDialogOptions.isShow = true;
      // this.UpdateDialogOptions.modActiveTabs = "1";
      // this.UpdateDialogOptions.modClearStyle = {};
      this.UpdateDialogOptions.devId = this.devId;
      this.UpdateDialogOptions.currentRow = this.currentRow[0];
      this.UpdateDialogOptions.devForm = val;
    },
    onSucess(response, file, fileList) {
      //上传文件成功后的事件
      this.fileList.push({ name: file.name, url: file.url });
      this.$message({
        message: "上传文件成功!",
        type: "success"
      });
    },
    beforeAvatarUpload(file) {
      //对上传文件做格式验证
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const extension3 = file.name.split(".")[1] === "doc";
      const extension4 = file.name.split(".")[1] === "docx";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message({
          message: "上传模板只能是 xls、xlsx、doc、docx 格式!",
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传模板大小不能超过 10MB!",
          type: "warning"
        });
      }
      return extension || extension2 || extension3 || (extension4 && isLt2M);
    }
  }
};
</script>


<style scoped lang="scss">
.type-info-manage {
  text-align: left;
}
.top-position {
  margin: 30px 0 0 30px;
}
.type-info-bottom {
  margin-top: 10px;
}
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
.headerClass {
  background: #f7f7f7 !important;
}
.el-card,
.el-message {
  overflow: "";
}
/* //新按钮 */
.component-item {
  /* min-height: 100px; */
}
</style>
