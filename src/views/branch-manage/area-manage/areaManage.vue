<template>
  <div class='branch-manage' v-loading="loading"
             element-loading-text="加载中。。。">
    <el-card>
      <el-row style="margin-bottom:20px;">
        <el-col>
          <el-button type="primary" size="mini" icon='el-icon-plus' @click="dialogOptions.isShow=true" v-if="btnPermission('Button_BranchGroup_Add')">新增</el-button>  
        </el-col>
      </el-row>
    <el-row :gutter="10">
      <el-col :span="6" >
        <el-card style='height:650px'>
            <div slot="header">
              分组列表
            </div>
            <el-tree
                ref="branchTree"
                class="filter-tree"
                node-key="branchid"
                :data="branchInfo"
                :props='{label: "branchAreaName", branchid: "branchAreaId" }'
                :default-expand-all=true
                @node-click="handleNodeClick"
                :expand-on-click-node=false
                :highlight-current=true
                    >
           <!-- :filter-node-method="filterNode" -->
            </el-tree>
        </el-card >
      </el-col>
      <el-col :span="18">
        <el-card style='height:650px'>
          <div slot="header">
            <el-row>
              <el-col :span="20">
                <span>{{areaTitle}}</span>
              </el-col>
              <el-col :span="4" style="text-align:right">
                <a><i class="el-icon-edit" ref="BrandId" @click="modiBranchArea" v-if="btnPermission('Button_BranchGroup_Edit')"></i></a>
                <a><i class="el-icon-delete" ref="BrandId" @click="delArea" v-if="btnPermission('Button_BranchGroup_Delete')"></i></a>                
              </el-col>              
            </el-row>
          </div>
          <div >
            <el-row>
               <div>分组下机构：</div>
            </el-row>
            <el-row style="margin-top:10px">
              <el-col >
                   <!-- <el-tree
                ref="areaTree"
                node-key="branchareaid"
                :data="areaBranchList"
                :props="branchAreaList"
                :default-expand-all=true
                :prop="branchAreaList"
                    > -->
                <el-tag size="mini" style="margin:5px" v-for="item in areaBranchList" :key="item.branchId">{{item.branchName}}</el-tag>
              <!-- </el-tree> -->
              </el-col>
             
            </el-row>
          </div>
        </el-card >
      </el-col>
    </el-row>
    </el-card>
     <keep-alive>
          <component :is='dialogList.createArea' :createArea='dialogOptions' @refreshTable="refreshTable"></component>
      </keep-alive>
      <keep-alive>
          <component :is='dialogList.updateArea' :updateArea='UpdateDialogOptions' @refreshTable="refreshTable"></component>
      </keep-alive>
  </div>
</template>

<script>
import request from "@/utils/request";
import areaInfoQuery from "@/message/branchManage/areaManage/branch-area-query";
import branchAreaDel from "@/message/branchManage/areaManage/areaDel";
import createArea from "./dialog/createArea";
import updateArea from "./dialog/updateArea";

export default {
  data() {
    return {
      loading: false,
      areaBranchList: [], //分组下机构
      selection: undefined,  //当前选中得分组
      areaTitle: "选择分组", //分组标题
      dialogList: { createArea, updateArea },
      dialogOptions: { isShow: false },
      dialogOptionsImport: { isShow: false },
      UpdateDialogOptions: { isShow: false, devId: "", currnetRow: [] },
      branchInfo: [],  //分组数据
      // branchAreaList: {
      //   label: "branchName",
      //   branchareaid: "branchId"
      // }
    };
  },
  created: function() {
    this.queryBranch();
  },
  methods: {
    refreshTable() {
      //刷新数据并清除选中的数据
      this.clearData();
      this.queryBranch();
    },
    clearData() {
      this.areaBranchList = [];
      this.areaTitle = "选择分组";
    },
    modiBranchArea() {
      //如果选择了分组则打开修改弹窗，并把当前选中得分组信息保存，
      if (this.selection) {
        this.UpdateDialogOptions.isShow = true;
        this.UpdateDialogOptions.currnetRow = this.selection;
      } else {
        this.$message({
          type: "warning",
          message: "请选择分组！"
        });
      }
    },
    queryBranch() { //查询分组
      this.loading = true;
      let resBody = new areaInfoQuery();
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.branchInfo = response.RSP_BODY.branchAreaList;
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    sureDel() { //删除
      let resBody = new branchAreaDel();
      resBody.data.branchAreaId = this.selection.branchAreaId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.$message({
              type: "success",
              message: "分组删除成功!"
            });
            this.refreshTable();
          }
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: error
          });
        });
    },
    delArea() {  //删除弹窗
      if (this.selection) {
        this.$confirm("此操作将永久删除该机构分组, 是否继续?", "提示", {
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
      } else {
        this.$message({
          type: "warning",
          message: "请选择分组！"
        });
      }
    },
    // filterNode(value, data) {
    //   console.log(value)
    //   if (!value) return true;
    //   return data.label.indexOf(value) !== -1;
    // },
    handleNodeClick(data) { //保存当前选中行得数据
      this.areaTitle = data.branchAreaName;
      this.areaBranchList = data.branchObjectList;
      this.selection = data;
    }
  }
};
</script>


<style lang="scss">
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
  margin-bottom: 0;
}
</style>
