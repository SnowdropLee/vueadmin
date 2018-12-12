<template>
  <div class='dev-model-manage' v-loading="loading"
    element-loading-text="加载中。。。">
    <el-card>
      <el-form ref='devShortQueryForm' :model='devShortQueryForm' size='mini' label-position="top">
        <el-row :gutter="10">
          <el-col :lg="4" :md="6">
            <el-form-item label='设备分类名称' class='typeInfo-el-form-item' prop='devAssortmentName'>
              <el-input v-model='devShortQueryForm.devAssortmentName'
              placeholder="设备分类名称"  filterable></el-input>
            </el-form-item>
          </el-col>
            <!-- <el-col  :lg="4" :md="6" >
                  <el-form-item label='设备形式' class='typeInfo-el-form-item' prop='devForm'>
                          <el-cascader v-model='devShortQueryForm.devForm'  :options="devForm"
                            :props="{value:'devForm',label:'devFormName'}"
                      placeholder="请选择设备形式"  filterable></el-cascader>
                  </el-form-item>
            </el-col> -->
            <el-col  :lg="2" :md="3"  class="searchBtnMarginTop">
              <el-button type='primary' size='mini' icon='el-icon-search' 
                :loading="loading" @click="shortQuery">查询</el-button>
            </el-col>
            <el-col  :lg="2" :md="3"  class="searchBtnMarginTop">
              <el-button type='warning' size='mini' icon='el-icon-refresh' 
                  @click="clearForm('devShortQueryForm')">重置</el-button>
            </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px;"  >
      <el-tabs type="border-card" style="min-height:564px;">
        <el-tab-pane label="柜式">
          <el-row>
            <el-col  :lg="2" :md="3">
              <el-button type='primary' size='mini' icon='el-icon-plus' class='b-button' v-if="btnPermission('Button_DevClassify_Add')"
                @click='addShort("1")'>新增</el-button>
            </el-col>
            <el-col :offset="9" :span="10">
            </el-col>
            <el-col :lg="2" :md="3">
              <el-button type='primary' size='mini' icon='el-icon-edit' class='b-button' :disabled="!checkedUser" v-if="btnPermission('Button_DevClassify_Edit')"
                @click='dialogOptionsMod.isShow=true'>修改</el-button>
            </el-col>
            <el-col  :lg="2" :md="3">
              <el-button type='danger' size='mini' icon='el-icon-delete' class='b-button'   :disabled="!isDisabledDel" v-if="btnPermission('Button_DevClassify_Delete')"
                @click='delShortClick'>删除</el-button>
            </el-col>
            <el-col :offset="9" :span="10">
            </el-col>
          </el-row>
            <keep-alive>
              <component :is='dialogList.listdevSort' :optionSort='dialogOptionsListGS' @rowDate="rowDate" @isEnabled="isEnabled"></component>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="PAD">
            <el-row>
              <el-col  :lg="2" :md="3">
                <el-button type='primary' size='mini' icon='el-icon-plus' class='b-button' v-if="btnPermission('Button_DevClassify_Add')"
                  @click='addShort("2")'>新增</el-button>
              </el-col>
              <el-col :offset="9" :span="10">
              </el-col>
              <el-col :lg="2" :md="3">
                <el-button type='primary' size='mini' icon='el-icon-edit' class='b-button' :disabled="!checkedUserPad" v-if="btnPermission('Button_DevClassify_Edit')"
                  @click='dialogOptionsMod.isShow=true'>修改</el-button>
              </el-col>
              <el-col  :lg="2" :md="3">
                <el-button type='danger' size='mini' icon='el-icon-delete' class='b-button'   :disabled="!isDisabledDelPad" v-if="btnPermission('Button_DevClassify_Delete')"
                  @click='delShortClick'>删除</el-button>
              </el-col>
              <el-col :offset="9" :span="10">
              </el-col>
            </el-row>
            <keep-alive>
              <component :is='dialogList.listdevSort' :optionSort='dialogOptionsListPad'  @rowDate="rowDate" @isEnabled="isEnabledPad"></component>
            </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <keep-alive>
      <component :is='dialogList.createShort' :createModel='dialogOptionsCreate' @refreshTable="shortQuery"></component>
    </keep-alive>
    <keep-alive>
      <component :is='dialogList.modShort' :modModel='dialogOptionsMod'  @refreshTable="shortQuery"></component>
    </keep-alive>
  </div>
</template>

<script>
import request from "@/utils/request";
import createShort from "./dialog/createSort";
import listdevSort from "./dialog/listdevSort";
import modShort from "./dialog/modSort";
import getGlobalParams from "@/utils/getGlobalParams";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import devShortInfo from "@/message/deviceInfoManage/short/dev-short-query";
import sureDelShort from "@/message/deviceInfoManage/short/dev-short-del";

