<!--
adsFileUpload页面没有修改弹窗,新增修改删除功能都需要联调
-->
<template>
     <div v-loading="loading"
             element-loading-text="加载中。。。">
         <el-card>
            <el-row>
              <el-col :md="3" :lg="2" >
                  <el-button type="primary" size="mini" icon="el-icon-plus" @click="dialogOptions.isShow=true" v-if="btnPermission('Button_AD_Add')">新增</el-button>
              </el-col>
              <el-col :md="3" :lg="2" >
                  <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="!(selection.length==1)"  @click="editTable" v-if="btnPermission('Button_AD_Edit')">修改</el-button>
              </el-col>
              <el-col :md="3" :lg="2" >
                  <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="!(selection.length>=1)" @click="influencedDelDev" v-if="btnPermission('Button_AD_Delete')">删除</el-button>
              </el-col>
            </el-row>
            <el-table  ref="menuItemList" :data='menuItemList' 
             header-row-class-name="tableHeaderClass"
              class="tableMarginTop"
             @selection-change="selectList"
             border
            >
               <el-table-column type="selection" width="40" fixed></el-table-column>
               <el-table-column prop='fileName' label='文件名称' min-width='110px'></el-table-column>
               <el-table-column prop='filePath' label='文件路径' min-width='200px'></el-table-column>
               <el-table-column prop='fileDesc' label='文件描述' min-width='200px'></el-table-column>
               <el-table-column prop='uploadTime' label='上传时间' min-width='110px'></el-table-column>
               <el-table-column prop='uploadUser' label='上传用户' min-width='90px'></el-table-column>
               <el-table-column  label="预览" align="center" fixed="right" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini"
                        @click="dialogDetail(scope, menuItemList)">预览</el-button>
                    </template>
                </el-table-column>
               <!-- <el-table-column prop='DeviceType' label='是否启用' min-width='107px'></el-table-column>
               <el-table-column prop='DevAssortmentName' label='开始日期' min-width='107px'></el-table-column>
               <el-table-column prop='DevIp' label='结束日期' min-width='107px'></el-table-column>
               <el-table-column prop='DeviceRunState' label='开始时间' min-width='107px'></el-table-column>
               <el-table-column prop='DeviceRunState' label='结束时间' min-width='107px'></el-table-column> -->
               
            </el-table>
            <div class="box" style="text-align:right;margin-top:10px">
                    <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10, 20, 50,100]"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="tableTotal"> 
                    </el-pagination>
            </div>
        </el-card>
        <!-- 弹窗 -->
          <el-dialog :visible.sync="dialogVisible" :lock-scroll=false  @close="dialogDetailClose">
            <div v-loading="loadingImg" style="text-align:center;">
              <h4 v-if="loadingImgError">加载图片失败</h4>
              <img style="width:100%;min-height:340px;position:relative;" :src="dialogImageUrl" alt=""  @load="loadingImg=false" @error="loadingImgFalse">
            </div>
          </el-dialog>
          <el-dialog :visible.sync="deleteCheckPopStatu" :lock-scroll=false>
            <div v-loading="loading">
              因为图片已发布且在播放时间内，所以下列图片不能被删除
              <el-table
              :data="deleteCheckData"
              style="width: 100%;"
              max-height="400"
              >
                <el-table-column
                  prop="fileName"
                  label="图片名称"
                  >
                </el-table-column>
                <el-table-column
                  prop="fileDesc"
                  label="图片描述"
                  >
                </el-table-column>
                <el-table-column
                  prop="uploadUser"
                  label="上传用户"
                  >
                </el-table-column>
              </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button size="mini" @click="deleteCheckPopStatu = false">取 消</el-button>
              <el-button size="mini" type="primary" @click="deleteHandle">继续删除</el-button>
            </div>
          </el-dialog>
         <component :is='dialogList.addAdsFileUpload' :option='dialogOptions' @succ="queryModel"></component>
         <component :is='dialogList.editAdsFileUp' :option='dialogOptionsUpdate' :selected-item='selectedItem' :edit-check-data="editCheckData"  @succ="queryModel"></component>
     </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import addAdsFileUpload from "./dialog/addAdsFileUpload";
import editAdsFileUp from "./dialog/updateAdsFile";
//通讯相关
import request from "@/utils/request";
import adUploadTableIns from "@/message/resourceManage/advertising/ad-upload-table";
import adUploadDeleteIns from "@/message/resourceManage/advertising/ad-upload-delete";
import editShowIns from "@/message/resourceManage/advertising/ad-upload-editShow";
import influencedIns from "@/message/resourceManage/advertising/ad-upload-editCheck";
import delInfluencedIns from "@/message/resourceManage/advertising/ad-upload-deleteCheck";

