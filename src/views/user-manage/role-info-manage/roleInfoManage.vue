<template>
  <div   v-loading="loading">
    <el-row :gutter="10">
      <el-col :lg="8" :md="24">
        <el-card class="rolePannel">
          <!-- <el-card  v-loading="loading"> -->
          <el-tabs type="border-card">
            <el-tab-pane label="自助V端角色">
              <div class="contentRole">
                <el-radio-group v-model="selRole" size="mini">
                  <el-radio :label="item.roleId"  @change="roleChange(item)" border v-for="item in  roleNameV" :key="item.id">{{item.roleName}}</el-radio> 
                </el-radio-group>
              </div>
              <el-button type="primary" size="mini"  @click="dialogOptionsAdd.isShow=true;dialogOptionsAdd.active=0;dialogOptionsAdd.aumsSystem='002';"  v-if="btnPermission('Button_Role_Add')">新建角色</el-button>
              <el-button type="danger"  :disabled="isDisabledDel" size='mini' @click="delRoleClick"  v-if="btnPermission('Button_Role_Delete')">删除角色</el-button>
            </el-tab-pane>
            <el-tab-pane label="自助C端管理员">
              <div class="contentRole">
              <el-radio-group v-model="selRole" size="mini">
                <el-radio :label="item.roleId"  @change="roleChange(item)"  border v-for="item in  roleNameC" :key="item.id">{{item.roleName}}</el-radio>
              </el-radio-group>
            </div>
              <el-button type="primary" size="mini"  @click="dialogOptionsAdd.isShow=true;dialogOptionsAdd.active=0;dialogOptionsAdd.aumsSystem='001';"  v-if="btnPermission('Button_Role_Add')">新建角色</el-button>
              <el-button type="danger"  :disabled="isDisabledDel" size='mini' @click="delRoleClick" v-if="btnPermission('Button_Role_Delete')">删除角色</el-button>                    
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :lg="16" :md="24">
          <!-- <el-card > -->
        <el-card class="rolePannel">
          <el-row>
            <el-col :span="10">
              <div class="roleBlock">
                <div class="headerRole">
                    角色信息
                </div>
                <div class="roleBox">
                  <el-form inline label-width="100px" label-position="left" :data="roleInfo">
                    <el-row>
                      <el-form-item label="角色名称:">
                      <span>{{roleInfo.roleName?roleInfo.roleName:"暂无信息"}}</span>
                      </el-form-item>
                    </el-row>
                      <el-row>
                        <el-form-item label="适用机构号:">
                        <span>{{roleInfo.branchNo?roleInfo.branchNo:"暂无信息"}}</span>
                        </el-form-item>
                    </el-row>
                      <el-row>
                        <el-form-item label="适用机构名称:">
                        <span>{{roleInfo.branchName?roleInfo.branchName:"暂无信息"}}</span>
                        </el-form-item>
                    </el-row>
                      <el-row>
                        <el-form-item label="状态:">
                        <span>{{roleInfo.roleState?roleInfo.roleState:"暂无信息"}}</span>
                        </el-form-item>
                    </el-row>
                  </el-form>
                </div>
                <el-button style="margin-left:10px" type="primary" size="mini" :disabled="isDisabledDel" @click="dialogOptionsUpdate.isShow=true;"  v-if="btnPermission('Button_Role_Edit')">修改角色信息</el-button>
              </div>  
            </el-col>
            <el-col :span="14">
              <div class="roleBlock">
                <div class="headerRole">
                    角色权限
                </div>
                <div class="roleBox">
                  <el-scrollbar style="height:100%">
                    <el-tree
                    :data="roleList"
                    default-expand-all
                    node-key="perssionId"
                    ref="tree"
                    highlight-current
                      :props='{children: "perssionChild",label: "perssionName"}'
                    >
                    </el-tree>
                    </el-scrollbar> 
                </div>
                <el-button style="margin-left:10px" type="primary" size="mini" :disabled="isDisabledDel" @click="openRoleRelative"  v-if="btnPermission('Button_Role_EditAuth')">修改角色权限</el-button>
              </div> 
            </el-col>
          </el-row>
          <!-- <div class="userBlock">
            <div class="headerRole">
                用户列表
            </div>
            <div class="userList">
              <el-tag size="mini" v-for="item in userList"  @close="handleClose(item)" :key="item.id" >{{item.name}}</el-tag>
            </div>
            <el-button type="primary" size="mini" style="margin-left:10px">修改角色用户列表</el-button>
            </div>  -->
        </el-card>
          <!-- </el-card> -->
      </el-col>
    </el-row>
      <!-- 弹窗 -->
    <keep-alive>  
      <component :is='dialogList.roleRelative' :optionRelative='dialogOptionsRelative'  @refreshTable="queryUser"></component>
    </keep-alive>
    <keep-alive>
      <component :is='dialogList.updateRole' :option='dialogOptionsUpdate'  @refreshTable="queryUser"></component>
    </keep-alive>
    <keep-alive>
      <component :is='dialogList.createRole' :option='dialogOptionsAdd' @refreshTable="queryUser"></component>      
    </keep-alive>
  </div>
