<template>
  <div >
    <div v-show="indexShow" v-loading="loading"
     element-loading-text="加载中。。。">
      <el-card>
        <el-row>
          <el-col :lg="2" :md="3">
            <el-button type="primary" size="mini" @click="dialogOptions.isShow=true" v-if="btnPermission('Button_Menu_Add')">新增</el-button>
          </el-col>
          <el-col :lg="2" :md="3">
            <el-button type="danger" :disabled="!isDisabledDel" size="mini" @click="delBut" v-if="btnPermission('Button_Menu_Edit')">删除</el-button>
          </el-col>
          <el-col :lg="3" :md="3">
            <el-dropdown size="mini"   trigger="click" @command="itemClick" >
              <el-button type="primary" size="mini" :disabled="!isPub" v-if="btnPermission('Button_Menu_Release')">
                    发布<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown"  >
                <el-dropdown-item command="0">按设备发布</el-dropdown-item>
                <el-dropdown-item command="1">按分组发布</el-dropdown-item>
                <el-dropdown-item command="2">按机构发布</el-dropdown-item>
                <el-dropdown-item command="3">按设备分类发布</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-card>
      <el-card style="margin-top:10px;" >
        <el-table  ref="menuModelList" :data='menuModelList' border style="min-height:390px"
          class="tableMarginTop"
          header-row-class-name="tableHeaderClass"
          @select-all="selectAll"
          @selection-change="selectList">
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column prop='menu_Model_Id' label='菜单编号' min-width='107px'></el-table-column>
            <el-table-column prop='modelName' label='菜单样式名称' min-width='107px'></el-table-column>
            <el-table-column prop='isUpload' label='是否已发布' :formatter="dataFormat" min-width='107px'></el-table-column>
            <el-table-column prop='create_User' label='创建人' min-width='107px'></el-table-column>
            <el-table-column prop='create_Time' label='创建时间' min-width='107px'  ></el-table-column>
            <el-table-column  label="菜单预览" align="center" fixed="right" width="80">
                <template slot-scope="scope">
                    <el-button type="text" size="mini"
                   @click="dialogDetail(scope)">预览</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div  style="text-align:right;margin-top:10px">
          <el-pagination background
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="total"> 
          </el-pagination>
        </div>
      </el-card>
      <el-dialog title="按设备发布" :visible.sync="devPub" width="770px" @open="devOpen" :close-on-click-modal=false>
        <el-card>
        <el-form inline :data="modelBranchPub" size="mini">
          <el-form-item label="机构:">
            <!-- <el-cascader :options='branchNo' v-model='modelBranchPub.branchNo'></el-cascader> -->
            <select-tree v-model="modelBranchPub.branchNo" style="width:150px;"
                      :props='{id:"branchId",label: "branchName",children: "childBranch"}' 
                      :tree-data="brnoList" :node-key="'branchId'" ></select-tree>
          </el-form-item>
          <el-button type="primary" size="mini" @click="queryDev">查询</el-button>
        </el-form> 
        
          <el-table  ref="devList" :data="devList" max-height="300"  
          @selection-change="releaseTableChangeHandel" 
              style="margin-top:5px;border:1px solid #ebeef5;border-radius:3px;" >
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop='devNum' label='设备编号' min-width='107px'></el-table-column>
              <el-table-column prop='devType' label='设备类型' min-width='107px'></el-table-column>
              <el-table-column prop='branchName' label='所在网点' min-width='107px'></el-table-column>
              <el-table-column prop='devAssortmentName' label='设备描述' min-width='107px'></el-table-column>
          </el-table>
          <div class="box" style="text-align:right;margin-top:10px">
            <el-pagination background
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="devLists.length"> 
            </el-pagination>
          </div>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="devPub = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="releaseSubmit('dev')" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="按分组发布" :visible.sync="areaPub" width="400px" @close="modelAreaPub.areaList=''">
        <el-card>
        <el-form inline :data="modelAreaPub" size="mini">
          <el-row>
            <el-col :span="24">
            <el-form-item label="分组:">
              <el-select v-model="modelAreaPub.areaList"  
                    placeholder="请选择分组">
                     <el-option
                        v-for="item in areaList"
                        :key="item.branchAreaId"
                        :label="item.branchAreaName"
                        :value="item.branchAreaId">
                    </el-option>
              </el-select>
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="areaPub = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="releaseSubmit('dis')" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="按机构发布" :visible.sync="branchPub" width="400px" @open='brnoOpen' @close="modelBranchPub.branchNo=[]">
        <el-card style="overflow:visible">
          <el-form inline :data="modelBranchPub" size="mini">
            <el-form-item label="机构:">
            <select-tree v-model="modelBranchPub.branchNo" style="width:250px;"
                        :props='{id:"branchId",label: "branchName",children: "childBranch"}' 
                        :tree-data="brnoList1" :node-key="'branchId'" ></select-tree>
            </el-form-item>
          </el-form>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="branchPub = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="releaseSubmit('branch')" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="按设备分类发布" :visible.sync="devShortPub" width="400px" @open='brnoOpen' @close="devShortForm.devShort=[]">
        <el-card style="overflow:visible">
          <el-form inline :data="devShortForm" size="mini">
            <el-row>
            <el-col :span="24">
            <el-form-item label="设备分类:">
             <el-select v-model="devShortForm.devShort" multiple placeholder="请选择设备分类" >
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
            </el-row>
          </el-form>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="devShortPub = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="releaseSubmit('devSort')" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <keep-alive>
       <component :is='dialogList.menuModelAdd' :option='dialogOptions' @refreshTable="queryMenuModel"></component>
    </keep-alive>
    <keep-alive>
       <component :is='dialogList.menuModelDetail' :option='dialogOptionsDetail'></component>
    </keep-alive>
  </div>
