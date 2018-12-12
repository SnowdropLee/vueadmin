<template>
  <el-dialog title="版本更新策略模板导入" width="500px" :lock-scroll=false :close-on-click-modal=false @close="closeCallback" :visible.sync="isShow">
    <div v-loading="loading" element-loading-text="拼命加载中">
      <el-card>
        <el-upload ref="upload" :action=fileUrl :limit="1" :on-exceed="handleExceed" :on-success="handleSuccess" :on-remove="delfile" accept=".xlsx,.xls">
          <el-button size="mini" plain type="primary">选择上传文件</el-button>
          <span slot="tip" class="el-upload__tip"> 请上传Excel模版文件</span>
        </el-upload>
      </el-card>

      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button size="mini" @click="isShow = false" style="margin-top: 10px;">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSubmit" style="margin-top: 10px;">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import versionTemplateImport from "@/message/version/versionTemplate/version-template-import";
export default {
  props: {
    option: Object
  },
  data() {
    return {
      loading: false,
      fileUrl: "",
      fileName: "",
      isfile: false,
      dialogFormVisible: false,
      fileList: [],
      urlAddress: ""
    };
  },
  created() {
    this.fileUrl = getGlobalParams.get("versionFileUploadAddress");
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.importTemplateIsShow;
      },
      set: function(newVal) {
        this.option.importTemplateIsShow = newVal;
      }
    }
  },
  methods: {
    // 大于一个文件提示信息
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一个模版文件！`);
    },
    /**
     * @desc 上传成功后回调方法
     * @param res 响应结果
     * @param file 文件信息
     * @param fileList 文件列表
     */
    handleSuccess(res, file, fileList) {
      this.fileName = file.name;
      this.urlAddress = res.url;
      this.isfile = true;
    },

    // 文件移除时的钩子
    delfile() {
      this.isfile = false;
    },

    /**
     * @desc 关闭dialog窗口回调函数
     */
    closeCallback() {
      this.isfile = false;
      this.$refs.upload.clearFiles();
    },

    /**
     * @desc 提交模版信息
     */
    onSubmit() {
      if (this.isfile) {
        this.loading = true;
        let resBody = new versionTemplateImport();
        resBody.data.uploadFileName = this.fileName;
        // resBody.data.urlAddress = this.urlAddress
        //resBody.data.urlAddress = "/home/afa4sj/AFA4J_2.7.1_1207/share/"
        resBody.data.urlAddress = "version/" + this.fileName;
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              this.loading = false;
              this.$parent.queryInfoList();
              this.isflie = false;
              this.isShow = false;
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
          message: "请选择模板文件",
          type: "warning"
        });
      }
    }
  }
};
</script>

