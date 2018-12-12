<template>
  <div v-loading="loading"
             element-loading-text="加载中。。。">
    <el-dialog title="新增广告节目" :visible.sync="isShow" width="750px" :lock-scroll=false @close="closeCallback">
      <el-card>
      <el-form :model="form" ref="form" size="mini" label-width="120px" :rules="rules">

        <el-form-item label="广告节目名称" prop="name" >
            <el-input placeholder="请输入广告名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="广告节目描述" prop="des">
            <el-input placeholder="请输入广告描述" v-model="form.des"></el-input>
        </el-form-item>

        <el-card>
            <div slot="header">
                <span>闲置时</span>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="选择广告" prop="commonPlay">
                        <el-select multiple v-model="form.commonPlay" placeholder="请选择需要播放的图片" @visible-change="selectHandel">
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
                    <!-- 下面按钮功能有待迭代时开发 -->
                    <!-- <el-button type="text" @click="testHandel">测试按钮</el-button> -->
                </el-col>

                <el-col :span="12">
                    <el-form-item label="默认广告" prop="commonDefault">
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
                <span>交易时内嵌</span>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="选择广告" prop="inTradePlay">
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
                    <el-form-item label="默认广告" prop="inTradeDefault">
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
    <el-dialog title="选择广告图片" :visible.sync="pictureSelectorDialogVisible" :lock-scroll=false width="750px">
      <el-card>
        <el-row>
          <el-col>
            <picture-selector :idStr="'adId'" :filePathStr="'filePath'" :data="adPictures" :selection="[1]" @clickPanel="clickPanelHandel"></picture-selector>
          </el-col>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="pictureSelectorDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="xxx('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import pictureSelector from "@/components/pictureSelector";

import request from "@/utils/request";
import addIns from "@/message/resourceManage/advertising/ad-manage-add";
import photoListIns from "@/message/resourceManage/advertising/ad-upload-table";

export default {
  components:{pictureSelector},
  props: {
    option: Object
  },
  data() {
    return {
      //弹窗
      pictureSelectorDialogVisible:false,
      //表格内容
      currentPage:1,
      pageSize:20,
      loading: false,
      adPictures: [],
      form: {
        name: "",
        des: "",
        commonPlay: "",
        commonDefault: "",
        inTradePlay: "",
        inTradeDefault: ""
      },
      //校验
      rules: {
        name: [
          { max: 30, message: "长度不超过30个字符", trigger: "blur" },
          { required: true, message: "节目名称必输", trigger: "blur" }
        ],
      }
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.addAdvertisingIsShow;
      },
      set: function(newVal) {
        this.option.addAdvertisingIsShow = newVal;
      }
    }
  },

  methods: {
    closeCallback(){
      this.$refs["form"].resetFields();
    },
    testHandel(){
      this.pictureSelectorDialogVisible=true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.queryAdd();
        } else {
          this.$message({
            type: "warning",
            message: "请按条件输入"
          });
          return false;
        }
      });
    },
    async queryAdd() {
      this.loading = true;
      let resBody = new addIns();

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
        //清空表格
        // this.form= {
        //   name: "",
        //   des: "",
        //   commonPlay: "",
        //   commonDefault: "",
        //   inTradePlay: "",
        //   inTradeDefault: ""
        // };
        this.$message({
          type: 'success',
          message: '添加成功！'
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
    selectHandel(flag){
      
    },
    clickPanelHandel(item,selection){
      // console.log(item);
      console.log(selection);
    }
  },
  beforeMount(){
    this.queryPhotoList();
  }
};
</script>

<style lang="scss" scoped>

</style>
