<template>
  <el-dialog title='新增设备型号' :visible.sync='isShow' width='620px'  @open="openCreate"
              :close-on-click-modal=false  @close='clearForm'>
    <div v-loading="loading">
      <el-card> 
        <el-form ref='addModel' :model='addModel' label-width="90px" :rules="rules" size='mini' label-position='left'>
          <el-row>
            <el-col :span="13">
              <el-form-item label="型    号:" prop="devModel">
                <el-input v-model="addModel.devModel" placeholder="请输入型号" name="BrandId" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label='设备形式:' prop='devForm'>
                <el-radio-group size='mini' v-model='addModel.devForm' @change="devFormChange" disabled>
                  <el-radio v-for="item in devForm" :key="item.id" :label='item.devForm' border>{{item.devFormName}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="设备类型:" prop="devType">
                <el-select v-model="addModel.devType" placeholder="请选择设备类型">
                  <el-option
                    v-for="item in devTypeList"
                    :key="item.value"
                    :label="item.devType"
                    :value="item.devTypeNum"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col >
              <el-form-item label="品牌名称:" prop="devBrand">
                <el-select v-model="addModel.devBrand" placeholder="请选择品牌名称">
                  <el-option
                  v-for="item in devBrandInfoList"
                  :key="item.value"
                  :label="item.brandName"
                  :value="item.brandId"
                  :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>                          
          </el-row>
          <el-row>
          <el-form-item label="模块:">
            <el-col :span='24'>
              <el-checkbox-group v-model="devModuleNum" class="modelBox">
                <el-checkbox v-for="item in devModule" 
                  :key="item.id" 
                  :label="item.devModuleNum">
                   {{item.devModule}}
                  </el-checkbox>
              </el-checkbox-group>
            </el-col>
              </el-form-item>
          </el-row>
          <el-row>
            <el-col :span='23'>
              <!-- <el-col :span="5" > -->
              <el-form-item label="设备箱:" prop="boxCount">
                <el-col :span="6">
                  <el-checkbox-group v-model="devBoxSel" >
                    <el-checkbox v-for="item in devBox" 
                      :key="item.devBoxNum" 
                      :label="item.devBoxNum" 
                       @change="moduleChange(item.devBoxNum)"
                     >{{item.devBox}}</el-checkbox>    
                  </el-checkbox-group>
                </el-col>
                <el-col :span="6" :offset="1" >
                  <el-input v-for="(list,index)  in devBox" :key="list.devBoxNum" style="margin-bottom:5px"
                    size="mini" :name="list.devBoxNum" :disabled="isDisabled(list.devBoxNum,index)" 
                    @blur="isNum"
                    placeholder="请输入箱子数"
                    v-model="addModel.boxCount[''+list.devBoxNum]"  :ref="list.devBoxNum"></el-input>
                </el-col> 
                <el-col :span="6" >
                  <div v-for="item in devBox" :key="item.devBoxNum" style="margin-bottom:5px;margin-left:5px">个</div >
                </el-col>                    
              </el-form-item>
              </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-row style="margin:20px 0;text-align:right">
          <el-button size="mini" @click="isShow=false">取消</el-button>                        
          <el-button type="primary" size="mini" @click="modelAdd">确认</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import devModelAdd from "@/message/deviceInfoManage/model/dev-model-add";

export default {
  data() {
    let checkBoxCount = (rule, value, callback) => {
      if (value != "") {
        let reg = /^{\d}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      } else {
        callback();
      }
    };
    return {
      loading:false,
      boxCountRules:false,//设备箱数正则校验
      devBrandInfo:[],//设备厂商信息
      devBrandInfoList :[],
      devTypeList:[],
      devForm: [],
      addModel: {
        devForm: [],
        devType: "",
        devModel:"",
        devBrand: "",  
        boxCount:[],      
      },
      boxCount:[],
      devModule: [],
      devType: [],
      checkList: [], //模块
      devBox: [], //设备箱
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
    isDisabled(val){
      if(this.devBoxSel.indexOf(val)>-1){
        return false
      }else{
        this.addModel.boxCount[''+val]=''
        return true
      }
    },
    openCreate(){
      //初始化设备厂商
      this.boxCountRules=false;
      this.devBoxSel=[];
      this.loading=true;
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "devBrand" },{ spinnerName: "devType" },{ spinnerName: "devBox" },{ spinnerName: "devForm" },{ spinnerName: "devModule" }];
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.devBrandInfo = response.RSP_BODY.devBrandInfoSpinner;
            this.devType = response.RSP_BODY.deviceTypeSpinner;
            this.addModel.boxCount=[];
            this.devBox = response.RSP_BODY.devBoxInfoSpinner;
            this.devForm = response.RSP_BODY.devFormSpinner;      
            this.devBox.forEach((element,index )=> {
              this.devBoxSel.push(element.devBoxNum)
            });
            this.devModule = response.RSP_BODY.devModuleInfoSpinner;
            this.devBrandInfoList = Object.assign([], this.devBrandInfo );
            this.devTypeList= Object.assign([], this.devType );
            this.addModel.devForm=this.createModel.devForm;
            this.devFormChange(this.addModel.devForm)
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
    isNum(val){//判断设备箱是否为数字
      val.target.style.border="1px solid #dcdfe6"  //正常情况下的颜色
      if (val.srcElement.value!="") {
        let reg=/^[0-9]+$/
        if(reg.test(val.srcElement.value) && Number(val.srcElement.value)<=10){//输入的是<=10的数字
          this.boxCountRules=true //校验通过         
          return true   
        }else{
          val.srcElement.value="" //清楚错误的值
          this.addModel.boxCount[val.srcElement.name]=""  //清除和该文本框绑定的值
          this.$message({
            type:"warning",
            message:"请输入小于10的数字！"
          })
          val.srcElement.focus()
          val.target.style.border="1px solid #f56c6c" //改变文本框边框的颜色
          this.boxCountRules=false //校验不通过
          return false
        }
      }else{   
        val.target.style.border="1px solid #f56c6c"     
        this.boxCountRules=false            
      }
    },
    modelAdd() {//添加
      let boxCount=[];
      for (let i = 0; i < this.devBoxSel.length; i++) {
        boxCount.push(this.addModel.boxCount[this.devBoxSel[i]])
        if (!this.addModel.boxCount[this.devBoxSel[i]]) {
          this.$refs[this.devBoxSel[i]][0].$refs.input.style.border="1px solid #f56c6c"
        }
      }
      this.$refs["addModel"].validate(valid => {
        if (valid && this.boxCountRules) {
           this.loading=true;
          let resBody = new devModelAdd();
          resBody.data.devForm = this.addModel.devForm;
          resBody.data.devType = this.addModel.devType;
          resBody.data.devModuleId = this.devModuleNum.join("|");
          resBody.data.devModel = this.addModel.devModel;
          resBody.data.brandId =  this.addModel.devBrand;
          resBody.data.devBoxId =this.devBoxSel.join("|");
          resBody.data.devBoxCount =boxCount.join("|");
          request(resBody)
            .then(response => {
               if (response.SYS_HEAD.ReturnCode === "000000") {
                this.$message({
                      type: "success",
                      message: "设备模型创建成功!"
                });
                this.loading=false;
                this.isShow=false
                this.$emit("refreshTableModel")
              }else{
                this.loading=false;                
              }
            })
            .catch(error => {
              this.loading=false;              
              console.log(error);
          });
        }else {
          this.loading=false;
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      })
    },
    clearForm(firstList, ...lists) {//重置表单数据
      this.devModuleNum= []
      this.$refs["addModel"].clearValidate()//清楚表单验证
      this.$refs["addModel"].resetFields()//清楚表单验证
       for (let i = 0; i < this.devBoxSel.length; i++) {
          if (!this.addModel.boxCount[this.devBoxSel[i]]) {
            this.$refs[this.devBoxSel[i]][0].$refs.input.style.border="1px solid #dcdfe6"
          }
      }
    },
     devFormChange(val) {
      //设备形式值改变事件
         this.devTypeList=[]
          for (let i = 0; i < this.devType.length; i++) {
            if(val== this.devType[i].devForm){
              this.devTypeList.push(this.devType[i]);
            }
        
          }
    },
  },
  props: {
    createModel: Object
  },
  computed: {
    isShow: {
      get: function() {
        return this.createModel.isShow;
      },
      set: function(newValue) {
        this.createModel.isShow = newValue;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.modelBox{
  height:125px;
  overflow: auto;
}
.modelBox::-webkit-scrollbar{
  display:none
}
.content {
  display: flex;
  flex-direction: column;
}
.el-checkbox {
  margin-left: 5px;
}

</style>


