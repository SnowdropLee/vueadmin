<template>
  <div>
    <el-dialog title='添加交易' :visible.sync='isShow'  width="760px" @open="openUpdate" @close="closeUpdete"
            :close-on-click-modal=false >
      <div v-loading="loading">
        <el-card> 
          <el-form ref='menuItemUpdate' :model='menuItemUpdate' size="mini"  label-width="80px" label-position="left">
            <el-row :gutter="40">
                <el-col :span='12'>
                  <el-form-item label="交易名称:" prop='menuItemTitle'>
                        <el-input v-model="menuItemUpdate.menuItemTitle" placeholder="请输入菜单项标题"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='12' >
                  <el-form-item label="大小:" prop='menuItemSize'>
                    <el-select v-model="menuItemUpdate.menuItemSize" 
                      @change="sizeChange" placeholder="请选择交易">
                          <el-option
                          v-for="item in menuItemSize"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          :disabled="item.disabled">
                          </el-option>
                        </el-select>
                          <!-- <el-cascader :options='menuItemSize' v-model='menuItemUpdate.menuItemSize' @change="sizeChange"></el-cascader> -->
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col  :span='12'  >
                  <!-- <el-tooltip class="item" effect="dark" content="菜单项大小为自定义时可用" placement="top-start">                   -->
                    <el-form-item label="宽度:" prop='menuItemWidth'>
                          <el-input v-model="menuItemUpdate.menuItemWidth" :disabled="isDisabledSize"  placeholder="请输入交易宽度(像素--数值)"></el-input>
                    </el-form-item>
                  <!-- </el-tooltip> -->
                </el-col>
                <el-col  :span='12' >
                  <!-- <el-tooltip class="item" effect="dark" content="菜单项大小为自定义时可用" placement="top-start"> -->
                    <el-form-item label="高度:" prop='menuItemHeight'>
                          <el-input v-model="menuItemUpdate.menuItemHeight" :disabled="isDisabledSize" placeholder="请输入交易高度(像素--数值)"></el-input>
                    </el-form-item>
                  <!-- </el-tooltip> -->
                </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col  :span='12'  >
                  <el-form-item label="图标:" prop='menuItemIcon'>
                      
                        <el-upload
                          :action= fileUploadUrl
                          list-type="picture"
                          :on-progress="handleProgress"
                          :on-preview="handlePreview"
                          :before-remove="beforeRemove"
                          :on-remove="handleRemove"
                          :file-list="fileList"
                          :limit="1"
                          :on-exceed="handleExceed"
                          accept=".zip, .jpg, .jpeg , .png"
                          >
                        <el-tooltip class="item" effect="dark" content="只能上传jpg/png文件，且不超过500kb" placement="top-start">
                         <el-button size="mini" type="primary">点击上传</el-button>
                        </el-tooltip>
                        </el-upload>
                     
                        
                  </el-form-item>
                </el-col>
                <el-col :span='12' >
                  <el-form-item label="背景图片:" prop='menuItemBaclgrround'>
                        <el-upload
                          :action= fileUploadUrl
                          list-type="picture"
                          :on-progress="handleProgressBG"
                          :on-preview="handlePreviewBG"
                          :before-remove="beforeRemoveBG"
                          :on-remove="handleRemoveBG"
                          :file-list="fileListBG"
                          :limit="1"
                          :on-exceed="handleExceedBG"
                          accept=".zip, .jpg, .jpeg , .png"
                          >
                      <el-tooltip class="item" effect="dark" content="只能上传jpg/png文件，且不超过500kb" placement="top-start">
                        <el-button size="mini" type="primary">点击上传</el-button>
                      </el-tooltip>
                        </el-upload>
                      
                        
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col  :span='12' >
                    <el-form-item label="是否启用:" prop='menuItemIsUse'>
                          <el-radio-group v-model="menuItemUpdate.menuItemIsUse">
                              <el-radio label='1'>是</el-radio>
                              <el-radio label='0'>否</el-radio>    
                          </el-radio-group>
                  </el-form-item>
                  
                </el-col>
                <el-col  :span='12' >
                      <el-form-item label="点击效果:" prop='menuItemClickEffact'>
                        <el-select v-model="menuItemUpdate.menuItemClickEffact" placeholder="请选择交易">
                          <el-option
                          v-for="item in menuItemClickEffact"
                          :key="item.value"
                          :label="item.ACTIVECLASS"
                          :value="item.ACTIVECLASS"
                          :disabled="item.disabled">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col  :span='12' >
                  <el-form-item label="二级菜单:" prop='menuItemsIs'>
                    <el-radio-group v-model="menuItemUpdate.menuItemsIs" @change="isMenus">
                        <el-radio label='0'>是</el-radio>
                        <el-radio label='1'>否</el-radio>    
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col  :span='12'  >
                  <el-form-item label="二级菜单:" prop='menuItems'>
                    <el-select v-model="menuItemUpdate.menuItems" 
                    placeholder="请选择二级菜单" 
                    :disabled="isDisabledMenus"
                    value-key="group_Id"
                    @change="menuChange"
                    >
                      <el-option
                      v-for="item in menuItems"
                      :key="item.value"
                      :label="item.categoryName"
                      :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col  :span='12'  >
                  <el-form-item label="步骤条:" prop='menuItemStep'>
                    <el-select v-model="menuItemUpdate.menuItemStep" placeholder="请选择步骤条" :disabled="!isDisabledMenus">
                      <el-option
                      v-for="item in menuItemStep"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col  :span='12'  >
                  <el-form-item label="交易路径:" prop='menuItemStep'>
                    <el-select v-model="menuItemUpdate.menuItemPath" 
                    placeholder="请选择交易路径" 
                    :disabled="!isDisabledMenus"
                    @change="pathMenus"
                    value-key="tradeCode"
                    >
                      <el-option
                      v-for="item in menuItemPath"
                      :key="item.tradeCode"
                      :label="item.tradeName"
                      :value="item">
                      <span style="float: left">{{ item.tradeCode }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tradeName }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-row style="margin:20px 0;text-align:right">
          <el-button  size='mini' @click="isShow=false">返回</el-button>
          <el-button type='primary' size='mini' @click="ItemUpdate">确定</el-button> 
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import tradeAdd from '@/message/resourceManage/menu/menuItem/menu-item-Add'
import getGlobalParams from "@/utils/getGlobalParams";
import menuSecond from "@/message/resourceManage/menu/menuItem/menu-item-second";
import activeClass from "@/message/resourceManage/menu/menuItem/menu-item-activeClass";
import pathList from "@/message/resourceManage/menu/menuItem/menu-item-path";

