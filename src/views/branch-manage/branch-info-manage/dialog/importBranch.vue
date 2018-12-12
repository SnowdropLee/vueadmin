<template>
  <div>
    <el-dialog title="机构信息导入" width="500px"
    :lock-scroll=false
    :close-on-click-modal=false
    @close="closeImport"
    :visible.sync="isShow">
      <el-card>
        <el-upload
          ref="upload"
          :action= fileUrl
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :on-error="handleError"
          accept=".zip, .xlsx, .xls">
          <el-button size="mini" plain type="primary">选择上传文件</el-button>
          <span slot="tip" class="el-upload__tip"> 只能上传Excel模版文件</span>
        </el-upload>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isShow = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSubmit" :disabled="isDisabled">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from '@/utils/getGlobalParams';
import itemImport from '@/message/branchManage/branch/branch-info-import'
export default {
  props: {
    importBranch: Object
  },
  data(){
    return {
      isDisabled:true,
      fileUrl: "",
      fileName: "",
      dialogFormVisible: false,
      fileList: []
    }
  },
  created() {
    this.fileUrl = getGlobalParams.get("branchFileUploadAddress")
    console.log(this.fileUrl)
  },
  computed: {
    isShow: {
      get: function(){
         return this.importBranch.isShow;
      },
      set: function(newVal){
        this.importBranch.isShow = newVal;
      }
    }
  },
  methods: {
    // 大于一个文件提示信息
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一个Excel文件！`);
    },
    handleSuccess(res, file, fileList) {
      this.isDisabled=false
      this.fileName = file.name
      console.log(this.fileName)
      // this.urlAddress = res.url
    },
    handleError(){
      this.isDisabled=true      
      this.$message.warning(`文件上传失败！`);      
    },
    closeImport(){
      this.isDisabled=true            
    },
    onSubmit() {
      let resBody = new itemImport()
      resBody.data.fileName = this.fileName
      // resBody.data.urlAddress = this.urlAddress
      resBody.data.fileUrl = this.fileUrl//"/home/afa4sj/AFA4J_2.7.1_1207/share/"
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log(response);
          this.isShow = false
          this.$message({
                  type: "success",
                  message: "文件导入成功!"
          });
          this.$emit("refreshTable")
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        console.log("error", error);
      })
    }
  }
}
</script>

