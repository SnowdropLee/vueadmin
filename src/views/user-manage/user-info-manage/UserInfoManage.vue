<template>
  <div v-loading="loading"  element-loading-text="加载中。。。">
    <el-card style="overflow:visible;">
      <el-form :model="form"  size="mini" label-position="top" ref="form">
        <el-row :gutter="10">
            <el-col  :lg="4" :md="6">
              <el-form-item label="用户编号"  prop="ID" >
                <el-input v-model="form.ID" placeholder="请输入用户编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col   :lg="4" :md="6">
              <el-form-item label="用户名称" prop="name">
                <el-input v-model="form.name"
                  placeholder="请输入用户名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :lg="4" :md="6">
                <el-form-item label="机构"  prop="branchId">
                  <select-tree v-model="checkedIds" 
                    :props='{id: "branchId",label: "branchName",children: "childBranch"}' :tree-data="brnoList" :node-key="'branchId'" ></select-tree>
                </el-form-item>
            </el-col>
            <el-col :lg='2' :md='3' class="searchBtnMarginTop">
                <el-button type="primary" icon='el-icon-search'
                  @click="checkUserList"
                  :loading="loading" size='mini'>查询</el-button>
            </el-col>
            <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
              <el-button type='warning' size='mini' icon='el-icon-refresh'
              @click="resetForm('form')">重置</el-button>
            </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top:10px;">
      <el-row :gutter="10">
        <el-col  :lg="2" :md="3" v-if="btnPermission('Button_User_Add')">
          <el-button type="primary" size="mini"  @click="createUser" icon='el-icon-plus'
          >新增</el-button>
        </el-col>
        <el-col  :lg="2" :md="3"  v-if="btnPermission('Button_User_Edit')">
          <el-button type="primary"
            size="mini" icon='el-icon-edit' @click="modUser" :disabled="!checkedUser"
            >修改</el-button>
        </el-col>
        <el-col :lg="2" :md="3" v-if="btnPermission('Button_User_Delete')">
          <el-button type="danger"
            size="mini" @click="delUser" icon='el-icon-delete'  :disabled="!checkedUser"
          >删除</el-button>
        </el-col>
          <el-col  :lg="2" :md="3" >
            <el-dropdown trigger="click"  @command="handleCommand" >
              <el-button type="primary" size="mini" :disabled="!checkedUser">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">                  
                <el-dropdown-item command="systemUser" v-if="btnPermission('Button_User_Branch')">所属系统</el-dropdown-item>
                <el-dropdown-item command="roleMaintenance" v-if="btnPermission('Button_User_Role')">角色维护</el-dropdown-item>
                <!-- 暂时注释掉没有后台服务的按钮 <el-dropdown-item command="unlock" v-if="btnPermission('Button_User_Unlock')">解锁</el-dropdown-item>   -->
                <el-dropdown-item @click.native="handleResetPassword" v-if="!btnPermission('Button_User_ResetPwd')">重置密码</el-dropdown-item>
                <!-- <el-dropdown-item command="detailDev" v-if="btnPermission('Button_User_Detail')">详细信息</el-dropdown-item>
                <el-dropdown-item command="startDialogVisible" v-if="btnPermission('Button_User_CHistory')">自助C端操作记录查看</el-dropdown-item>
                <el-dropdown-item command="devRemove" v-if="btnPermission('Button_User_VHistory')">自助V端操作记录查看</el-dropdown-item>                     -->
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
      </el-row>
      <el-table :data="tableDataPage" ref="table" border class="tableMarginTop"
        highlight-current-row
        @selection-change="handleCurrentChange"
        header-row-class-name="tableHeaderClass"
        style="min-height:390px;">
        <el-table-column type="selection" width="40px"></el-table-column>
        <el-table-column prop="UserID" label="用户编号">
          <template slot-scope="scope">
              {{scope.row.userNo}}
          </template>
        </el-table-column>
        <el-table-column prop="UserName" label="用户名称"></el-table-column>
        <el-table-column prop="UserState"  :formatter="dataFormat" label="状态"></el-table-column>
        <el-table-column prop="BranchNo" label="所在机构号"></el-table-column>
        <el-table-column prop="BranchName" label="所在机构名称"></el-table-column> 
        <el-table-column prop="Telephone"  label="手机"></el-table-column>
        <el-table-column prop="EmailAdress" label="邮箱"></el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:20px;" v-show="this.tableData">
        <el-pagination  :current-page="currentPage" background
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.length"
          @current-change="changePage">
        </el-pagination>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <keep-alive>
      <component :is="dialogList.CreateUser" :option="dialogOptions" @refreshTable="checkUserList"></component>
    </keep-alive>
     <keep-alive>
      <component :is="dialogList.systemMaintenceDialog" :option="dialogOptionsSystem"   @systemEmit="checkUserList"></component>
    </keep-alive> 
     <keep-alive>
      <component :is="dialogList.userRoleDialog" :option="dialogOptionsUserRole" ></component>
    </keep-alive> 
    <keep-alive>
      <component :is="dialogList.updateUser" :optionUpdate="dialogOptionsupdateUser"  @refreshTable="checkUserList"></component>
    </keep-alive> 
  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import CreateUser from "./dialog/CreateUser";
