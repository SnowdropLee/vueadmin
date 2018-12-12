<template>
  <div  >
     <el-dialog title='详细信息' :visible.sync='isShow' @open="openCollback" width='65%' 
               :close-on-click-modal=false >
    <div  v-loading="loading">
      <el-card style="margin-bottom:10px">
        <div slot="header">
          <span>设备信息</span>
        </div>
        <el-form label-position="left" size="mini" label-width="100px" >
          <el-row :gutter="20">
            <el-col :md="24" :lg="12">
              <el-form-item label="设备编号">
                <span >{{devInfo.devNum}}</span>
                <!-- <el-input v-model="devInfo.devNum" disabled ></el-input> -->
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="设备形式">
                <span >{{devInfo.devForm}}</span>              
              <!-- <el-input v-model="devInfo.devForm" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :md="24" :lg="12">
              <el-form-item label="设备型号Id">
                <el-input v-model="devInfo.devModelId" disabled></el-input>
              </el-form-item>
          </el-col> -->
          <el-col :md="24" :lg="12">
            <el-form-item label="设备型号">
              <span>{{devInfo.devModel}}</span>
              <!-- <el-input v-model="devInfo.devModel" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :md="24" :lg="12">
              <el-form-item label="设备分类Id">
                  <el-input v-model="devInfo.devAssortmentId" disabled></el-input>
              </el-form-item>
          </el-col> -->
          <el-col :md="24" :lg="12">
            <el-form-item label="设备分类名称">
              <span>{{devInfo.devAssortmentName}}</span>
              <!-- <el-input v-model="devInfo.devAssortmentName" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :md="24" :lg="12">
            <el-form-item label="品牌Id">
              <el-input v-model="devInfo.brandId" disabled></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :md="24" :lg="12">
            <el-form-item label="品牌名称">
              <span>{{devInfo.brandName}}</span>
              <!-- <el-input v-model="devInfo.brandName" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :md="24" :lg="12">
            <el-form-item label="C端程序Id">
              <el-input v-model="cProgramList.cProgramId" disabled></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :md="24" :lg="12">
            <el-form-item label="C端程序名称">
              <span>{{cProgramList.cProgramName}}</span>
              <!-- <el-input v-model="cProgramList.cProgramName" disabled></el-input> -->
            </el-form-item>
          </el-col>
          </el-row>
          
        </el-form>
      </el-card>
      <el-card style="margin-bottom:10px">
        <div slot="header">
          <span>机构信息</span>
        </div>
        <el-form label-position="left" size="mini" label-width="100px">
          <el-row :gutter="20">
            <!-- <el-col :md="24" :lg="12">
              <el-form-item label="机构Id">
                <el-input v-model="branchInfo.branchId" disabled></el-input>
              </el-form-item>
          </el-col> -->
          <el-col :md="24" :lg="12">
              <el-form-item label="机构名称">
                <span>{{branchInfo.branchName}}</span>
                  <!-- <el-input v-model="branchInfo.branchName" disabled></el-input> -->
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="机构号">
              <span>{{branchInfo.branchNo}}</span>
              <!-- <el-input v-model="branchInfo.branchNo" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="机构地址">
              <span>{{branchInfo.branchAddress}}</span>
              <!-- <el-input v-model="branchInfo.branchAddress" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="机构电话">
              <span>{{branchInfo.branchPhone}}</span>
              <!-- <el-input v-model="branchInfo.branchPhone" disabled></el-input> -->
            </el-form-item>
          </el-col>
          
          </el-row>
          
        </el-form>
      </el-card>
      <el-card style="margin-bottom:10px">
        <div slot="header">
          <span>设备运行信息</span>
        </div>
        <el-form label-position="left" size="mini" label-width="100px">
          <el-row :gutter="20">
            <el-col :md="24" :lg="12">
              <el-form-item label="服务开始时间" >
                <span>{{devRunningInfo.serverStartTime}}</span>
                <!-- <el-input v-model="devRunningInfo.serverStartTime" disabled></el-input> -->
              </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="服务结束时间">
              <span>{{devRunningInfo.serverEndTime}}</span>
              <!-- <el-input v-model="devRunningInfo.serverEndTime" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="设备IP">
              <span>{{devRunningInfo.devIp}}</span>
              <!-- <el-input v-model="devRunningInfo.devIp" disabled></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12">
            <el-form-item label="虚拟柜员号">
              <span>{{devRunningInfo.virtualTeller}}</span>
              <!-- <el-input v-model="devRunningInfo.virtualTeller" disabled></el-input> -->
            </el-form-item>
          </el-col>
          </el-row>
          
        </el-form>
      </el-card>
      <el-row style="margin-top:10px;text-align:right">
          <el-button type="primary" size="mini" @click="isShow=false">返回</el-button>
      </el-row>
    </div>
   </el-dialog>
  </div>
  
