<template>
  <div>
    <el-dialog title="修改用户"  :visible.sync="isShow" width="800px"
      :close-on-click-modal="false"  
      @close="closeUserMod"
      @open="openUpdate"
      >
      <div  v-loading="loading">
        <el-card>
          <el-form size="mini" ref="newUserDate" :model="newUserDate" :rules="rules" inline label-width="120px" label-position="left">
            <el-row >
              <el-col :span="12">
                <el-form-item prop="userNo" label="用户编号:">
                  <el-input v-model="newUserDate.userNo"  :disabled="checkId"
                          placeholder="请输入用户编号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" >
                  <el-form-item prop="branchId" label="所属机构：">
                      <select-tree  :single-check="true"  v-model="newUserDate.branchId" style="min-width:170px;"
                  :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno" :node-key="'branchId'" ></select-tree>
                  </el-form-item>
              </el-col>
              <!-- <el-col :span="8" :offset="3">
                  <el-checkbox v-model="checkId">创建用户后系统生成</el-checkbox>
              </el-col> -->
              
              <el-col :span="12">
                  <el-form-item prop="childBranchUseFlag" label="可否管理子机构:">
                  <el-switch v-model="newUserDate.childBranchUseFlag"></el-switch>
                </el-form-item>
                <!-- <el-checkbox v-model="newUserDate.childBranchUseFlag">子机构是否可见</el-checkbox> -->
              </el-col>
            </el-row>
            <el-row :gutter="10"> 
              <el-col  :span="12"> 
                <el-form-item prop="UserName" label="用户名称:" >
                    <el-input v-model="newUserDate.UserName"
                            placeholder="请输入用户名称"></el-input>
                </el-form-item>
              </el-col>
                <el-col  :span="12">
                <el-form-item prop="jobNumber" label="工号：">                  
                  <el-input v-model="newUserDate.jobNumber"
                          placeholder="请输入工号"></el-input>                  
                </el-form-item>     
              </el-col> 
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item prop="tellerNo" label="柜员号：">
                  <el-input v-model="newUserDate.tellerNo"
                          placeholder="请输入柜员号"></el-input>                
                </el-form-item>
              </el-col>
              <el-col  :span="12">
                <el-form-item prop="EmailAdress" label="邮箱:">
                <el-input v-model="newUserDate.EmailAdress"
                        placeholder="请输入邮箱"></el-input>              
              </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col  :span="12">
                <el-form-item prop="Telephone" label="手机号:">
                    <el-input v-model="newUserDate.Telephone"
                              placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col  :span="12">
                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="newUserDate.remark"  placeholder="备注"></el-input>
                </el-form-item> 
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <div style="text-align:right;margin:20px 0">
            <el-button  size="mini"
                    @click="cancleUserMod">取消</el-button>
            <el-button type="primary" @click="userMod" size="mini">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>  
</template>

<script>
import selectTree from "@/components/selectTree2/index";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import request from "@/utils/request";
import modUser from "@/message/userManage/user/user-update";
export default {
  name: "create-user",
  data() {
    //表单自定义校验
    let validatorPhone = (rule, value, callback) => {
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
    let validatorEmail = (rule, value, callback) => {
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
      loading:false,
      brno: [],//机构下拉框
      checkId: true,//控制用户编号是否输入
      newUserDate: {//修改用户表单数据
        UserID: "",
        UserName: "",
        branchId: [],
        remark: "",
        tellerNo: "",
        jobNumber: "",
        telephone: "",
        EmailAdress: "",
        childBranchUseFlag: false
      },
      rules: {//表单校验规则
        branchId: [
          { required: true, message: "请选择机构号", trigger: "change" }
        ],
        UserName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { max: 200, message: "用户名称长度少于200个字符", trigger: "blur" }
        ],
        // remark: [{ max:10, message: "请输入少于120位字符", trigger: "blur" }],
        Telephone: [
          { message: "手机号长度少于20个字符", max: 20, trigger: "blur" },
          { require: false, validator: validatorPhone, trigger: "blur" }
        ],
        EmailAdress: [
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
    optionUpdate: Object
  },
  components: { selectTree },
  computed: {
    isShow: {//修改用户弹窗是否显示
      get: function() {
        return this.optionUpdate.isShow;
      },
      set: function(newValue) {
        this.optionUpdate.isShow = newValue;
      }
    },
  },
  methods: {
    initList(){//初始化下拉框函数
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brno = response.RSP_BODY.branchSpinner;
          // this.newUserDate.branchId[0] = this.optionUpdate.currentRow.branchId; //回显机构号
        })
        .catch(error => {
          console.error("错误信息", error);
        });
    },
    openUpdate() {//打开弹窗事件
      this.initList()//初始化下拉框
      for(var key in this.optionUpdate.currentRow){//回显数据
        if (key=="branchId") {
          this.newUserDate[key]=[this.optionUpdate.currentRow[key]]
        }else{
          this.newUserDate[key]=this.optionUpdate.currentRow[key]
        }
      }
    },
    cancleUserMod() {//关闭弹窗事件，清楚表单验证
      this.optionUpdate.isShow = false;
      this.$refs.newUserDate.clearValidate();
    },
    closeUserMod() {//修改弹窗关闭
      this.$refs.newUserDate.clearValidate();
    },
    userMod() {//修改用户
      this.$refs["newUserDate"].validate(valid => {
        if (valid) {
          this.$refs.newUserDate.clearValidate();
          this.loading=true;
          let resBody = new modUser();
            resBody.data.userId = this.optionUpdate.currentRow.UserID;
            resBody.data.userName = this.newUserDate.UserName;
            resBody.data.branchId = this.newUserDate.branchId[0];
            resBody.data.remark = this.newUserDate.remark;
            resBody.data.tellerNo = this.newUserDate.tellerNo;
            resBody.data.jobNumber = this.newUserDate.jobNumber;
            resBody.data.telephone = this.newUserDate.Telephone;
            resBody.data.emailAddress = this.newUserDate.EmailAdress;
            resBody.data.childBranchUseFlag = this.newUserDate.childBranchUseFlag;
            request(resBody)
              .then(response => {
                if (response.SYS_HEAD.ReturnCode === "000000") {
                  this.loading=false;                  
                  this.$message({
                    type: "success",
                    message: "用户修改成功!"
                  });
                  this.optionUpdate.isShow = false;
                  this.$emit("refreshTable");//修改用户成功并刷新表格数据
                }else{
                  this.loading=false;                                    
                }
              })
              .catch(error => {
                this.loading=false;                  
              });
        } else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss"  scoped>
.content {
  display: flex;
  flex-direction: column;
}
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

.el-dialog__body {
  padding: 20px;
  padding-top: 10px;
}
.el-card {
  overflow: inherit;
}
</style>