import updateUser from "./dialog/updateUser";
import systemMaintenceDialog from "./dialog/systemMaintenceDialog";
import userRoleDialog from "./dialog/userRoleDialog";
import InquireUser from "@/message/userManage/user/inquire-user";
import userDel from "@/message/userManage/user/user-del";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import resetPassword from "@/message/userManage/user/reset-password";

export default {
  name: "user-info-manage",
  components: { selectTree },
  data() {
    return {
      userState: {},//用户状态
      pageSize: undefined,//表格每页的条数
      brnoList: [],//机构下拉列表数据
      checkedIds: [],//机构下拉框V-model数据
      form: {//表单数据
        ID: "",
        name: "",
        organization: "",
        branchId: []
      },
      currentRow: [],//表格当前选中行
      currentPage: 1,//表格当前页
      tableData: [],//表格 数据
      dialogList: {//指定被渲染组件列表
        CreateUser,
        systemMaintenceDialog,
        userRoleDialog,
        updateUser
      },
      dialogOptions: {//创建用户
        isShow: false
      },
      dialogOptionsSystem: {//用户所属系统
        isShow: false,
        system: [],
        userId: "",
        clearRow: false
      },
      dialogOptionsUserRole: {//用户关联角色
        isShow: false,
        roleIdList: [],
        systemIdList: [],
        userId: ""
      },
      dialogOptionsupdateUser: { isShow: false, currentRow: [] },//修改用户
      loading: false,//loading遮罩
      total: 0,//表格总条数
      startDialogVisible: false,
      checkedUser: false,//控制按钮是否可用
      isDisabledDel: false
    };
  },
  computed: {
    tableDataPage() {//实现前端分页
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    }
  },
  created() {//初始化下拉框
    this.userState = getGlobalParams.get("userState"); //用户状态初始化
    this.checkUserList();
    let resBody = new devRunList();
    resBody.data.spinnerList = [{ spinnerName: "branch" }];
    request(resBody)
      .then(response => {
        this.brnoList = response.RSP_BODY.branchSpinner;
      })
      .catch(error => {
        console.error("错误信息", error);
      });
    this.pageSize = getGlobalParams.get("PageSize");
  },
  methods: {
    changePage(val) {//表格换页改变currengPage的值
      this.currentPage = val;
    },
    delUser() {//删除弹出
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.userDel();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    dataFormat(row, column) {//格式化表格
      //枚举设备形式
      return this.userState[row[column.property]];
    },
    resetForm(formName) {//重置查询表单
      this.$refs["" + formName].resetFields();
      this.checkedIds = [];
    },
    handleCommand(val) {//更多操作按钮的切换
      if (val == "systemUser") {
        this.systemUser();
      } else if (val == "roleMaintenance") {
        this.roleMaintenance();
      }
    },
    createUser() {//改变创建用户的显示状态
      this.dialogOptions.isShow = true;
    },
    systemUser() {//设置打开用户系统页面所需的一些数据
      this.dialogOptionsSystem.isShow = true;
      this.dialogOptionsSystem.system = Object.assign(
        [],
        this.currentRow.systemIdList
      );
      this.dialogOptionsSystem.userId = this.currentRow.UserID;
      this.dialogOptionsSystem.clearRow = true;
    },
    modUser() {//修改用户
      this.dialogOptionsupdateUser.isShow = true;
      this.dialogOptionsupdateUser.currentRow = this.currentRow;
    },
    userDel() {      //删除用户
      this.loading = true;
      let resBody = new userDel();
      resBody.data.userId = this.currentRow.UserID;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: "用户删除成功!"
            });
            this.checkUserList();
          } else {
            this.loading = false;
            this.$message({
              type: "success",
              message: "用户删除失败!"
            });
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    roleMaintenance() {//设置打开用户关联角色页面所需的一些数据
      this.dialogOptionsUserRole.isShow = true;
      this.dialogOptionsUserRole.roleIdList = Object.assign(
        [],
        this.currentRow.roleIdList
      );
      this.dialogOptionsUserRole.systemIdList = Object.assign(
        [],
        this.currentRow.systemIdList
      );
      this.dialogOptionsUserRole.userId = this.currentRow.UserID;
    },
    checkUserList() {//查询用户表格
      this.tableData = [];
      this.checkedUser = false;
      this.isDisabledDel = false;
      this.loading = true;
      let resBody = new InquireUser();
      resBody.data.userNo = this.form.ID;
      resBody.data.UserName = this.form.name;
      resBody.data.branchIdList = this.checkedIds;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            //  console.log(response.RSP_BODY.UserList,"response.RSP_BODY.UserList")
            this.loading = false;
            // this.tableData = response.RSP_BODY.UserList;
            response.RSP_BODY.UserList.forEach(element => {
              if (element.UserID != "admin") {
                this.tableData.push(element);
              }
            });
          }
          // let list=response.RSP_BODY.roleInfoList
          // for(let i=0;i<list.length;i++){
          //    list[i].UserState=="0"? list[i].UserState="失效":(list[i].UserState=="1"?list[i].UserState="正常":list[i].UserState="锁定")
          // }
          // this.tableData =list;
        })
        .catch(error => {
          this.loading = false;
          // this.logger.log("fail", error);
        });
    },
    handleCurrentChange(val) {//表格选中行改变事件设置当前行的值（currentRow）已经改变控制按钮是否可用
      this.currentRow = val[0];
      if (val.length == 1) {
        this.checkedUser = true;
        this.isDisabledDel = true;
      } else if (val.length > 1) {
        this.checkedUser = false;
        this.isDisabledDel = true;
      } else {
        this.checkedUser = false;
        this.isDisabledDel = false;
      }
    },

    /**
     * @desc 手动重置密码
     */
    handleResetPassword() {
      this.$confirm("此操作将重置此用户密码为‘123456’, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.resetPassword();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    },

    /**
     * @desc 重置密码通讯方法
     * @param userId
     */
    resetPassword() {
      this.loading = true;
      let resBody = new resetPassword();
      resBody.data.userId = this.currentRow.UserID;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: "密码重置成功"
            });
          } else {
            this.loading = false;
            this.$message({
              type: "success",
              message: "密码重置失败"
            });
          }
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>


<style lang="scss" scoped>
.selectTree {
  min-width: 150px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
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
  width: 100%;
}
.el-form-item {
  margin-left: 30px;
}
.el-form-item1 {
  margin-left: 10px;
}
.box2-button {
  width: 80px;
}

.el-card {
  overflow: inherit;
}
</style>