</template>


<script>
import menuModelAdd from "./dialog/menuModelAdd";
import menuModelDetail from "./dialog/menuModelDetail";
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import getGlobalParams from "@/utils/getGlobalParams";
import queryDeal from "@/message/resourceManage/menu/menuModel/menu-model-query";
import delMenuModel from "@/message/resourceManage/menu/menuModel/menu-model-del";
import releaseIns from "@/message/resourceManage/menu/menuModel/menu-model-publish";
import InquireModel from "@/message/deviceRunManage/dev-run-info-query"; //设备信息表临时
import spinnerDataList from "@/message/spinnerDataQuery/spinner-data-query";
import toolBox from "@/utils/toolBox";

export default {
  components: { selectTree },
  data() {
    return {
      total:undefined,
      areaList:[], //分组下拉框数据
      modelAreaPub: { areaList:'' },
      brnoList1: [],
      menuModelList: [],
      releaseSelection: [],
      brnoList:[],
      devLists: [],
      devSort:[],
      loading: false,
      devPub: false,
      areaPub: false,
      branchPub: false,
      devShortPub:false,
      isDisabledDel: false,
      isPub: false,
      dialogList: { menuModelAdd ,menuModelDetail},
      dialogOptions: { isShow: false },
      dialogOptionsDetail: { isShow: false ,menuList:[]},      
      branchNo: [],
      modelBranchPub: {
        branchNo: []
      },
      devShortForm:{
        devShort:[]
      },
      currentPage: 1,
      pageSize: undefined,
      menu_Model_Id: undefined,
      menu_Model_Id_pub: undefined,
      enum: {
        "0": "否",
        "1": "是"
      }
    };
  },
  created() {
    this.pageSize = getGlobalParams.get("PageSize");
    this.queryMenuModel();
    this.initSpinnerDataList();
  },
  computed: {
    devList() {
      return this.devLists.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    indexShow(){
      return !this.dialogOptions.isShow && !this.dialogOptionsDetail.isShow
    }
  },
  methods: {
    dialogDetail(value){ //预览
      this.dialogOptionsDetail.isShow=true;
      this.dialogOptionsDetail.menuList=value.row.groupInfo;
    },
    releaseTableChangeHandel(val) {
      //按设备发布表格
      this.releaseSelection = val;
    },
    async releaseSubmit(type) {
      //发布得事件
      this.loading = true;
      let resBody = new releaseIns();
      // resBody.data.devId = ""
      resBody.data.modelId = this.menu_Model_Id_pub;
      if (type == "dev") {
        var temp = [];
        for (var i = 0; i < this.releaseSelection.length; i++) {
          temp.push(this.releaseSelection[i].devId);
        }
        this.devPub = false;
        resBody.data.publicType = "1"; //按设备发布标记
        resBody.data.publicTypeVal = temp.join(",");
      } else if (type == "branch") {
        this.branchPub = false;
        resBody.data.publicType = "2"; //按机构发布标记
        resBody.data.publicTypeVal = this.modelBranchPub.branchNo.join(",");
      } else if (type == "dis") {
        this.areaPub = false;
        resBody.data.publicType = "3"; //按分组发布标记
        resBody.data.publicTypeVal = this.modelAreaPub.areaList//.join(","); //这里是区域号  还没有查询的请求
      }else if (type == "devSort") {
        this.devShortPub = false;
        resBody.data.publicType = "4"; //按设备分类发布标记
        resBody.data.publicTypeVal = this.devShortForm.devShort.join(","); //这里是区域号  还没有查询的请求
      }
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "提交成功!"
        });
        this.queryMenuModel()
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
    //分组下拉框初始化
    initSpinnerDataList() {
      let resBody = new spinnerDataList();
      resBody.data.spinnerList = [{ spinnerName: "branchArea" }];
      request(resBody)
        .then(response => {
          this.areaList = response.RSP_BODY.branchAreaList;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },
    dataFormat(row, column) {
      //枚举设备形式
      return this.enum[row[column.property]];
    },
    tableDateFormat(row, column) {
      return toolBox.timeFormat2Date(row[column.property]);
    },
    delBut() {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.menuModelDel();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    menuModelDel() {  //删除菜单
      this.loading = true;
      let resBody = new delMenuModel();
      resBody.data.menu_Model_Id = this.menu_Model_Id;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            let message=""
            for (let i = 0; i <response.RSP_BODY.resultSet.length; i++) {
              message+=response.RSP_BODY.resultSet[i].alertMessage
            }
            this.$message({
              type: "success",
              message:message
            });
            this.queryMenuModel();
          } else {
            this.loading = false;
            this.$message({
              type: "success",
              message: "菜单删除失败!"
            });
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    queryMenuModel() {  //查询菜单
      this.isPub=false;
      this.loading = true;
      let resBody = new queryDeal();
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            if (response.RSP_BODY) {
              this.menuModelList = response.RSP_BODY.resultSet;
              this.total= response.RSP_BODY.total
            } else {
              this.loading=false;
              this.$message({
                type: "warning",
                message: "没有满足条件得记录!"
              });
            }
          }else{
            this.loading=false;
            this.$message({
              type: "error",
              message:
                "请求失败，错误码:" +
                response.SYS_HEAD.ReturnCode +
                "，错误信息：" +
                response.SYS_HEAD.ReturnMessage
            });
           }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      this.currentPage=val
    },
    brnoOpen() { //初始化下拉列表
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" },{ spinnerName: "devAssortment" }];
      request(resBody)
        .then(response => {
          this.brnoList1 = response.RSP_BODY.branchSpinner;
          this.devSort =response.RSP_BODY.deviceAssortmentSpinner;     
        })
        .catch(error => {
          console.error("错误信息", error);
        });
    },
    devOpen() {  //初始化下拉列表
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brnoList = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("错误信息", error);
        });
      this.queryDev()
    },
    async queryDev() {
      this.loading = true;
      let resBody = new InquireModel();
      resBody.data.DevNum = "";
      resBody.data.BranchId = this.modelBranchPub.branchNo.join(",");
      resBody.data.deviceType = "";
      resBody.data.DeviceRunState = "";
      resBody.QueryPageNo = 1;
      resBody.QueryRowNum = 100;

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.devLists = response.RSP_BODY.devRunningInfoList;
        // this.total = response.RSP_BODY.total;
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
    selectAll(row) {
      if (row.length >= 1) {
        this.isDisabledDel = true;
      } else {
        this.isDisabledDel = false;
      }
    },
    selectList(selection) {  //控制按钮是否禁用
      this.menu_Model_Id = "", //多选删除，拼接Id
      this.menu_Model_Id_pub =selection.length>0 && selection[0].menu_Model_Id
      this.delRow = [];
      selection.forEach(element => {
        this.delRow.push(element.roleId);
        this.menu_Model_Id = this.menu_Model_Id + element.menu_Model_Id + ",";
      });
      this.menu_Model_Id = this.menu_Model_Id.slice(
        0,
        this.menu_Model_Id.length - 1
      );
      if (selection.length == 1) {
        this.isDisabledDel = true;
        this.isPub = true;
      } else if (selection.length > 1) {
        this.isDisabledDel = true;
        this.isPub = false;
      } else {
        this.isDisabledDel = false;
        this.isPub = false;
      }
    },
    itemClick(val) {
      val === "0"? (this.devPub = true): val === "1" ? (this.areaPub = true) : val==="2"?(this.branchPub = true):(this.devShortPub=true);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