export default {
  data() {
    return {
      loading: false,
      loadingImg:false,
      loadingImgError:false,
      deleteCheckData:[],
      deleteCheckPopStatu:false,
      dialogVisible: false,
      dialogImageUrl:"",
      dialogList: { addAdsFileUpload, editAdsFileUp },
      dialogOptions: {
        isShow: false
      },
      dialogOptionsUpdate: {
        isShow: false
      },
      // checkedUser: false,
      // isDisabledDel: false,
      selection: [],
      selectedItem: {},

      menuItemList: [],
      tableTotal: 0,
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      editCheckData:[]
    };
  },
  methods: {
    loadingImgFalse(){
      this.loadingImg=false;
      this.loadingImgError=true;
    },
    //预览功能
    dialogDetail(scope){
      this.loadingImgError=false;
      this.dialogVisible=true;
      this.loadingImg=true;
      //这里的地址在globalParams中配置  需要和后台的存放文件的配置统一
      //在这里只取图片下行地址中的ip地址
      var IpAddress=getGlobalParams.get("ADImgFileDownloadAddress").split('/').slice(0,3).join('/')+'/';
      //在表格中返回的内容只有相对地址，所以需要使用ip地址拼接
      this.dialogImageUrl=IpAddress+scope.row.filePath;
    },
    dialogDetailClose(){
      this.dialogImageUrl="";
    },
    handleSizeChange() {
      this.selection=[];
      this.queryModel();
    },
    handleCurrentChange() {
      this.selection=[];
      this.queryModel();
    },
    selectList(selection) {
      this.selection = selection;
    },
    deleteHandle() {
      this.$confirm("您确定是否要删除选中项，删除后将不能恢复", "删除", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        this.deleteAd();
      }).catch(function(){return});
    },
    async queryModel() {
      this.loading = true;
      let resBody = new adUploadTableIns();
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        var resultArr = response.RSP_BODY.resultSet;
        this.menuItemList = resultArr;
        this.tableTotal = response.RSP_BODY.total||response.QUERY_INFO_HEAD.QueryAllDataCount;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    async deleteAd() {
      this.loading = true;
      let resBody = new adUploadDeleteIns();
      var tempArr = [];
      for (var k in this.selection) {
        tempArr.push(this.selection[k].adId);
      }
      resBody.data.adId = tempArr.join(",");
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.queryModel();
        this.deleteCheckPopStatu =false;

        this.$message({
          type: "success",
          // message: response.RSP_BODY.resultSet.resultInfo
          message: "删除成功"
        });
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    async editShowAd() {
      this.loading = true;
      let resBody = new editShowIns();
      var tempArr = [];
      resBody.data.adId = this.selection[0].adId+"";
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        var tempObj=response.RSP_BODY.resultSet[0];
        this.selectedItem={
          "adId":this.selection[0].adId,
          "fileName":this.selection[0].fileName,
          "endDate":tempObj.endDate,
          "endTime":tempObj.endTime,
          "startDate":tempObj.startDate,
          "startTime":tempObj.startTime,
          "isEnable":!Number(tempObj.isEnable),//0为启用
        }
        await this.influencedDev();
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    editTable() {
      this.editShowAd();
    },
    //查询被影响的机具的方法
    async influencedDelDev() {
      this.loading = true;
      let resBody = new delInfluencedIns();
      // console.log(this.selectedItem);
      var tempArr = [];
      for (var k in this.selection) {
        tempArr.push(this.selection[k].adId);
      }
      resBody.data.adId = tempArr.join(",");
      // resBody.QueryPageNo = this.currentPage;
      // resBody.QueryRowNum = this.pageSize;

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.deleteCheckData = response.RSP_BODY.resultSet;
        if(this.deleteCheckData.length==0){
          this.deleteHandle();
          return
        }
        this.deleteCheckPopStatu = true;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    async influencedDev() {
      this.loading = true;
      let resBody = new influencedIns();
      resBody.data.adId = this.selection[0].adId+"";

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.editCheckData = response.RSP_BODY.resultSet;
        // this.innerVisible=true;
        this.dialogOptionsUpdate.isShow = true;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    }
  },
  created() {
    this.queryModel();
  }
};
</script>

<style lang="scss" scoped>
// .dialog-text {
//   display: inline-block;
//   width: 100%;
//   text-align: center;
//   color: red;
//   font-size: 18px;
// }
</style>
