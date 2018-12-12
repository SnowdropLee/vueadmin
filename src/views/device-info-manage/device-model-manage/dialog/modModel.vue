<template>
   <el-dialog title='修改设备型号信息' :visible.sync='isShow' width='620px' @open="openUpdate"
               :close-on-click-modal=false  @close='clearForm'>
    <div v-loading="loading">
      <el-card>
        <el-form ref='updateModel' :model='updateModel' label-width="90px" :rules="rules" size='mini' label-position='left'>
          <el-row class='devAddHeight'>
            <el-col :span='13'>
              <el-form-item label="型    号:" prop="devModel">
                <el-input v-model="updateModel.devModel" placeholder="请输入型号" name="BrandId" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='devAddHeight'>
            <el-col>
              <el-form-item label='设备形式:' prop='devForm'>
                <el-radio-group size='mini' v-model='updateModel.devForm' disabled @change="devFormChange">
                  <el-radio v-for="item in devForm" :key="item.id" :label='item.devForm' border>{{item.devFormName}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='devAddHeight'>
            <el-col>
              <el-form-item label="设备类型:" prop="devType">
                <el-select v-model="updateModel.devType" placeholder="请选择设备类型">
                  <el-option
                  v-for="item in devType"
                  :key="item.value"
                  :label="item.devType"
                  :value="item.devTypeNum"
                  :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='devAddHeight'>
            <el-col >
              <el-form-item label="品牌名称:" prop="devBrand">
                <el-select v-model="updateModel.devBrand" placeholder="请选择设备类型">
                  <el-option
                  v-for="item in devBrandInfo"
                  :key="item.value"
                  :label="item.brandName"
                  :value="item.brandId"
                  :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>                          
          </el-row>
          <el-row class='devAddHeight'>
          <el-col :span='24'>
            <el-form-item label="模块:" prop="devModuleNum">
              <el-checkbox-group v-model="updateModel.devModuleNum" class="modelBox">
                <el-checkbox v-for="item in devModule" :key="item.devModuleNum"  :label="item.devModuleNum">{{item.devModule}}</el-checkbox>
              </el-checkbox-group>
              <!-- <el-input type="textarea" :rows="1" v-model="addBrand.BrandContactsTelephone" name="BrandContactsTelephone" ></el-input>                                 -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='23'>
            <!-- <el-col :span="5" > -->
            <el-form-item label="设备箱:" prop="boxCount">
              <el-col :span="6">
                <el-checkbox-group v-model="updateModel.devBoxSel">
                   <el-checkbox v-for="item in devBox" 
                     :key="item.devBoxNum" 
                     :label="item.devBoxNum"
                      @change="moduleChange(item.devBoxNum)"
                     >{{item.devBox}}</el-checkbox>    
                </el-checkbox-group>
              </el-col>
              <el-col :span="6" :offset="1" >
                <el-input v-for="(list,index)  in devBox" :key="list.devBoxNum"  
                style="margin-bottom:5px"
                size="mini" :name="list.devBoxNum" 
                :disabled="isDisabled(list.devBoxNum,index)"
                placeholder="请输入箱子数"  @blur="isNum" :ref="list.devBoxNum"
                v-model="updateModel.boxCount[''+list.devBoxNum]" >
                </el-input>
              </el-col>
              <el-col :span="6">
                <div v-for="item in devBox" :key="item.devBoxNum" style="margin-bottom:5px;margin-left:5px">个</div >
              </el-col>   
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-row style="margin:20px 0;text-align:right" >
            <el-button  size="mini" @click="isShow=false">取消</el-button>                        
            <el-button type="primary" size="mini" @click="modelUpdate">确认</el-button>
      </el-row>
    </div>
   </el-dialog>
</template>

<script>
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import devModelUpdate from "@/message/deviceInfoManage/model/dev-model-update";

export default {
  data() {
    return {
      boxCountRules:true,
      loading:true,
      boxCount: [],
      devForm: [],
      updateModel: {
        devForm: "",
        devType: "",
        devModel:"",   
        devModuleNum:[],
        devBoxSel:[],
        boxCount:[],
        devBrand:"",
      },
      devType: [],
      devTypeList: [],      
      checkList: [], //模块
      devBox: [], //设备箱
      devBrandInfo: [], //品牌名称
      devModule: [], //模块
      devModuleNum: [],
      devBoxSel: [],
      rules: {
        devForm: [
          { required: true, message: "请选择设备形式", trigger: "change" },          
        ],
        devType: [
          { required: true, message: "请选择设备类型", trigger: "change" },          
        ],
        devBrand:[
          { required: true, message: "请选择品牌", trigger: "change" },          
        ], 
        devModel:[
          { required: true, message: "请输入模型号", trigger: "blur" },
          { max:100, message: "模型号长度不能超过100个字符！", trigger: "blur" },          
        ],  
        boxCount:[
          //  { validator: checkBoxCount, trigger: 'blur' }
        ], 
      }
    };
  },
  created() {
  },
  methods: {
    moduleChange(val){  //在不选择设备箱时将该设备箱得校验清掉
      this.$refs[val][0].$el.children[0].style.border="1px solid #dcdfe6"  //要设置每个设备箱及文本框得ref属性和设备箱得ID是一样的
      this.boxCountRules=true;
    },
    devFormChange(val) {
      //设备形式值改变事件
      this.devType=[]
      for (let i = 0; i < this.devTypeList.length; i++) {
            if(val== this.devTypeList[i].devForm){
              this.devType.push(this.devTypeList[i]);
            }
      }
    },
    isNum(val){//见添加设备模型的isNum函数
      val.target.style.border="1px solid #dcdfe6"
      if (val.srcElement.value!="") {
        let reg=/^[0-9]+$/
        if(reg.test(val.srcElement.value) && Number(val.srcElement.value)<=10){
          this.boxCountRules=true          
          return true   
        }else{
          val.srcElement.value=""
          this.updateModel.boxCount[val.srcElement.name]=""
          this.$message({
            type:"warning",
            message:"请输入小于10的数字！"
          })
          val.srcElement.focus()
          val.target.style.border="1px solid #f56c6c"
          this.boxCountRules=false
          return false
        }
      }else{          
        this.boxCountRules=false  
        val.target.style.border="1px solid #f56c6c"          
      }
    },
    isDisabled(val,index) {
      if (this.updateModel.devBoxSel.indexOf(val) > -1) {
        return false;
      } else {
        this.updateModel.boxCount["" + val] = "";
        return true;
      }
    },
    //初始化下拉框
    initList() {
      this.loading=true;
      let resBody1 = new devRunList();
      resBody1.data.spinnerList = [
        { spinnerName: "devBrand" },
        { spinnerName: "devType" },
        { spinnerName: "devBox" },
        { spinnerName: "devForm" },
        { spinnerName: "devModule" }
      ];
      request(resBody1)
        .then(response => {
        if (response.SYS_HEAD.ReturnCode === "000000") {
          this.devType = response.RSP_BODY.deviceTypeSpinner;
          this.devForm = response.RSP_BODY.devFormSpinner;
          this.devBrandInfo = response.RSP_BODY.devBrandInfoSpinner;
          this.devBox = response.RSP_BODY.devBoxInfoSpinner;
          this.devModule = response.RSP_BODY.devModuleInfoSpinner;
          this.devTypeList= Object.assign([], this.devType );
          //取到数据进行格式化并回显
          this.updateModel.devBrand=this.modModel.currentRow.brandId
          this.updateModel.devForm=this.modModel.currentRow.devForm
          this.devFormChange(this.updateModel.devForm)
          this.updateModel.devType=this.modModel.currentRow.devTypeNum
          this.updateModel.devModel=this.modModel.currentRow.devModel  
          this.updateModel.devModuleNum=this.modModel.currentRow.devModuleId.split("|") 
          this.updateModel.devBoxSel=this.modModel.currentRow.devBoxId?this.modModel.currentRow.devBoxId.split("|"):[]
          let devBoxCount=this.modModel.currentRow.devBoxCount?this.modModel.currentRow.devBoxCount.split("|"):[]
          for (let i = 0; i < this.updateModel.devBoxSel.length; i++) {
            this.updateModel.boxCount[this.updateModel.devBoxSel[i]]=devBoxCount[i]
          }
          this.loading=false;   
        }else{
          this.loading=false;             
        }       
        })
        .catch(error => {
         this.loading=false;
          console.error("错误信息", error);
        });
    },
    openUpdate() {
      this.initList()
    },
    modelUpdate() {
       let boxCount=[];  
      for (let i = 0; i < this.updateModel.devBoxSel.length; i++) {
          boxCount.push(this.updateModel.boxCount[this.updateModel.devBoxSel[i]])
          if (!this.updateModel.boxCount[this.updateModel.devBoxSel[i]] || this.updateModel.boxCount[this.updateModel.devBoxSel[i]]>10) {
            this.boxCountRules=false;
            this.$refs[this.updateModel.devBoxSel[i]][0].$refs.input.style.border="1px solid #f56c6c"
          }
      }

      this.$refs["updateModel"].validate(valid => {
        if (valid && this.boxCountRules) {
        this.loading=true;
        let resBody = new devModelUpdate();
        resBody.data.devModelId =this.modModel.currentRow.devModelId;
        resBody.data.devForm = this.updateModel.devForm;
        resBody.data.devType = this.updateModel.devType;
        resBody.data.devModel = this.updateModel.devModel;
        resBody.data.brandId = this.updateModel.devBrand;
        resBody.data.devModuleId = this.updateModel.devModuleNum.join("|");
        resBody.data.devBoxId = this.updateModel.devBoxSel.join("|");
        resBody.data.devBoxCount =boxCount.join("|");
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              this.loading=false;
              this.$message({
                    type: "success",
                    message: "设备型号修改成功!"
                  });
                  this.isShow = false;
                  this.$emit("refreshTableModel");
            }else{
              this.loading=false;
            }
          })
          .catch(error => {
            this.loading=false;            
            console.log(error);
          });
      }else{
         this.loading=false;
         this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
      }
      })
    },
    clearForm(firstList, ...lists) {
      //重置表单数据
         for (let i = 0; i < this.updateModel.devBoxSel.length; i++) {
          if (!this.updateModel.boxCount[this.updateModel.devBoxSel[i]]) {
            this.$refs[this.updateModel.devBoxSel[i]][0].$refs.input.style.border="1px solid #dcdfe6"
          }
      }
      setTimeout(() => {
        this.$refs["updateModel"].clearValidate()//清楚表单验证
        this.$refs["updateModel"].resetFields()//清楚表单验证
      }, 0);
      
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
.devAddHeight {
  height: 50px;
  line-height: 50px;
}
.modelBox {
  height: 125px;
  overflow: auto;
}
.modelBox::-webkit-scrollbar {
  display: none;
}
.content {
  display: flex;
  flex-direction: column;
}
.el-checkbox {
  margin-left: 5px;
}
</style>