</template>
<script>
import request from "@/utils/request";
import Inquirerole from "@/message/userManage/role/role-info-query";
import getGlobalParams from "@/utils/getGlobalParams";
import roleRelative from "./dialog/roleRelative";
import createRole from "./dialog/createRole";
import updateRole from "./dialog/updateRole";
import delRole from "@/message/userManage/role/del-role";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
export default {
  name: "user-info-manage",
  data() {
    return {
      roleNameV: [],//V端角色列表
      roleNameC: [],//C端角色列表
      roleList: [],//当前角色所拥有得权限
      selRole: "",//当前选中得角色
      roleInfo: [],//当前角色的详细信息
      // userList: [],
      // systemProps:{
      //   value:"perssionId",
      //   children: "programList",
      //   label: "perssionName"
      // },
      form: {
        roleName: "",
        branchIdList: []
      },
      loading: false,
      dialogList: { roleRelative, createRole, updateRole },
      dialogOptionsAdd: { isShow: false, active: 0, aumsSystem: "" },
      dialogOptionsUpdate: { isShow: false, currentRowList: [] },
      dialogOptionsRelative: {
        isShow: false,
        roleList: [],
        currentRowList: [],
        selectItem: [],
        selParent: []
      },
      isDisabledDel: true//控制按钮是否可用
    };
  },
  created() {
    this.$nextTick(()=>{
      this.queryUser();
    })
  },
  methods: {
    queryUser() {//查询列表
      this.selRole = "";
      this.isDisabledDel = true;
      this.roleNameC = Object.assign([]);
      this.roleNameV = Object.assign([]);
      this.roleInfo = [];
      this.roleList = [];
      this.loading = true;
      let resBody1 = new Inquirerole();
      resBody1.data.roleName = "";
      resBody1.data.branchIdList = "";
      resBody1.QueryPageNo = 1;
      resBody1.QueryRowNum = getGlobalParams.get("PageSize");
      request(resBody1)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            let list = Object.assign([],response.RSP_BODY.roleInfoList);
            for (let i = 0; i < list.length; i++) {
              //  list[i].roleSystem=="001"? list[i].roleSystem="C端":list[i].roleSystem="V端"
              list[i].roleState == "0"
                ? (list[i].roleState = "失效")
                : list[i].roleState == "1"
                  ? (list[i].roleState = "正常")
                  : (list[i].roleState = "锁定");
              if (list[i].roleSystem == "001") {
                // list[i].roleSystem = "C端";
                this.roleNameC.push(list[i]);
              } else {
                // list[i].roleSystem = "V端";
                this.roleNameV.push(list[i]);
              }
            }
          }else{
            this.loading=false;
          }
        })
        .catch(error => {
          this.loading=false;          
          console.log(error);
        });
    },
    // handleClose(tag) {
    //   // this.userList.splice(this.userList.indexOf(tag), 1);
    // },
    roleChange(val) {//获取当前角色的信息
      this.isDisabledDel = false;
      this.roleInfo = val;
      this.roleList = val.rolePerssionTree ? val.rolePerssionTree : [];
      this.dialogOptionsRelative.selectItem = [];
      this.dialogOptionsRelative.currentRowList = Object.assign({}, val);
      this.dialogOptionsUpdate.currentRowList = Object.assign({}, val);
      if (val.rolePerssionTree) {
        for (let i = 0; i < val.rolePerssionTree.length; i++) {
          //枚举状态
          this.dialogOptionsRelative.selectItem.push(
            val.rolePerssionTree[i].perssionId
          );
          if (val.rolePerssionTree[i].perssionChild) {
            for (
              let j = 0;
              j < val.rolePerssionTree[i].perssionChild.length;
              j++
            ) {
              this.dialogOptionsRelative.selectItem.push(
                val.rolePerssionTree[i].perssionChild[j].perssionId
              );
            }
          }
        }
      }
      this.dialogOptionsUpdate.currentRowList.roleState == "失效"
        ? (this.dialogOptionsUpdate.currentRowList.roleState = "0")
        : this.dialogOptionsUpdate.currentRowList.roleState == "正常"
          ? (this.dialogOptionsUpdate.currentRowList.roleState = "1")
          : (this.dialogOptionsUpdate.currentRowList.roleState = "2");
      this.dialogOptionsUpdate.currentRowList.childuseable == "1"
        ? (this.dialogOptionsUpdate.currentRowList.childuseable = true)
        : (this.dialogOptionsUpdate.currentRowList.childuseable = false);
    },
    openRoleRelative() {//权限列表
      this.dialogOptionsRelative.isShow = true;
    },
    // checkUserList() {   //查询角色列表
    //   this.selRole=""
    //   this.isDisabledDel=true
    //   this.roleNameC = [];
    //   this.roleNameV = [];
    //   this.roleInfo=[]
    //   this.roleList=[]
    //   this.loading = true;
    //   let resBody = new Inquirerole();
    //   resBody.data.roleName = this.form.roleName;
    //   resBody.data.branchIdList = this.form.branchIdList;
    //   resBody.QueryPageNo = 1;
    //   resBody.QueryRowNum = getGlobalParams.get("PageNum");
    //   request(resBody)
    //     .then(response => {
    //       this.loading = false;
    //       let list = response.RSP_BODY.roleInfoList;
    //       for (let i = 0; i < list.length; i++) {
    //          list[i].roleSystem=="001"? list[i].roleSystem="C端":list[i].roleSystem="V端"
    //         list[i].roleState == "0"
    //           ? (list[i].roleState = "失效")
    //           : list[i].roleState == "1"
    //             ? (list[i].roleState = "正常")
    //             : (list[i].roleState = "锁定");
    //         if (list[i].roleSystem == "001") {
    //           list[i].roleSystem = "C端";
    //           this.roleNameC.push(list[i]);
    //         } else {
    //           list[i].roleSystem = "V端";
    //           this.roleNameV.push(list[i]);
    //         }
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    delRoleClick() {//删除弹出
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRole();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delRole() { //删除角色
      this.loading=true;
      let resBody = new delRole();
      resBody.data.roleId = this.selRole;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading=false;            
            this.$message({
              type: "success",
              message: "角色删除成功!"
            });
            this.queryUser();
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
    }
  }
};
</script>