export default {
  props: { option: Object },
  data() {
    return {
      loading:false,
      userDefined:undefined,
      fileUploadUrl:"",
      fileDownloadUrl:"",
      fileList:[],
      fileListBG:[],
      imageUrlBG:"",
      imageUrl:"",
      menuItemPath:[],
      menuItemUpdate: {
        menuItemPath:"",
        menuItemTitle: "",
        menuItemSize: [],
        menuItemWidth: "",
        menuItemHeight: "",
        menuItemClickEffact: [],
        menuItemIsUse: "1",
        menuItemsIs: "1",
        menuItems: "",
        menuItemStep: [],
        tadPath: "",
        tradeCode: "",
      },
      fileIcon: [],
      fileBackground: [],
      menuItemStep: [
        { label: "有", value: "step" },
        { label: "无", value: "non-step" }
      ],
      meneItems: [],
      menuItems: [],
      menuItemsIs: [],
      menuItemSize: [
        { label: "正常", value: "normal" },
        { label: "宽", value: "wide" },
        { label: "小", value: "small" },
        { label: "小宽", value: "smallWide" },
        { label: "自定义", value: "4" }
      ],
      menuItemClickEffact: [],
      isDisabledSize: true,
      isDisabledMenus: true
    };
  },
  created(){
    this.fileUploadUrl = getGlobalParams.get("menuImgFileUploadAddress");
    this.fileDownloadUrl = getGlobalParams.get("menuImgDownloadAddress");
  },
  methods: {
    handleProgress(event, file, fileList){ //上传文件时得钩子函数
     this.imageUrl=this.fileDownloadUrl+file.name;  //获取到路径+图片名
    },
    beforeRemove(file, fileList) {//删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {//文件列表移除文件时的钩子
      // console.log(file, fileList);
      this.imageUrl="";
    },
    handlePreview(file) {//点击文件列表中已上传的文件时的钩子
      // this.dialogImageUrl = this.fileDownloadUrl+file.name;
      // this.dialogVisible = true;
    },
    handleExceed(files, fileList) {//文件超出个数限制时的钩子
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleProgressBG(event, file, fileList){ //上传文件时得钩子函数
     this.imageUrlBG=this.fileDownloadUrl+file.name;  //获取到上传得路径+图片名
    },
    beforeRemoveBG(file, fileList) {//删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemoveBG(file, fileList) {//文件列表移除文件时的钩子
      // console.log(file, fileList);
      this.imageUrlBG="";
    },
    handlePreviewBG(file) {//点击文件列表中已上传的文件时的钩子
      // this.dialogImageUrl = this.fileDownloadUrl+file.name;
      // this.dialogVisible = true;
    },
    handleExceedBG(files, fileList) {//文件超出个数限制时的钩子
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    menuChange(val){
      this.menuItemUpdate.group_Id=val.group_Id
      this.menuItemUpdate.layoutCol=val.layoutCol
      this.menuItemUpdate.layoutRow=val.layoutRow
      this.menuItemUpdate.themeColor=val.themeColor
      this.menuItemUpdate.categoryName=val.categoryName
      
    },
    pathMenus(val){
      this.menuItemUpdate.tadPath=val.tadPath
      this.menuItemUpdate.tradeCode=val.tradeCode
    },
    closeUpdete(){
      // this.menuItemUpdate
      //  this.$refs["menuItemUpdate"].clearValidate()//清楚表单验证
       this.$refs["menuItemUpdate"].resetFields()//清楚表单验证
      
    },
    // 初始化二级菜单
    initMenuSecond(){
      let resBody=new menuSecond();
      request(resBody)
        .then(response => {
         if (response.SYS_HEAD.ReturnCode === "000000") {
             this.menuItems=response.RSP_BODY.resultSet
          }
        })
        .catch(error => {
          console.log(error);
        });
        
      //初始化点击效果
      let resBody1=new activeClass();
      request(resBody1)
        .then(response => {
         if (response.SYS_HEAD.ReturnCode === "000000") {
             this.menuItemClickEffact=response.RSP_BODY.resultSet
             this.menuItemUpdate.menuItemClickEffact=this.menuItemClickEffact[0].ACTIVECLASS
          }
        })
        .catch(error => {
          console.log(error);
        });
         //初始化交易路径
      let resBody3=new pathList();
      request(resBody3)
        .then(response => {
         if (response.SYS_HEAD.ReturnCode === "000000") {
             this.menuItemPath=response.RSP_BODY.resultSet
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    openUpdate(){ 
      this.initMenuSecond()
    },
    ItemUpdate(){
      this.loading=true;
      let sizeUserDefined=[]
      if (this.userDefined=="4") {
        sizeUserDefined[0]=Number(this.menuItemUpdate.menuItemWidth)
        sizeUserDefined[1]=Number(this.menuItemUpdate.menuItemHeight)
      }
      let resBody=new tradeAdd()
      resBody.data.tradeName = this.menuItemUpdate.menuItemTitle
      resBody.data.menuSize =this.userDefined=="4"?sizeUserDefined.join(","):this.menuItemUpdate.menuItemSize
      resBody.data.icon = this.imageUrl
      resBody.data.bg = this.imageUrlBG
      resBody.data.isEnabled =this.menuItemUpdate.menuItemIsUse
      resBody.data.isHasChild =this.menuItemUpdate.menuItemsIs
      resBody.data.navigationMode =this.menuItemUpdate.menuItemStep
      resBody.data.activeClass =this.menuItemUpdate.menuItemClickEffact
      resBody.data.categoryName =this.menuItemUpdate.categoryName
      resBody.data.group_Id =this.menuItemUpdate.group_Id
      resBody.data.themeColor =this.menuItemUpdate.themeColor
      resBody.data.layoutRow =this.menuItemUpdate.layoutRow
      resBody.data.layoutCol =this.menuItemUpdate.layoutCol
      resBody.data.tadPath =this.menuItemUpdate.tadPath
      resBody.data.tradeCode =this.menuItemUpdate.tradeCode
      // resBody.data.menu_Id =this.option.currentRow.MENU_ID
      request(resBody)
        .then(response => {
         if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading=false;           
              this.$message({
                  type: "success",
                  message: "交易添加成功!"
                });
                this.isShow=false
                this.$emit("refreshTable")
          }else{
            this.loading=false;                       
          }
        })
        .catch(error => {
            this.loading=false;                     
          console.log(error);
        });
    },
    sizeChange(val) {
      if ( val[0] === "4") {
        this.isDisabledSize = false
        this.userDefined="4"
      }else{
        this.isDisabledSize = true
      }
    },
    isMenus(val) {
      if ( val[0] === "0") {
        this.isDisabledMenus = false;
      }else{  
        this.isDisabledMenus = true;
        this.menuItemUpdate.menuItems=""
      }
    }
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(val) {
        this.option.isShow = val;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
