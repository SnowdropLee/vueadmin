<template>
  <div v-loading="loading"
             element-loading-text="加载中。。。">
    <el-dialog title="修改广告" :visible.sync="isShow" width="750px" :lock-scroll=false>
      <el-card>
      <el-form :model="form" ref="form" size="mini" label-width="90px" :rules="rules">

        <el-form-item label="广告名称" prop="name">
            <el-input placeholder="请输入广告名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="广告描述" prop="des">
            <el-input placeholder="请输入广告描述" v-model="form.des"></el-input>
        </el-form-item>

        <el-card>
            <div slot="header">
                <span>闲置时</span>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="时段内播放" prop="commonPlay">
                        <el-select multiple v-model="form.commonPlay" placeholder="请选择需要播放的图片" @change="changeHandel">
                            <el-option
                                v-for="item in adPictures"
                                :key="item.adId"
                                :label="item.fileName"
                                :value="item.adId">
                                <span style="float: left">{{ item.fileName }}</span>
                                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.adId }}</span> -->
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="时段外默认" prop="commonDefault">
                        <el-select v-model="form.commonDefault" placeholder="请选择默认播放的图片">
                             <el-option
                                v-for="item in adPictures"
                                :key="item.adId"
                                :label="item.fileName"
                                :value="item.adId">
                                <span style="float: left">{{ item.fileName }}</span>
                                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.adId }}</span> -->
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>

         <el-card style="margin-top:10px;">
            <div slot="header">
                <span>交易中</span>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="时段内播放" prop="inTradePlay">
                        <el-select multiple v-model="form.inTradePlay" placeholder="请选择需要播放的图片">
                             <el-option
                                v-for="item in adPictures"
                                :key="item.adId"
                                :label="item.fileName"
                                :value="item.adId">
                                <span style="float: left">{{ item.fileName }}</span>
                                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.adId }}</span> -->
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="时段外默认" prop="inTradeDefault">
                        <el-select v-model="form.inTradeDefault" placeholder="请选择默认播放的图片">
                             <el-option
                                v-for="item in adPictures"
                                :key="item.adId"
                                :label="item.fileName"
                                :value="item.adId">
                                <span style="float: left">{{ item.fileName }}</span>
                                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.adId }}</span> -->
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>            
        </el-card>
      </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="isShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";

import request from "@/utils/request";
import editIns from "@/message/resourceManage/advertising/ad-manage-update";
import photoListIns from "@/message/resourceManage/advertising/ad-upload-table";

export default {
  props: {
    option: Object,
    editData:{},
    editId:""
  },
  watch:{
    editData(){
      var tempObj=this.editData[0];
      this.form.name = tempObj.TEMPNAME;
      this.form.des = tempObj.TEMPDESC;

      this.form.commonDefault = tempObj.IDLEDEFAULT*1;
      var temp = tempObj.IDLETIMELIMIT.split(",");
      for(var i=0;i<temp.length;i++){
        temp[i]=temp[i]*1;
        // console.log(temp[i]);
      }
      this.form.commonPlay = temp;

      this.form.inTradeDefault = tempObj.TRANSDEFAULT*1;
      var temp2 = tempObj.TRANSTIMELIMIT.split(",");
      for(var k=0;k<temp2.length;k++){
        temp2[k]=temp2[k]*1;
        // console.log(temp2[k]);
      }
      this.form.inTradePlay = temp2;

    }
  },
  data() {
    return {
      loading: false,
      adPictures: [],
      currentPage:1,
      pageSize:20,
      form: {
        name: "",
        des: "",
        commonPlay: [],
        commonDefault: "",
        inTradePlay: [],
        inTradeDefault: ""
      },
      rules: {
        name: [
          { max: 30, message: "长度不超过30个字符", trigger: "blur" },
          { required: true, message: "模板名称必输", trigger: "blur" }
        ],
        des: [
          { max: 50, message: "长度不超过50个字符", trigger: "blur" }
        ],
      }
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.updateAdvertisingIsShow;
      },
      set: function(newVal) {
        this.option.updateAdvertisingIsShow = newVal;
      }
    }
  },
  methods: {
    changeHandel(){
      console.log(this.form.commonPlay);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.queryEdit();
        } else {
          this.$message({
            type: "warning",
            message: "请按条件输入"
          });
          return false;
        }
      });
    },
    async queryEdit() {
      this.loading = true;
      let resBody = new editIns();
      // console.log(this.editId);
      resBody.data.adtempId = this.editId;
      resBody.data.adtempname = this.form.name;
      resBody.data.adtempdesc = this.form.des;
      resBody.data.adidledefault = this.form.commonDefault;
      resBody.data.adidletimelimit = this.form.commonPlay.join(",");
      resBody.data.adtransdefault = this.form.inTradeDefault;
      resBody.data.adtranstimelimit = this.form.inTradePlay.join(",");

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$emit('succ');
        this.isShow=false;
          this.$message({
            type: 'success',
            message: '修改成功！'
          })
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    async queryPhotoList() {
      this.loading = true;
      let resBody = new photoListIns();
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        var resultArr = response.RSP_BODY.resultSet;
        this.adPictures = resultArr;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
  },
  beforeMount(){
    this.queryPhotoList();
  }
};
</script>
