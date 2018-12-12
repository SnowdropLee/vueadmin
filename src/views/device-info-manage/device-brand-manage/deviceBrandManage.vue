<template>
  <div class='dev-brand-manage'  v-loading="loading"
    element-loading-text="加载中。。。">
    <el-card>
      <el-form ref='devBrandMgrQueryForm' :model='devBrandMgrQueryForm' size='mini' label-position="top">
        <el-row :gutter="10">
          <el-col :lg="4" :md="6">
            <el-form-item label='品牌名称' prop='BrandName'>
              <el-input v-model='devBrandMgrQueryForm.BrandName' 
                placeholder='请输入品牌名称' ></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="6" >
            <el-form-item label='品牌简称' prop='BrandShortName'>
              <el-input v-model='devBrandMgrQueryForm.BrandShortName' 
                placeholder='请输入品牌简称' ></el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='primary' size='mini' icon='el-icon-search' 
                @click="brandQuery">查询</el-button>
          </el-col>
            <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
              <el-button type='warning' size='mini' icon='el-icon-refresh' 
                  @click="clearForm('devBrandMgrQueryForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px;" >
      <el-row>
        <el-col :lg="2" :md="3">
          <el-button type='primary' size='mini' icon='el-icon-plus'  v-if="btnPermission('Button_DevBrand_Add')"
          @click='brandAdd()'>新增</el-button>
        </el-col>
        <el-col :lg="2" :md="3">
          <el-button type='primary' size='mini' icon='el-icon-edit' :disabled="!checkedUser"  v-if="btnPermission('Button_DevBrand_Edit')"
          @click='brandUpdate()'>修改</el-button>
        </el-col>
        <el-col :lg='2' :md='3'>
          <el-button type='danger' size='mini' icon='el-icon-delete' class='b-button' :disabled="!checkedUser"  v-if="btnPermission('Button_DevBrand_Delete')"
          @click='delDialogShow'>删除</el-button>
        </el-col>
      </el-row>
        <!-- 新增 -->
          <!-- 列表 -->
      <el-table  ref="dataTypeInfo" :data='BrandInfoList' border  max-height="400" width='100%'
            class="tableMarginTop"
            header-row-class-name="tableHeaderClass"
              highlight-current-row 
              @selection-change="handleCurrentChangeTable"
              >
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column prop='brandName' label='品牌名称' min-width='107px' fixed></el-table-column>
            <el-table-column prop='brandShortName' label='品牌简称' min-width='107px'></el-table-column>
            <el-table-column prop='brandPhone' label='品牌联系电话' min-width='107px'></el-table-column>
            <el-table-column prop='brandAdress' label='品牌地址' min-width='107px'></el-table-column>
            <el-table-column prop='brandContactsName' label='品牌联系人姓名' min-width='107px'></el-table-column>
            <el-table-column prop='brandContactsTelephone' label='品牌联系人电话' min-width='107px'></el-table-column>
      </el-table>
      <div  style="text-align:right;margin-top:20px">
        <el-pagination background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="BrandInfoList.length"> 
        </el-pagination>
      </div>
    </el-card>
    <keep-alive>
      <component :is='dialogList.createBrandInfo' :createBrand='dialogOptions' @refreshBrand="brandQuery"></component>
    </keep-alive>
    <keep-alive>
      <component :is='dialogList.updateBrandInfo' :updateBrandData='UpdateDialogOptions' @refreshBrand="brandQuery"></component>
    </keep-alive>
  </div>
</template>

<script>
import request from "@/utils/request";
import inquireBrandInfo from "@/message/deviceInfoManage/brand/inquire-brandInfo";
import getGlobalParams from "@/utils/getGlobalParams";
import createBrandInfo from "./dialog/createBrand";
import updateBrandInfo from "./dialog/updateBrand";
import brandDel from "@/message/deviceInfoManage/brand/brand-del";
export default {
  data() {
    return {
      dialogList: { createBrandInfo, updateBrandInfo },
      dialogOptions: { isShow: false },
      UpdateDialogOptions: { isShow: false, devId: "", dataTypeInfo: [] },
      devBrandMgrQueryForm: {
        BrandName: undefined,
        BrandShortName: undefined
      },
      BrandInfoList: [
        // {BrandId:"1"},
        // {BrandId:"2"},
      ], //厂商表格数据
      addBrand: {},
      loading: false,
      currentPage: 1,
      isEditClass: true, //表格内form表单元素得样式 修改
      isDisabled: true, //表格内form表单元素是否禁用 修改
      isShowBut: false, //表格内form表单是否显示按钮 修改
      isHeight: false,
      isListItem: "",
      isAddBrand: false,
      checkedUser: false,
      currentRow: []
    };
  },
  created() {
    this.brandQuery();
  },
  methods: {
    brandDel() {
      //删除厂商
      let resBody = new brandDel();
      this.loading = true;
      resBody.data.brandId = this.currentRow.brandId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: "品牌删除成功!"
            });
            this.brandQuery();
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
    delDialogShow() {
      //删除厂商弹窗
      this.$confirm("此操作将永久删除该厂商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.brandDel();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleCurrentChangeTable(val) { //保存当前选中数据并判断按钮是否可用
      this.currentRow = val[0];
      this.UpdateDialogOptions.currentRow = this.currentRow;
      if (val.length == 1) {
        this.checkedUser = true;
      } else if (val.length > 1) {
        this.checkedUser = false;
      } else {
        this.checkedUser = false;
      }
    },
    brandAdd() {  //打开添加弹窗
      this.dialogOptions.isShow = true;
    },
    brandUpdate() {  //打开修改弹窗
      this.UpdateDialogOptions.isShow = true;
    },
    clearForm(item) {  //清除表单数据
      this.$refs["" + item].resetFields();
    },
    handleCurrentChange(val) {
      // this.loading=true;
      let resBody = new inquireBrandInfo();
      resBody.data.BrandName = this.devBrandMgrQueryForm.BrandName;
      resBody.data.BrandShortName = this.devBrandMgrQueryForm.BrandShortName;
      resBody.QueryPageNo = val;
      resBody.QueryRowNum = getGlobalParams.get("BrandInfoNum");
      request(resBody)
        .then(response => {
          this.loading = false;
          this.BrandInfoList = response.RSP_BODY.BrandInfoList;
        })
        .catch(error => {
          //   this.logger.log("fail", error);
        });
    },
    brandQuery() {  //查询厂商表格数据
      this.loading = true;
      let resBody = new inquireBrandInfo();
      resBody.data.BrandName = this.devBrandMgrQueryForm.BrandName;
      resBody.data.BrandShortName = this.devBrandMgrQueryForm.BrandShortName;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.BrandInfoList = response.RSP_BODY.brandInfoList;
          } else {
            this.loading = false;
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


<style lang="scss"  scoped>
.cardStyle {
  margin: 5px 0;
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
.heightlight {
  box-shadow: 0 2px 12px 0 rgba(177, 208, 244, 0.6);
}
</style>
