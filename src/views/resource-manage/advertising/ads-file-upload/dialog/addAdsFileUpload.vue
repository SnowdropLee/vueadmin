<template>
    <el-dialog title="添加广告文件" @close="closePop" :visible.sync="isShow" width="750" :lock-scroll=false>
      <div v-loading="loading">
        <el-card>
          <el-row>
            <el-col :md="24" :lg="{span:20,offset:2}">
                    <el-form :rules="rules" :model="form" ref="form" size="mini" label-width="80px">

          <!-- <input name="file" type="file" 
            accept="image/png,image/gif,image/jpeg,aplication/zip" @change="update"/> -->

          <el-form-item label="图片上传" prop="file">
            <!-- <el-upload
              :action= fileUploadUrl
              list-type="picture-card"
              :on-progress="handleProgress"
              :on-error="handleRemove"
              :on-preview="handlePreview"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :file-list="fileList"

              :limit="1"
              :on-exceed="handleExceed"
              accept=".zip, .jpg, .jpeg , .png"
              >
              <i class="el-icon-plus"></i>
            </el-upload> -->
            <el-upload
              class="ADupload avatar-uploader"
              :action= fileUploadUrl
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
              :on-progress="handleProgress"
              :on-error="handleRemove"
              :on-success="handleSuccess"
              >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!-- <el-upload
              :action= fileUploadUrl
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
          </el-form-item>

          <el-form-item label="图片描述" prop="fileDesc" >
            <el-input v-model="form.fileDesc" placeholder="请输入图片描述"></el-input>
          </el-form-item>

          <el-form-item label="是否启用" prop="isEnable" >
            <el-radio-group v-model="form.isEnable">
              <el-radio :label=true>启用</el-radio>
              <el-radio :label=false>不启用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="播放日期" required>
            <el-col :span="11">
              <el-form-item prop="startDate" style="margin-bottom:0 !important;">
                <el-date-picker
                  style="width: 100%;"
                  :editable="false"
                  value-format="yyyyMMdd"
                  v-model="form.startDate"
                  type="date"
                  placeholder="播放开始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align:center;">
              -
            </el-col>
            <el-col :span="11">
              <el-form-item prop="endDate" style="margin-bottom:0 !important;">
                <el-date-picker
                  style="width: 100%;"
                  :editable="false"
                  value-format="yyyyMMdd"
                  v-model="form.endDate"
                  type="date"
                  placeholder="播放结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="播放时间" required>
            <el-col :span="11">
              <el-form-item prop="startTime" style="margin-bottom:0 !important;">
                <el-time-picker
                  style="width: 100%;"
                  :editable="false"
                  value-format="HHmmss"
                  v-model="form.startTime"
                  :picker-options="{
                    selectableRange: '8:00:00 - 20:00:00'
                  }"
                  placeholder="播放开始时间">
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align:center;">
              -
            </el-col>
            <el-col :span="11">
              <el-form-item prop="endTime" style="margin-bottom:0 !important;">
                <el-time-picker
                  style="width: 100%;"
                  :editable="false"
                  value-format="HHmmss"
                  arrow-control
                  v-model="form.endTime"
                  :picker-options="{
                    selectableRange: '8:00:00 - 20:00:00'
                  }"
                  placeholder="播放结束时间">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

        </el-form>
            </el-col>
          </el-row>
        </el-card>
      </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closePop">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";

import request from "@/utils/request";
import adUploadIns from "@/message/resourceManage/advertising/ad-upload-upload";

