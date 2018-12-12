<template>
  <div>
    <el-dialog title="新增用户"  @close="closeUser" :visible.sync="isShow" width="890px"  @open="openCreate"
     :close-on-click-modal="false" center  >
      <div v-loading="loading">
      <el-steps :active="active"
              finish-status="success"
              align-center>
        <el-step title="新建用户信息"></el-step>
        <el-step title="用户所属系统管理"></el-step>
        <el-step title="用户角色绑定"></el-step>
      </el-steps>
      <div class="content" v-if="active === 0">
        <el-card style="margin-top:10px">
        <el-form size="mini" ref="newUserDate" :model="newUserDate" :rules="rules" inline label-width="120px" label-position="left">
          <el-row :gutter="10">
            <el-col :span="12">
                <el-form-item prop="branchId" label="所属机构:" >
                <select-tree :single-check="true" v-model="newUserDate.branchId" style="min-width:170px;"
                :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno" :node-key="'branchId'" ></select-tree>
                </el-form-item> 
            </el-col>
            <el-col :span="8" >
              <el-form-item prop="childBranchUseFlag" label="可否管理子机构:">
               <el-switch v-model="newUserDate.childBranchUseFlag"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10"> 
            <el-col :span="12" > 
              <el-form-item prop="userName" label="用户名称:">
                  <el-input v-model="newUserDate.userName"
                          placeholder="请输入用户名称"></el-input>
              </el-form-item>
            </el-col>
             <el-col  :span="12">
              <el-form-item prop="jobNumber" label="工号:">                  
                <el-input v-model="newUserDate.jobNumber"
                        placeholder="请输入工号"></el-input>                  
              </el-form-item>     
            </el-col> 
          </el-row>
          <el-row :gutter="10">
            <el-col  :span="12">
              <el-form-item prop="tellerNo" label="柜员号:">
                <el-input v-model="newUserDate.tellerNo"
                        placeholder="请输入柜员号"></el-input>                
              </el-form-item>
            </el-col>
            <el-col   :span="12">
            <el-form-item prop="emailAddress" label="邮箱:">
              <el-input v-model="newUserDate.emailAddress"
                      placeholder="请输入邮箱"></el-input>              
            </el-form-item>
          </el-col>
          </el-row>
          <el-row :gutter="10">
          <el-col   :span="12">
            <el-form-item prop="telephone" label="手机号:">
                <el-input v-model="newUserDate.telephone"
                          placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item prop="remark" label="备注:">
                  <el-input v-model="newUserDate.remark"  placeholder="备注"></el-input>
              </el-form-item> 
            </el-col>
          </el-row>
         
        </el-form>
        </el-card>
        <div style="text-align:center;margin-top:20px"> 
            <el-button type="primary"  size="mini" @click="addUser">确认</el-button>
        </div>
      </div>
      <div class="content"  v-if="active === 1">
        <keep-alive>
          <component :is='dialogList.systemMaintence' :option='dialogOptions' @systemEmit="systemEmit" @systemClose="userClose"></component>
        </keep-alive>
      </div>
      <div class="content"
          v-if="active === 2">
          <keep-alive>
              <component :is='dialogList.userRole' :option='dialogOptionsUserRole' @systemClose="userClose"></component>
          </keep-alive>
      </div>
     </div>
    </el-dialog>
  </div>