<style lang="scss"  scoped>
.headerRole {
  padding: 10px 10px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}
.roleBox {
  height: 555px;
  overflow-y: auto;
  padding: 10px;
}
.roleBox::-webkit-scrollbar {
  display: none;
}
.userBlock {
  margin-top: 10px;
  border: 1px solid #eee;
  box-sizing: border-box;
  height: 210px;
  box-sizing: border-box;
}
.userList {
  height: 117px;
  padding: 10px;
  .el-tag {
    margin: 10px;
  }
}
.rolePannel{
  height:678px;
}
.contentRole {
  width: 95%;
  height: 518px;
  border: 1px solid #eee;
  border-radius: 3px;
  margin: 10px 0;
  overflow-y: auto;
}
.contentRole::-webkit-scrollbar {
  display: none;
}
.el-radio-group {
  padding: 10px;
}
.el-radio:first-child {
  margin-left: 10px;
}
.el-radio {
  display: inline-block;
  margin: 5px;
  width: 130px;
}
.roleBlock {
  border: 1px solid #eee;
  margin-right: 10px;
  border-radius: 3px;
  height: 638px;
  /* overflow: auto; */
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.el-card {
  margin-bottom: 10px;
  width: 100%;
}
.el-form-item {
  margin-left: 30px;
}
.el-form-item1 {
  margin-left: 10px;
}
.box2-button1 {
  width: 130px;
}
.block {
  width: 30%;
  text-align: center;
}
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
.el-dialog__body {
  padding: 20px;
}
</style>