</template>

<script>
import request from "@/utils/request";
import toolBox from "@/utils/toolBox";
import detailInfo from "@/message/deviceInfoManage/devInfo/dev-info-detail";
export default {
  data() {
    return {
      loading:false,
      //存放请求到的参数
      deviceInfo:[],
      //设备相关信息
      devInfo: {
        devId: "",
        devNum:"",
        // devNum: "",  未取到数据
        devAssortmentId: "",
        devAssortmentName: "",
        devForm: "",
        brandId: "",
        brandName: "",
        devType: "",
        devTypeNum: "",
        devModelId: "",
        devModel: ""
      },
      //机构信息
      branchInfo: {
        branchId: "",
        branchName: "",
        branchNo: "",
        branchAddress: "",
        branchPhone: ""
      },
      //c端程序list：cProgramId、cProgramName
      cProgramList: {
        cProgramId: "",
        cProgramName: ""
      },
      //设备运行信息：
      devRunningInfo: {
        serverStartTime: "",
        serverEndTime: "",
        devIp:"",
        virtualTeller:""
      }
    };
  },
  methods: {
    //时间格式化
    timeFomat(str){
      return toolBox.timeFormat2Time(str)
    },
    //设备形式格式化
    FormFomat(str){
      var form = str;
      if(str == 1){
        form = "柜式自助";
      }else{
        if(str == 2){
          form = "PAD-自助";
        }
      }
      return form;
    },
    //请求参数；
    getData(){ 
      this.loading=true;
      let resBody = new detailInfo();
      resBody.data.devId = this.devIds;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading=false;
            this.deviceInfo = response.RSP_BODY;
            // console.log(this.deviceInfo);
            this.setData();//设置参数
          }else{
            this.loading=false;            
          }
          
        })
        .catch(error => {
            this.loading=false;          
          console.log(error);
        });
    },
    //设置参数：
    setData(){
      this.branchInfo.branchId = this.deviceInfo.branchObject.branchId;
      this.branchInfo.branchName = this.deviceInfo.branchObject.branchName;
      this.branchInfo.branchNo = this.deviceInfo.branchObject.branchNo;
      this.branchInfo.branchAddress = this.deviceInfo.branchObject.branchAddress;
      this.branchInfo.branchPhone = this.deviceInfo.branchObject.branchPhone;
      //devInfo
      this.devInfo.devNum = this.deviceInfo.devNum;
      this.devInfo.devAssortmentId = this.deviceInfo.devAssortmentObject.devAssortmentId;
      this.devInfo.devAssortmentName = this.deviceInfo.devAssortmentObject.devAssortmentName;
      this.devInfo.devForm = this.FormFomat(this.deviceInfo.devAssortmentObject.devForm);
      this.devInfo.brandId = this.deviceInfo.devAssortmentObject.brandId;
      this.devInfo.brandName = this.deviceInfo.devAssortmentObject.brandName;
      this.devInfo.devType = this.deviceInfo.devAssortmentObject.devType;
      this.devInfo.devTypeNum = this.deviceInfo.devAssortmentObject.devTypeNum;
      this.devInfo.brandName = this.deviceInfo.devAssortmentObject.brandName;
      this.devInfo.devModelId = this.deviceInfo.devAssortmentObject.devModelId;
      this.devInfo.devModel = this.deviceInfo.devAssortmentObject.devModel;
      //devRunningInfo
      this.devRunningInfo.serverStartTime = this.timeFomat(this.deviceInfo.devRunningInfo.serverStartTime);
      this.devRunningInfo.serverEndTime = this.timeFomat(this.deviceInfo.devRunningInfo.serverEndTime);
      this.devRunningInfo.devIp = this.deviceInfo.devRunningInfo.devIp;
      this.devRunningInfo.virtualTeller = this.deviceInfo.devRunningInfo.virtualTeller;
      //cProgram
      this.cProgramList.cProgramId = this.deviceInfo.devAssortmentObject.cProgramList[0].cProgramId;
      this.cProgramList.cProgramName = this.deviceInfo.devAssortmentObject.cProgramList[0].cProgramName;
    },
    //dialog回调
    openCollback() {
      this.getData();
      // console.log(this.devIds);
    }
  },
  created() {
    // console.log(123);
  },
  props: {
    optionDetail: Object
  },
  computed: {
    isShow: {
      get: function() {
        return this.optionDetail.isShow;
      },
      set: function(newValue) {
        this.optionDetail.isShow = newValue;
      }
    },
    //获得当前行devId
    devIds:function(){
      return this.optionDetail.devId;
    }
  }
};
</script>

<style scoped lang="scss">

</style>


