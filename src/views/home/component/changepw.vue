<template>
  <div>
    <el-dialog title="修改密码" :visible.sync="isShow"
    :lock-scroll=false
    :close-on-click-modal=false
    :close-on-press-escape=false
    :show-close=false
    @close="closeCallback('ruleForm')"
    width="500px">
      <el-card>
        <el-form :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldpass">
            <el-input :type="pwdTypeList.oldpass" v-model.number="ruleForm.oldpass" auto-complete="off" placeholder="请输入原密码"></el-input>
            <span class="show-pwd" @click="showPwd0()">
              <svg-icon :icon-class="pwdTypeList.oldpass=='password'?'eye-close':'eye'" />
            </span>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
            <el-input :type="pwdTypeList.pass" v-model="ruleForm.pass" auto-complete="off" placeholder="请输入新密码"></el-input>
            <span class="show-pwd" @click="showPwd1()">
              <svg-icon :icon-class="pwdTypeList.pass=='password'?'eye-close':'eye'" />
            </span>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
            <el-input :type="pwdTypeList.checkPass" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请再次输入新密码"></el-input>
            <span class="show-pwd" @click="showPwd2()">
              <svg-icon :icon-class="pwdTypeList.checkPass=='password'?'eye-close':'eye'" />
            </span>
        </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button size="mini" @click="isShow = false">取 消</el-button> -->
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
import changepd from "@/message/shared/changepd";

export default {
  props: { option: Object },
  data() {
    var checkoldpass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("pass");
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else if (value === this.ruleForm.oldpass) {
        callback(new Error("新密码不能和旧密码相同"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldpass: ""
      },
      pwdTypeList: {
        pass: "password",
        checkPass: "password",
        oldpass: "password"
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldpass: [{ validator: checkoldpass, trigger: "blur" }]
      }
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newVlaue) {
        this.option.isShow = newVlaue;
      }
    }
  },
  mounted(){
  },
  methods: {
    showPwd0() {
      if (this.pwdTypeList.oldpass === "password") {
        this.pwdTypeList.oldpass = "";
      } else {
        this.pwdTypeList.oldpass = "password";
      }
    },
    showPwd1() {
      if (this.pwdTypeList.pass === "password") {
        this.pwdTypeList.pass = "";
      } else {
        this.pwdTypeList.pass = "password";
      }
    },
    showPwd2() {
      if (this.pwdTypeList.checkPass === "password") {
        this.pwdTypeList.checkPass = "";
      } else {
        this.pwdTypeList.checkPass = "password";
      }
    },
    closeCallback(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
        this.$refs[formName].resetFields();
      });
      this.pwdTypeList = {
        pass: "password",
        checkPass: "password",
        oldpass: "password"
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let resBody = new changepd();
          resBody.data.userId = this.$store.getters.userId;
          resBody.data.oldPassword = this.ruleForm.oldpass+"";
          resBody.data.newPassword = this.ruleForm.pass;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.isShow = false;
                this.$message({
                  message: "密码更改成功,请重新登录,2秒后自动跳转",
                  type: "success"
                });
                setTimeout(() => {
                   this.$store.dispatch("FedLogOut").then(() => {
                      location.reload(); // 为了重新实例化vue-router对象 避免bug
                    });
                }, 2000);
               
              } else {
                console.log(response);
              }
            })
            .catch(error => {
              console.log("error", error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// .el-cascader {
//   width: 338px;
// } 
.show-pwd {
  position: absolute;
  right: 28px;
  top: 1px;
}
</style>