export default {
  data() {
    return {
      currentRow:undefined,
      checkList: [], //模块数据
      devShortQueryForm: {
        devForm: [],
        devAssortmentName: ""
      },
      shortInfoList: [],
      deviceTypeSpinner: [],
      dialogList: { createShort, modShort ,listdevSort},
      dialogOptionsCreate: { isShow: false ,devForm:""},
      dialogOptionsMod: { isShow: false ,currentRow:undefined},
      dialogOptionsListGS: { devSortList: []},
      dialogOptionsListPad: { devSortList: []},
      devForm: [],
      loading: false,
      currentPage: 1,
      checkedUser: false,
      isDisabledDel: false,
      checkedUserPad: false,
      isDisabledDelPad: false,
      rules: {
        BrandId: [{ required: true, message: "请输入品牌ID", trigger: "blur" }],
        BrandName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }
        ],
        BrandShortName: [
          { required: true, message: "请输入品牌简称", trigger: "blur" }
        ],
        BrandPhone: [
          { required: true, message: "请输入品牌联系电话", trigger: "blur" }
        ],
        BrandAdress: [
          { required: true, message: "请输入品牌地址", trigger: "blur" }
        ],
        BrandContactsName: [
          { required: true, message: "请输入品牌联系人姓名", trigger: "blur" }
        ],
        BrandContactsTelephone: [
          { required: true, message: "请输入品牌联系人电话", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 设备类型初始化
    let resBody = new devRunList();
    resBody.data.spinnerList = [
      { spinnerName: "devType" },
      { spinnerName: "devForm" }
    ];
    request(resBody)
      .then(response => {
        this.deviceTypeSpinner = response.RSP_BODY.deviceTypeSpinner;
        this.devForm = response.RSP_BODY.devFormSpinner;
      })
      .catch(error => {
        console.error("查询错误", error);
      });
    this.shortQuery(); //查询表格
  },
  methods: {
    addShort(val){  //打开添加弹窗
      this.dialogOptionsCreate.isShow=true
      this.dialogOptionsCreate.devForm=val
    },
    rowDate(val){  //返回的表格选中数据
      this.currentRow=val
      this.dialogOptionsMod.currentRow= this.currentRow
    },
    isEnabled(checkedUser,isDisabledDel) {  //返回按钮是否可用 柜式
      this.checkedUser=checkedUser
      this.isDisabledDel=isDisabledDel
    },
    isEnabledPad(checkedUser,isDisabledDel) {  //返回按钮是否可用 PAD
      this.checkedUserPad=checkedUser
      this.isDisabledDelPad=isDisabledDel

    },
    // cProgramGroup(val){//去掉C端应用的","
    //   if(val){
    //     val+=","
    //   }
    //   val=val.slice(0,val.length-1)
    //   return val
    // },
    // handleCurrentChangeTable(val) {
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
    sureDel(){
      this.loading=true;
       let resBody = new sureDelShort();
        resBody.data.devAssortmentId =this.currentRow.devAssortmentId;
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              this.loading=false;              
              this.$message({
                type: "success",
                message: "设备分类删除成功!"
              });
              this.shortQuery()
            }else{
              this.loading=false;                            
            }
          })
          .catch(error => {
              this.loading=false;                          
            this.$message({
              type: "info",
              message: error
            });
        });
    },
    delShortClick() {
      this.$confirm("此操作将永久删除该设备分类, 是否继续?", "提示", {
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
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    // handleCurrentChange(val) {
    //   // this.loading=true;
    //   let resBody = new devShortInfo();
    //   resBody.data.devForm = this.devShortQueryForm.devForm;
    //   resBody.data.devAssortmentName = this.devShortQueryForm.devAssortmentName;
    //   resBody.QueryPageNo = this.currentPage;
    //   resBody.QueryRowNum = getGlobalParams.get("PageSize");
    //   request(resBody)
    //     .then(response => {
    //       this.loading = false;
    //       this.shortInfoList = response.RSP_BODY.BrandInfoList;
    //     })
    //     .catch(error => {
    //       //   this.logger.log("fail", error);
    //     });
    // },
    shortQuery() {
      this.shortInfoList=[]
      this.dialogOptionsListGS.devSortList=[]
      this.dialogOptionsListPad.devSortList=[]
      this.loading=true;
      let resBody1 = new devShortInfo();
      resBody1.data.devForm = this.devShortQueryForm.devForm[0];
      resBody1.data.devAssortmentName = this.devShortQueryForm.devAssortmentName;
      resBody1.QueryPageNo = this.currentPage;
      resBody1.QueryRowNum = getGlobalParams.get("PageSize");
      request(resBody1)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
          this.loading = false;
            if(response.RSP_BODY){
              this.shortInfoList = response.RSP_BODY.devAssortmentList;
              this.shortInfoList.forEach(element => {
               if(element.devForm=="1"){
                 this.dialogOptionsListGS.devSortList.push(element)
               }else if(element.devForm=="2"){  //if(element.devForm=="2")
                 this.dialogOptionsListPad.devSortList.push(element)
               }
             })
            }else{
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
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
</style>
