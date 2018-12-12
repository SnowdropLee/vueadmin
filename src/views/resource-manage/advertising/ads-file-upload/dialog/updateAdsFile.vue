<template>
  <div v-loading="loading"
             element-loading-text="加载中。。。">
    <el-dialog
        title="提示"
        :visible.sync="isShow"
        >
        <div v-loading="popLoading">
          本次修改将会影响下列机具
          <el-table
          :data="editCheckData"
          style="width: 100%;"
          max-height="400"
          >
            <el-table-column
              prop="devNum"
              label="机具编号"
              >
            </el-table-column>
            <el-table-column
              prop="branchNum"
              label="机构编号"
              >
            </el-table-column>
            <el-table-column
              prop="branchName"
              label="所属机构"
              >
            </el-table-column>
          </el-table>
        </div>
      <el-dialog title="修改广告文件" :visible.sync="innerVisible" width="750px" :lock-scroll=false append-to-body>
        <el-card>
        <el-form :model="form" ref="form" size="small" label-width="80px" :rules="rules">
          <el-form-item label="文件名称">
            <span>{{selectedItem?selectedItem.fileName:""}}</span>
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
        </el-card>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="innerVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submit('form')">确 定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="isShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="innerVisible=true">继续修改</el-button>
      </div>
      </el-dialog>
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";

import request from "@/utils/request";
import editIns from "@/message/resourceManage/advertising/ad-upload-edit";

export default {
  // props: {
  //   option: Object,
  //   selectedItem:{},
  //   editCheckData:Array
  // },
  props: ['option','selectedItem','editCheckData'],
  data() {
    return {
      innerVisible:false,
      loading: false,
      popLoading: false,
      dialogFormVisible: false,
      form: {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        isEnable: undefined
      },
      fileList: [],
      defaultProps: {
        value: "devTypeNum",
        label: "devType"
      },
      rules: {//isEnable startDate endDate startTime endTime
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
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {},

    previewBanner(file) {
      let reader = new FileReader();
      reader.onload = () => {
        let _base64 = reader.result;
        doWhatUWant(_base64); //就可以做你想做的啦！！！
      };
      reader.readAsDataURL(file.raw);
    },

    handleExceed(files, fileList) {
      // console.log(this.fileUrl);
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    submit(formName){
      //返回后点击确定再执行下面部分
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
      // this.loading = true;
      // console.log(this.$store);
      let resBody = new editIns();
      resBody.data.isEnable=!this.form.isEnable+0+"";
      resBody.data.startDate=this.form.startDate;
      resBody.data.endDate=this.form.endDate;
      resBody.data.startTime=this.form.startTime;
      resBody.data.endTime=this.form.endTime;
      resBody.data.adId=this.selectedItem.adId+"";

      // resBody.QueryPageNo = this.currentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      // this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$emit('succ');
        this.isShow=false;
        this.innerVisible=false;
        this.$message({
            type: "success",
            message: "修改成功!"
          });
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    }
  },
  watch:{
    selectedItem(){
      this.form={
        startDate: this.selectedItem.startDate,
        endDate: this.selectedItem.endDate,
        startTime: this.selectedItem.startTime,
        endTime: this.selectedItem.endTime,
        isEnable: this.selectedItem.isEnable
      }
    }
  }
};
</script>

