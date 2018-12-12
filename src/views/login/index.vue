<template>
  <div class="login-container">
    <div class="login-logo">
      <div>
        <img class="logo" src="../../../static/logo/headerLogo.png" alt="">
      </div>
      <div style="margin-top:7px">
        <span class="title">统一渠道管理系统</span>
      </div>
    </div>
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" class="login-form">
      <h3 class="title">
        <!-- <img :src="logo" alt="" > -->
        用户登录
      </h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" placeholder="用户/username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input :type="pwdType" v-model="loginForm.password" autoComplete="new-password" placeholder="密码/password"></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType=='password'?'eye-close':'eye'" />
        </span>
      </el-form-item>
      <el-row>
        <el-col :span="17">
          <el-form-item prop="verificationCode">
            <span class="svg-container">
              <svg-icon icon-class="verificationcode"></svg-icon>
            </span>
            <el-input name="verification-code" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.verificationCode" placeholder="验证码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <verification-code @rendom="value=>rendomStr = value"></verification-code>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
    <div class="login-foot">
      <p>友情链接：
        <a href="http://oa.agree.com.cn:6988/oa/">OA办公管理系统</a>
        <a href="http://mail.agree.com.cn/">263云通讯</a>
      </p>
      <p style="font-size: 14px;">Copyright©1993-2018
        <a href="http://www.agree.com.cn">AGREE</a> ALL Right Reserved 版权所有 京ICP备 20000001号</p>
    </div>

  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import VerificationCode from "@/components/VerificationCode";
import logo from "@/assets/image/ztlogo.png";
import agree from "@/assets/image/agree.png";
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length > 20 || value.length == 0) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.toUpperCase() != this.rendomStr.toUpperCase()) {
        callback(new Error("验证码有误！"));
      } else {
        callback();
      }
    };
    return {
      agree,
      logo,
      rendomStr: "",
      loginForm: {
        username: "",
        password: "",
        verificationCode: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        verificationCode: [
          { required: true, trigger: "blur", validator: validateCode }
        ]
      },
      loading: false,
      pwdType: "password"
    };
  },
  components: { VerificationCode },
  mounted() {
    // 方便开发 二维码自动填写
    // this.loginForm.verificationCode=this.rendomStr
  },
  methods: {
    showPwd() {
      this.pwdType = this.pwdType == "password" ? "" : "password";
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(data => {
              if (data.ReturnCode === "000000") {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "登录成功"
                });
                this.$router.push({
                  path: "/home/index",
                  name: "homeIndex",
                  params: {
                    firstLog: this.$store.getters.isFirstLoginFLag,
                    firstLogMessage: data.ReturnMessage
                  }
                });
                // }else{
                //   this.$router.push({ path: "/home/index" });
                // }
              } else {
                // else if (data.ReturnCode==="999999") {
                //   this.loading = false;
                //   this.$message({
                //     type: "info",
                //     message: "此用户不存在"
                //   });
                // }
                // else if (data.ReturnCode==="888888") {
                //   this.loading = false;
                //   this.$message({
                //     type: "info",
                //     message: "用户名或密码错误"
                //   });
                // }
                // console.log(data,"返回异常")
                this.loading = false;
                this.$message({
                  type: "danger",
                  // message: "返回异常"
                  message: data.ReturnMessage
                });
              }
            })
            .catch(error => {
              // console.log(data,"代码异常")

              this.loading = false;
              this.$message({
                type: "info",
                // message: "代码异常"
                message: data.ReturnMessage
              });
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b; //#474d63 2d3a4b
$dark_gray: #889aa4;
// $light_gray: #eee;
$light_gray: #333;

.login-container /deep/ {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  // background: url("../../assets/image/back.png");
  input:-webkit-autofill {
    // box-shadow: 0 0 0px 1000px #293444 inset !important;
    box-shadow: 0 0 0px 1000px #ecf5fa inset !important;
    // -webkit-text-fill-color: #fff !important;
  }
  .el-form {
    // background: $bg;
    background: #ffffff;
    opacity: 0.9;
    border-radius: 3px;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 20px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 20px auto;
    text-align: center;
    font-weight: bold;
    position: relative;
    img {
      position: absolute;
      width: 100px;
      height: 100px;
      top: -100px;
      left: 110px;
    }
  }
  .login-form {
    position: absolute;
    // left: 0;
    // right: 0;
    width: 400px;
    padding: 35px 35px 25px 35px;
    // margin: 120px auto;
    top: 50%;
    left: 50%;
    //兼容IE9
    overflow:auto;
    margin-left:-200px;
    margin-top:-200px;
     //兼容IE9
    // transform: translate(-50%, -50%);
    // -webkit-transform: translate(-50%, -50%);
    // -moz-transform: translate(-50%, -50%);
    // -ms-transform: translate(-50%, -50%);
    // -o-transform: translate(-50%, -50%);
    z-index: 500;
  }
  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    border: 1px solid #d8d8d8;
    // background: rgba(0, 0, 0, 0.1);
    background: #ecf5fa;
    border-radius: 5px;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  /* 登陆页logo */
  .login-logo {
    position: absolute;
    top: 20px;
    left: 20px;
    .logo {
      height: 34px;
      // width: 140px;
      // margin: 14px 17px;
    }
    .title {
      font-size: 20px;
      color: #eeeeee;
    }
    div {
      float: left;
      margin-right: 20px;
    }
  }
  .login-foot {
    color: #999999;
    position: absolute;
    bottom: 20px;
    left: 0;
    text-align: center;
    width: 100%;
  }
}
// .verification-code {
//   margin-top: 1px;
// }
</style>
