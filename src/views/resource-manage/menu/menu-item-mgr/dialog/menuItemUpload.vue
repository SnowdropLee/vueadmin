<template>
  <div>
    <el-dialog title="交易信息导入" width="500px"
    :lock-scroll=false
    :close-on-click-modal=false
    :visible.sync="isShow">
      <el-card>
        <el-upload
          ref="upload"
          :action= fileUrl
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          accept=".zip, .xlsx, .xls">
          <el-button size="mini" plain type="primary">选择上传文件</el-button>
          <span slot="tip" class="el-upload__tip"> 只能上传Excel模版文件</span>
        </el-upload>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isShow = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from '@/utils/getGlobalParams';
import itemImport from '@/message/resourceManage/menu/menuItem/item-import'
export default {
  props: {
    option: Object
  },
  data(){
    return {
      fileUrl: "",
      fileName: "",
      dialogFormVisible: false,
      fileList: []
    }
  },
  created() {
    this.fileUrl = getGlobalParams.get("menuItemFileUploadAddress")
  },
  computed: {
    isShow: {
      get: function(){
         return this.option.isShow;
      },
      set: function(newVal){
        this.option.isShow = newVal;
      }
    }
  },
  methods: {
    // 大于一个文件提示信息
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一个Excel文件！`);
    },
    handleSuccess(res, file, fileList) {
      this.fileName = file.name
      console.log(this.fileName)
      // this.urlAddress = res.url
    },
    onSubmit() {
      let resBody = new itemImport()
      resBody.data.fileName = this.fileName
      // resBody.data.fileName = this.urlAddress
      resBody.data.fileUrl = this.fileUrl//"/home/afa4sj/AFA4J_2.7.1_1207/share/"
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log(response);
          this.isShow = false
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

