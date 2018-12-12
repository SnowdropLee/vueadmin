<template>
   <el-dialog title='修改设备分类' :visible.sync='isShow' width='450px'  @open="openDevModelMod" class="modShortBox"
               :close-on-click-modal=false  @close='clearForm'>
      <div v-loading="loading">
             <el-card>
                  <el-form ref='modModelForm' :model='modModelForm' label-width="110px"  :rules="rules"  size='mini' label-position='left'>
                      <el-row class='devAddHeight'>
                           <el-col  >
                               <el-form-item label="设备分类名称:" prop="devAssortmentName">
                                        <el-input v-model="modModelForm.devAssortmentName" placeholder="请输入型号" name="BrandId" ></el-input>
                                </el-form-item>
                           </el-col>
                      </el-row>
                      <el-row class='devAddHeight'>
                          <el-col>
                                <el-form-item label='设备形式:' prop='devForm'>
                                    <el-radio-group size='mini' v-model='modModelForm.devForm' disabled @change="devFormChange" >
                                      <el-radio v-for="item in devForm" :key="item.id" disabled :label='item.devForm' border>{{item.devFormName}}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                          </el-col>
                      </el-row>
                        <el-row class='devAddHeight'>
                          <el-col>
                                <el-form-item label="设备型号:" prop="devModelId">
                                        <el-cascader v-model="modModelForm.devModelId" name="devModelId"  :options="devModel"
                                       ></el-cascader>
                                    </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row class='devAddHeight'>
                          <el-col >
                               <el-form-item label="C端程序:" prop="cProgramIdList">
                                <el-select v-model="modModelForm.cProgramIdList" placeholder="请选择C端程序">
                                  <el-option
                                  v-for="item in cprogram"
                                  :key="item.value"
                                  :label="item.cProgramName"
                                  :value="item.cProgramID"
                                  :disabled="item.disabled">
                                  </el-option>
                                </el-select>
                                </el-form-item>
                          </el-col>                 
                      </el-row>
                  </el-form>
             </el-card>
             <el-row style="margin:20px 0;text-align:right">
                  <el-button  size="mini" @click="isShow=false">取消</el-button>                        
                  <el-button type="primary" size="mini" @click="cProcUpdate">确认</el-button>
            </el-row>
      </div>
   </el-dialog>
</template>

<script>
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import shortUpdate from "@/message/deviceInfoManage/short/dev-short-update";

export default {
  data() {
    return {
      loading:false,
      devForm: [],
      modModelForm: {
        devAssortmentName:"",
        devForm:"",
        devModelId:[],
        cProgramIdList:[],
      },
      cprogram: [],
      devModel: [],
      checkList: [], //模块
      devBox: [],//设备箱
      devModelList:[],
      cProgramList:[],
       rules: {
        devForm: [
          // {required:true,message:"设备形式必填！",trigger:"blur"}
        ],
        cProgramIdList: [
          // {required:true,message:"C端程序必填！",trigger:"blur"}
        ],
        devAssortmentName: [
          {
            max: 100,
            message: "设备分类名称必须少于100个字符！",
            trigger: "blur"
          },
          {required:true,message:"设备分类名称必填！",trigger:"blur"}
        ],
        devModelId: [
          // {required:true,message:"设备型号必填！",trigger:"blur"}
        ]
      }
    };
  },
  created() {},
  methods: {
    devFormChange(val) {
      //设备形式值改变事件
      if (val.length > 0) {
        this.cprogram = [];
        this.devModel = [];
        if (this.cprogramList) {
          for (let i = 0; i < this.cprogramList.length; i++) {
            if (val == this.cprogramList[i].devForm) {
              this.cprogram.push(this.cprogramList[i]);
            }
          }
        }
        if (this.devModelList) {
           //根据设备形式筛选设备型号下拉框
        for (let i = 0; i < this.devModelList.length; i++) {
          if (this.devModelList[i].hasOwnProperty("children")) {
            let devModelListTemp=Object.assign({},this.devModelList[i])
            this.devModel.push(devModelListTemp);
            let index=this.devModel.length-1;
            this.devModel[index].children=Object.assign([]);
            let tag=0;
            for (let j = 0; j < this.devModelList[i].children.length; j++) {
              if (val == this.devModelList[i].children[j].devForm) {
                tag=1;
                this.devModel[index].children.push(this.devModelList[i].children[j])
              }
            }
            if (tag===0) {
              this.devModel.pop()
            }
          }
        }
        }
        
      }
    },
    openDevModelMod() {
      //初始化设备形式
      let resBody = new devRunList();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "devModelGroup" },
        { spinnerName: "cProgram" }
      ];
      request(resBody)
        .then(response => {
          this.devForm = response.RSP_BODY.devFormSpinner;
          this.devModel = response.RSP_BODY.devModelGroupSpinner;
          this.devModelList = Object.assign([], this.devModel);
          this.cprogram = response.RSP_BODY.cProgramSpinner;
          this.cprogramList = Object.assign([], this.cprogram);
          this.modModelForm.devForm=this.modModel.currentRow.devForm
          let devBrand=[]
          devBrand[0]=this.modModel.currentRow.brandId  
          devBrand[1]=this.modModel.currentRow.devTypeNum
          devBrand[2]=this.modModel.currentRow.devModelId
          this.modModelForm.devModelId=devBrand// 厂商/类型/型号级联信息
          this.modModelForm.cProgramIdList=this.modModel.currentRow.cProgramList[0].cProgramId
          setTimeout(() => {
            this.devFormChange(this.modModelForm.devForm)
          }, 0);
        })
        .catch(error => {
          console.error("错误信息", error);
        });
        this.modModelForm.devAssortmentName=this.modModel.currentRow.devAssortmentName
        
    },
    cProcUpdate() {
          this.loading=true;
          let resBody=new shortUpdate() 
          //需要修改
          resBody.data.devAssortmentId = this.modModel.currentRow.devAssortmentId;          
          resBody.data.devAssortmentName = this.modModelForm.devAssortmentName;
          resBody.data.devForm = this.modModelForm.devForm[0];
          resBody.data.cProgramIdList = [this.modModelForm.cProgramIdList];
          resBody.data.devModelId = this.modModelForm.devModelId[this.modModelForm.devModelId.length-1];
         request(resBody)
           .then(response=>{
          this.loading=false;             
              this.$message({
                  type: "success",
                  message: "设备分类修改成功!"
                });
                this.isShow = false;
                this.$emit("refreshTable");
           })
           .catch(error=>{
               this.loading=false;                          
               console.log(error)         
          })
    },
    clearForm(firstList, ...lists) {
      //重置表单数据
     
    }
  },
  props: {
    modModel: Object
  },
  computed: {
    isShow: {
      get: function() {
        return this.modModel.isShow;
      },
      set: function(newValue) {
        this.modModel.isShow = newValue;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.modShortBox {
  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0;
  }
  .el-radio--mini {
    margin-right: 10px;
  }
}
</style>