export default {
  props: {
    option: Object
  },
  data() {
    return {
      //公共
      loading: false,
      //上传
      fileList: [],
      imageUrl: "",
      fileUploadUrl:"",
      fileDownloadUrl:"",
      //表格查询
      form: {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        isEnable: true,
        fileDesc:""
      },
      //弹窗
      dialogFormVisible: false,

      //校验
      rules: {//file fileDesc isEnable startDate endDate startTime endTime
        file: [
          { trigger: "blur" ,validator:this.picVali},
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        fileDesc: [{ max: 50, message: "长度不超过50个字符", trigger: "blur" }],
        isEnable: [{ required: true, message: "请选择是否启用", trigger: "blur" }],
        startDate: [
          { required: true, message: "请选择起始日期", trigger: "change" },
          { trigger: "change" ,validator:this.startDateVali}
        ],
        endDate: [
          { required: true, message: "请输入结束日期", trigger: "change" },
          { trigger: "change" ,validator:this.endDateVali}
          ],
        startTime: [
          { required: true, message: "请输入起始时间", trigger: "change" },
          { trigger: "change" ,validator:this.startTimeVali}
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: "change" },
          { trigger: "change" ,validator:this.endTimeVali}
        ]
      },
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newVal) {
        this.option.isShow = newVal;
      }
    }
  },
  created() {
    this.fileUploadUrl = getGlobalParams.get("ADImgFileUploadAddress");
    this.fileDownloadUrl = getGlobalParams.get("ADImgFileDownloadAddress");
  },
  methods: {
    closePop(){
      this.isShow=false;
      // console.log(this.$refs);
      this.$refs.form.resetFields(); //清除表单数据
      this.$refs.form.clearValidate();//清除表单验证
      this.imageUrl="";//清除图片
    },
    handleProgress(event, file, fileList){
      // console.log(fileList);
    },
    handleBeforeUpload(file){
      this.loading = true;
    },
    handleSuccess(event, file, fileList){
      this.loading = false;
      this.imageUrl=this.fileDownloadUrl+file.name;
      // console.log(fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);/////////这里无效
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.imageUrl="";
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },

    previewBanner(file) {
      let reader = new FileReader();
      reader.onload = () => {
        let _base64 = reader.result;
        doWhatUWant(_base64); //就可以做你想做的啦！！！
      };
      reader.readAsDataURL(file.raw);
    },
    
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.queryUpload();
        } else {
          this.$message({
            type: "warning",
            message: "请按条件输入"
          });
          return false;
        }
      });
    },
    picVali(rule, value, callback){
      console.log(this.imageUrl);
      if (this.imageUrl=="") {
        callback("请选择上传图片");
      }
      else {
        callback();
      }
    },
    startDateVali(rule, value, callback){
      // console.log(this);
      if (this.form.endDate==""){
        callback();
      }
      else if (value > this.form.endDate) {
        callback(new Error('起始日期不得大于结束日期'));
      } 
      else {
        if (this.form.endDate !== '') {
          this.$refs.form.validateField('endDate');
        }
        callback();
      }
    },
    endDateVali(rule, value, callback){
      if (value < this.form.startDate) {
        callback(new Error('结束日期不得小于开始日期'));
      } 
      else {
        //加这句有死循环
        // if (this.form.startDate !== '') {
        //   this.$refs.form.validateField('startDate');
        // }
        callback();
      }
    },
    startTimeVali(rule, value, callback){
      // console.log(this);
      if (this.form.endTime==""){
        callback();
      }
      else if (value > this.form.endTime) {
        callback(new Error('起始时间不得大于结束时间'));
      } 
      else {
        if (this.form.endTime !== '') {
          this.$refs.form.validateField('endTime');
        }
        callback();
      }
    },
    endTimeVali(rule, value, callback){
      if (value < this.form.startTime) {
        callback(new Error('结束时间不得小于开始时间'));
      } 
      else {
        callback();
      }
    },
    async queryUpload() {
      this.loading = true;
      let resBody = new adUploadIns();
      resBody.data.startDate=this.form.startDate;
      resBody.data.endDate=this.form.endDate;
      resBody.data.startTime=this.form.startTime;
      resBody.data.endTime=this.form.endTime;
      resBody.data.isEnable=!this.form.isEnable+0+"";//0启用 1禁用
      resBody.data.adFilePath=this.imageUrl;
      resBody.data.fileDesc=this.form.fileDesc;

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$emit('succ');
        this.isShow = false;
        //清空表格
        this.form={
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          isEnable: true,
          fileDesc:""
        };
        this.fileList=[];
        this.$message({
            type: "success",
            message: "上传成功!"
          });
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
  }
};
</script>

<style lang="scss">
  .ADupload.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  

</style>
