<template>
  <!-- 版本文件上传 -->
  <el-dialog title="版本文件上传" :visible.sync="isShow" @close="closeCallback" :lock-scroll=false width="510px">
    <div v-loading="loading" element-loading-text="拼命加载中">
      <el-card>
        <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="80px" label-position="left">
          <el-form-item label="文件上传" prop="filename">
            <el-upload ref="upload" :action=fileUrl :on-change="versionIsExistChange" :limit="1" :on-exceed="handleExceed" :on-success="successCallback" :on-remove="delfile" accept=".zip" :auto-upload="false">
              <el-button size="mini" plain type="primary">选择上传文件</el-button>
              <div slot="tip" class="el-upload__tip"> 版本号规则：v_8位数字_4位数字，格式：zip</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="版本编号" prop="versionCode">
            <el-input v-model="versionCode" auto-complete="off" disabled placeholder="版本编号自动填入">
            </el-input>
          </el-form-item>

          <el-form-item label="版本策略" prop="strategy_Id">
            <el-select v-model="form.strategy_Id" placeholder="请选择版本操作结果">
              <el-option v-for="item in verOptionsTemplate" :key="item.verOptionsTemplateID" :label="item.verOptionsTemplateName" :value="item.verOptionsTemplateID">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="版本描述" prop="description">
            <el-input type="textarea" autosize placeholder="请输入版本描述" v-model="form.description" auto-complete="off">
            </el-input>
          </el-form-item>

        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button size="mini" @click="isShow = false" style="margin-top: 10px;">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('form')" style="margin-top: 10px;">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";

import versionIsExist from "@/message/version/versionFileUpload/version-is-exist";
import versionFileUpload from "@/message/version/versionFileUpload/version-file-upload";

export default {
  props: { option: Object },
  data() {
    // 定义文件名校验规则
    var validatefile = (rule, value, callback) => {
      if (value === false) {
        callback(new Error("请选择上传文件"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      dialogFormVisible: false,
      form: {
        filename: false
      },
      defaultProps: {
        value: "devTypeNum",
        label: "devType"
      },
      urlAddress: "", // 上传地址
      uploadFileName: "", //上传文件名
      versionCode: "", // 版本号
      devSortOptions: [],
      verOptionsTemplate: [],
      fileUrl: "",  // 版本上传地址
      
      // 校验规则
      rules: {
        filename: [
          { required: true, validator: validatefile, trigger: "change" }
        ],
        strategy_Id: [
          { required: true, message: "请选择设备分类", trigger: "change" }
        ],
        description: [
          { required: true, message: "请填写版本描述", trigger: "blur" }
        ]
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
  created() {
    // 获取版本上传地址
    this.fileUrl = getGlobalParams.get("versionFileUploadAddress");
    this.initSpinnerList();
  },
  methods: {
    // 大于一个文件提示信息
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一个版本文件！`);
    },

    // 初始化版本策略下拉框
    initSpinnerList() {
      let resBody = new spinnerDataQuery();
      resBody.data.spinnerList = [{ spinnerName: "verOptionsTemplate" }];
      request(resBody)
        .then(response => {
          // console.log(response)
          this.verOptionsTemplate = response.RSP_BODY.verOptionsTemplateSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    // 关闭dialog的回调
    closeCallback() {
      this.form = {};
      this.form.filename = false;
      this.$refs.upload.clearFiles();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
      //this.$refs["form"].clearValidate();
    },

    // 上传成功的回调
    successCallback(val) {
      this.form.filename = true;
      this.urlAddress = val;
    },
    // 删除文件
    delfile() {
      this.form.filename = false;
    },

    /**
     * 保存版本文件信息
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let resBody = new versionFileUpload();
          resBody.data.versionCode = this.versionCode;
          resBody.data.strategy_Id = this.form.strategy_Id;
          resBody.data.description = this.form.description;
          resBody.data.uploadFileName = this.uploadFileName;
          resBody.data.urlAddress = "version/" + this.uploadFileName;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading = false;
                this.$parent.initSpinnerList();
                this.$parent.setversionCode(this.versionCode);
                this.$parent.queryInfoList();
                this.isShow = false;
                this.form.filename = false;
                this.$message({
                  message: "版本信息保存成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: response.SYS_HEAD.ReturnMessage,
                  type: "error"
                });
                this.loading = false;
                console.log(response);
              }
            })
            .catch(error => {
              this.loading = false;
              console.log("error", error);
            });
        } else {
          this.$message({
            message: "请完善信息",
            type: "warning"
          });
          return false;
        }
      });
    },

    /**
     * 校验版本名称是否可用
     * @param file
     * @param fileList
     */
    versionIsExistChange(file, fileList) {
      this.uploadFileName = file.name;
      // 转化版本号
      this.versionCode = this.uploadFileName.split('.', 1).toString();
      let resBody = new versionIsExist();
      resBody.data.versionCode = this.versionCode;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.$refs.upload.submit(); // 如果版本名称可用，则提交上传
          } else {
            this.$message({
              message: response.SYS_HEAD.ReturnMessage,
              type: "error"
            });
            this.$refs.upload.clearFiles(); //如果版本名不合格，则清除文件
            this.uploadFileName = null;
            this.versionCode = null;
            return false;
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>

<style scoped>
.el-cascader {
  width: 338px;
}
</style>
