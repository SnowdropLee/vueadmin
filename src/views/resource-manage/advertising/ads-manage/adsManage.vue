<template>
  <div v-loading="loading"
             element-loading-text="加载中。。。" style="min-height:300px">
    <!-- 查询条件 -->
    <!-- <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="机构">
          <el-select v-model="formInline.b" size="small" placeholder="请输入机构检索">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card> -->
    
    <el-card>
        <el-row>
            <el-col :md="3" :lg="2">
                <el-button type="primary" size="mini"
                icon="el-icon-plus"
                @click="dialogOptions.addAdvertisingIsShow = true"
                v-if="btnPermission('Button_ADTemp_Add')">新增</el-button>
            </el-col>
            <el-col :md="3" :lg="2">
                <el-button type="primary" size="mini" 
                icon="el-icon-edit"
                @click="editBtnHandel" :disabled="!(selection.length==1)"
                v-if="btnPermission('Button_ADTemp_Edit')">修改</el-button>
            </el-col>
            <el-col :md="3" :lg="2">
                <el-button type="danger" size="mini" 
                icon="el-icon-delete"
                @click="influencedDelDev"
                :disabled="!(selection.length>=1)"
                v-if="btnPermission('Button_ADTemp_Delete')">删除</el-button>
            </el-col>
            <el-col :md="3" :lg="2">
                <el-dropdown @command="handleCommand" trigger="click">
                    <el-button type="primary" size="mini" :disabled="!(selection.length==1)" v-if="btnPermission('Button_ADTemp_Release')">
                        发布<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="deviceRelease">按设备发布</el-dropdown-item>
                        <el-dropdown-item command="brnoRelease">按机构发布</el-dropdown-item>
                        <el-dropdown-item command="areaRelease">按分组发布</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            @selection-change="handleSelectChange"
            header-row-class-name="tableHeaderClass"
            class="tableMarginTop"
            border>
            <el-table-column
                type="selection" width="40" fixed>
            </el-table-column>
            <el-table-column
                prop="ADTEMPID" label="广告编号" width="80">
            </el-table-column>
            <el-table-column
                prop="TEMPNAME" label="广告名称" width="140">
            </el-table-column>
            <el-table-column
                prop="TEMPDESC" label="描述">
            </el-table-column>
            <el-table-column
                prop="CREATETIME" label="创建时间" :formatter="timeFormat">
            </el-table-column>
            <el-table-column  label="广告预览" align="center" fixed="right" width="80">
                <template slot-scope="scope">
                    <el-button type="text" size="mini"
                    @click="dialogDetail(scope, tableData)">预览</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top: 20px;text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 50,100]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            background
            :total="total"> 
        </el-pagination>

    </el-card>
    
    <!-- 弹框 -->
    <component :is='dialogList.addAdvertising' :option='dialogOptions' @succ="queryTable"></component>
    <component :is='dialogList.updateAdvertising' :option='dialogOptions' :edit-id="editSelectionId" :edit-data="editData" @succ="queryTable"></component>
    <component :is='dialogList.advertisingDetail' :option='dialogOptions' :show-data="showData"></component>

    <el-dialog title="按设备发布" :visible.sync="deviceRelease" width="750px" :lock-scroll=false>
        <el-card>
        <el-form :data="deviceReleaseForm" size="mini" label-position='top'>
            <el-row :gutter="10">
                <el-col :md="12" :lg="8">
                    <el-form-item label='机构编号' class='typeInfo-el-form-item' prop='branchId'>
                            <select-tree ref="tree" v-model="deviceReleaseIds"
                            :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                    </el-form-item>
                </el-col>
                <el-col :md="4" :lg="3" class="searchBtnMarginTop">
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryDev">查询</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table 
          :data="tableData2" 
          @selection-change="releaseTableChangeHandel" 
          header-row-class-name="tableHeaderClass"
          class="tableMarginTop"
          border>
                <el-table-column type="selection" width="40" fixed></el-table-column>
                <el-table-column property="devNum" label="设备编号"></el-table-column>
                <el-table-column property="devType" label="设备类型"></el-table-column>
                <el-table-column property="branchName" label="所在机构"></el-table-column>
                <el-table-column property="devAssortmentName" label="描述"></el-table-column>
        </el-table>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="deviceRelease = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="releaseSubmit('dev')">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="按机构发布" :visible.sync="brnoRelease" width="600px" :lock-scroll=false>
        <el-card>
        <el-form :data="deviceReleaseForm" size="mini" label-position='top'>
            <el-form-item label='机构编号' class='typeInfo-el-form-item' prop='branchId'>
                    <select-tree ref="tree" v-model="deviceReleaseForm.branchId"
                    :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
            </el-form-item>
        </el-form>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="brnoRelease = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="releaseSubmit('branch')">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="按分组发布" :visible.sync="areaRelease" width="600px" :lock-scroll=false>
        <el-form :data="deviceReleaseForm" size="mini" label-position="top">
            <el-form-item label="分组">
                <el-select v-model="deviceReleaseForm.area" 
                      placeholder="请选择分组发布"
                      >
                      <!-- multiple -->
                      <el-option
                          v-for="item in areaList"
                          :key="item.branchAreaId"
                          :label="item.branchAreaName"
                          :value="item.branchAreaId">
                      </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="areaRelease = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="releaseSubmit('dis')">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog :visible.sync="deleteCheckPopStatu" :lock-scroll=false>
      <div v-loading="loading">
        下列模板中因有广告图片正在使用当中 无法删除
        <el-table
        :data="deleteCheckData"
        style="width: 100%;"
        max-height="400"
        >
          <el-table-column
            prop="adtempId"
            label="广告模板编号"
            width="120"
            >
          </el-table-column>
          <el-table-column
            prop="adtempName"
            label="广告名称"
            >
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="deleteCheckPopStatu = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="deleteHandle">继续删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addAdvertising from "./dialog/addAdvertising";
import updateAdvertising from "./dialog/updateAdvertising";
import advertisingDetail from "./dialog/advertisingDetail";
import getGlobalParams from "@/utils/getGlobalParams";
import selectTree from "@/components/selectTree2/";