</template>
<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import systemMaintence from "./systemMaintence1";
import userRole from "./userRole";
import createUser from "@/message/userManage/user/user-create";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "create-user",
  data() {
    let validatorPhone = (rule, value, callback) => {//校验手机号
      if (value != "") {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      } else {
        callback();
      }
    };
    let validatorEmail = (rule, value, callback) => {//校验邮箱
      if (value != "") {
        let reg = new RegExp(
          "^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$"
        );
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱"));
        }
      } else {
        callback();
      }
    };
    return {
      loading: false,
      brno: [],
      active: 0,
      newUserDate: {//表单信息
        userID: "",
        userName: "",
        branchId: [],
        remark: "",
        tellerNo: "",
        jobNumber: "",
        telephone: "",
        emailAddress: "",
        childBranchUseFlag: false
      },
      startDialogVisible: false,
      dialogList: { systemMaintence, userRole },
      dialogOptions: { isShow: false, isClick: false, UserID: "" },
      dialogOptionsUserRole: { isShow: false, userId: "" },
      rules: {//校验对象
        // userID: [
        //   { required: true, message: "请输入用户编号", trigger: "blur" }
        // ],
        branchId: [
          { required: true, message: "请选择机构号", trigger: "change" }
        ],
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { max: 200, message: "用户名称长度少于200个字符", trigger: "blur" }
        ],
        // remark: [{ max:10, message: "请输入少于120位字符", trigger: "blur" }],
        telephone: [
          { message: "手机号长度少于20个字符", max: 20, trigger: "blur" },
          { require: false, validator: validatorPhone, trigger: "blur" }
        ],
        emailAddress: [
          { max: 20, message: "邮箱长度少于20个字符", trigger: "blur" },
          { require: false, validator: validatorEmail, trigger: "blur" }
        ],
        jobNumber: [
          { required: true, message: "请输入工号", trigger: "blur" },
          {
            max: 20,
            message: "请输入正确工号，长度少于20个字符",
            trigger: "blur"
          }
        ],
        tellerNo: [
          { required: true, message: "请输入柜员号", trigger: "blur" },
          {
            max: 20,
            message: "请输入正确柜员号，长度少于20个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {//父元素传递的数据
    option: Object
  },
  components: { selectTree },
  computed: {
    isShow: {//创建用户弹窗是否显示
      get: function() {
        return this.option.isShow;
      },
      set: function(newValue) {
        this.option.isShow = newValue;
      }
    }
  },

  methods: {
    initList() {//初始化下拉列表
      this.loading=true;
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.loading=false;
          this.brno = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          this.loading=false
          console.error("错误信息", error);
        });
    },
    openCreate() {//打开弹窗事件
      this.active = 0;//设置弹窗显示的标签页为第一个
      this.initList();
      if (this.$refs.newUserDate) {
        this.$refs["newUserDate"].clearValidate(); //清楚表单验证
      }
    },
    userClose() {//设置用户所属系统或关联角色点取消按钮关闭创建用户弹窗
      this.isShow = false;
    },
    systemEmit() {//创建用户时为用户关联所属系统后跳到下一标签页
      this.active++;
      this.dialogOptionsUserRole.isShow = true;
    },
    closeUser() {//关闭弹窗清楚表单数据并清楚表单验证
      if (this.$refs["newUserDate"] != undefined) {
        this.$refs["newUserDate"].resetFields(); //清楚表单验证
        this.$refs["newUserDate"].clearValidate(); //清楚表单验证
      }
      this.$emit("refreshTable");
    },
    addUser() {//添加用户
      this.$refs["newUserDate"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.dialogOptions.isShow = true;
          let resBody = new createUser();
          resBody.data.userName = this.newUserDate.userName;
          resBody.data.branchId = this.newUserDate.branchId[0];
          resBody.data.remark = this.newUserDate.remark;
          resBody.data.tellerNo = this.newUserDate.tellerNo;
          resBody.data.jobNumber = this.newUserDate.jobNumber;
          resBody.data.telephone = this.newUserDate.telephone;
          resBody.data.emailAddress = this.newUserDate.emailAddress;
          resBody.data.childBranchUseFlag = this.newUserDate.childBranchUseFlag
            ? 1
            : 0;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.dialogOptions.isShow = true;
                this.dialogOptions.userId = response.REQ_BODY.userId;
                this.dialogOptionsUserRole.userId = response.REQ_BODY.userId;
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "用户创建成功!"
                });
                this.$confirm(
                  "请问是否继续维护用户的系统，角色设置？",
                  "提示",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }
                )
                  .then(() => {
                    this.sureStep();
                  })
                  .catch(() => {
                    this.isShow = false;
                    this.$refs["newUserDate"].clearValidate(); //清楚表单验证
                    this.$refs["newUserDate"].resetFields(); //清楚表单验证
                  });
              } else {
                this.$message({
                  type: "warning",
                  message: "用户创建失败!"
                });
                this.loading = false;
              }
            })
            .catch(error => {
              this.loading = false;
            });
        } else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      });
    },
    sureStep() {//添加用户后并且设置用户所属系统
      this.startDialogVisible = false;
      this.active++;
      this.$refs.newUserDate.clearValidate();
      this.$refs.newUserDate.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
}
// .footer {
//   width: 100%;

//   margin-top: 10px;
// }
.require {
  color: red;
}
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
.role {
  width: 95%;
  border: 1px solid #eee;
  border-radius: 4px;
  height: 290px;
  .roleHeader {
    color: #606266;
    font-weight: 500;
    font-size: 14px;
    background: #f5f7fa;
    height: 42px;
    box-sizing: border-box;
    padding: 9px;
    overflow-y: auto;
  }
}
.el-card {
  overflow: inherit;
}
</style>


 