import request from "@/utils/request";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";
import toolBox from "@/utils/toolBox";
import tableIns from "@/message/resourceManage/advertising/ad-manage-table";
import deleteCheckIns from "@/message/resourceManage/advertising/ad-manage-deleteCheck";
import deleteIns from "@/message/resourceManage/advertising/ad-manage-delete";
import editShowIns from "@/message/resourceManage/advertising/ad-manage-editShow";
import previewIns from "@/message/resourceManage/advertising/ad-manage-preview";
import InquireModel from "@/message/deviceRunManage/dev-run-info-query";
import releaseIns from "@/message/resourceManage/advertising/ad-manage-release";

export default {
  components: { selectTree },
  data() {
    return {
      deleteCheckPopStatu:false,
      deleteCheckData:[],
      editSelectionId:"",
      brno:[],
      areaList:[],
      selection: [],
      releaseSelection: [],
      total: 0,
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      loading: false,
      dialogList: {
        addAdvertising,
        updateAdvertising,
        advertisingDetail
      },
      dialogOptions: {
        addAdvertisingIsShow: false,
        updateAdvertisingIsShow: false,
        advertisingDetailIsShow: false
      },
      editData: {},
      showData: {},
      //三种发布方式弹窗的显示和隐藏
      deviceRelease: false,
      brnoRelease: false,
      areaRelease: false,
    
      deviceReleaseIds:[],
      deviceReleaseForm:{
          branchId:[],
          area:[]
      },
      tableData: [],
      tableData2: []
    };
  },
  methods: {

    releaseTableChangeHandel(val){
        console.log(val);
        this.releaseSelection = val;
    },
    handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryTable();
    //   console.log(`当前页: ${val}`);
    },
    editBtnHandel() {
      //请求后填入编辑子组件
      this.queryEditShow();
      this.dialogOptions.updateAdvertisingIsShow = true;
    },
    onSubmit() {
      console.log("submit!");
    },
    //所有弹窗的提交
    async releaseSubmit(type){
      this.loading = true;
      let resBody = new releaseIns();
    
        resBody.data.adtempId = this.selection[0].ADTEMPID;
        if(type=="dev"){
          if(this.releaseSelection.length==0){
            this.$message({
              type: "warning",
              message: "请选择至少一个设备"
            });
            this.loading = false;
            return
          }
            var temp = [];
            for (var i = 0; i < this.releaseSelection.length; i++) {
                temp.push(this.releaseSelection[i].devId);
            }
            this.deviceRelease = false;
            resBody.data.publicType = "1";//按设备发布标记
            resBody.data.publicTypeVal = temp.join(",");
        }
        else if(type=="branch"){
          if(this.deviceReleaseForm.branchId.length==0){
            this.$message({
              type: "warning",
              message: "请选择至少一个机构"
            });
            this.loading = false;
            return
          }
          this.brnoRelease = false;
          resBody.data.publicType = "2";//按机构发布标记
          resBody.data.publicTypeVal = this.deviceReleaseForm.branchId.join(",");
        }
        else if(type=="dis"){
          if(this.deviceReleaseForm.area==""){
            this.$message({
              type: "warning",
              message: "请选择一个分组"
            });
            this.loading = false;
            return
          }
            this.areaRelease = false;
            // console.log(this.deviceReleaseForm);
            resBody.data.publicType = "3";//按分组发布标记
            // resBody.data.publicTypeVal = this.deviceReleaseForm.area.join(",");
            resBody.data.publicTypeVal = this.deviceReleaseForm.area;
        }


      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "提交成功!"
        });
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
    dialogDetail(index, rows) {
      this.queryView(index, rows);
    },
    //打开弹窗
    handleCommand(val) {
      if (val == "deviceRelease") this.deviceRelease = true;
      if (val == "brnoRelease") this.brnoRelease = true;
      if (val == "areaRelease") this.areaRelease = true;
    },
    handleSelectChange(selection) {
      this.selection = selection;
    },
    async queryTable() {
      this.loading = true;
      let resBody = new tableIns();

      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.resultSet;
        this.total = response.RSP_BODY.total||response.QUERY_INFO_HEAD.QueryAllDataCount;
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
    async influencedDelDev() {
      this.loading = true;
      let resBody = new deleteCheckIns();
      var temp = [];
      for (var i = 0; i < this.selection.length; i++) {
        temp.push(this.selection[i].ADTEMPID);
      }
      resBody.data.adtempId = temp.join(",");

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.deleteCheckData = response.RSP_BODY.resultSet;
        if(this.deleteCheckData.length==0){
          this.deleteHandle();
          return
        }
        this.deleteCheckPopStatu = true;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    deleteHandle() {
      this.$confirm("您确定是否要删除，删除后将不能恢复", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.queryDelete();
      }).catch(function(){return});
    },
    async queryDelete() {
      this.loading = true;
      let resBody = new deleteIns();
      var temp = [];
      for (var i = 0; i < this.selection.length; i++) {
        temp.push(this.selection[i].ADTEMPID);
      }
      resBody.data.adtempId = temp.join(",");



      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.queryTable();
        this.deleteCheckPopStatu = false;
        this.$message({
          type: "success",
          message: "删除成功!"
        });
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
    async queryEditShow() {
      this.loading = true;
      let resBody = new editShowIns();

      resBody.data.adtempId = this.selection[0].ADTEMPID;

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.editData = response.RSP_BODY.resultSet;
        this.editSelectionId=this.selection[0].ADTEMPID;
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
    async queryView(scope, table) {
      var id = scope.row.ADTEMPID;
      this.loading = true;
      let resBody = new previewIns();
      resBody.data.adtempId = id;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.dialogOptions.advertisingDetailIsShow = true;
        if(typeof(response.RSP_BODY.resultSet)=="string"){
          this.showData = JSON.parse(response.RSP_BODY.resultSet);
        }
        else{
          this.showData = response.RSP_BODY.resultSet;
        }
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
    //获取spinner并且更新dom
    async getSpinner(){
      let resBody = new spinnerList();
      resBody.data.spinnerList = [
        { spinnerName: "branch" },
        { spinnerName: "branchArea" }
      ];
      let response = await request(resBody);

      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.brno = response.RSP_BODY.branchSpinner;
        this.areaList = response.RSP_BODY.branchAreaList;
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
    //使用机构查询机具暂时先使用这个请求
    async queryDev() {
      this.loading = true;
      let resBody = new InquireModel();
      resBody.data.DevNum = "";
      resBody.data.BranchId = this.deviceReleaseIds.join(",");
      resBody.data.deviceType = "";
      resBody.data.DeviceRunState = "";
      resBody.QueryPageNo = 1;
      resBody.QueryRowNum = 100;

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData2 = response.RSP_BODY.devRunningInfoList;
        // this.total = response.RSP_BODY.total;
      } else {
        this.$message({
          type: "error",
          message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
        });
      }
    },
    timeFormat(row, col) {
      return toolBox.timeFormat(row[col.property]); //201806280000-->>2018-06-28
    }
  },
  created() {
    this.getSpinner();
    this.queryTable();
  }
};
</script>

<style lang="scss" scope>
.el-card{
  overflow: inherit;
}
</style>