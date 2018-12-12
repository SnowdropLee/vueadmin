<template>
  <el-dialog title='新增C端程序' :visible.sync='isShow' width='600px' @open="openCreate"
    :close-on-click-modal=false  @close='clearForm'>
    <div v-loading="loading">
      <el-card>
        <el-form ref='cProcedureAdd' :model='cProcedureAdd' :rules="rules" label-width="110px" size='small' label-position='left'>
          <el-row class='devAddHeight'>
            <el-col >
              <el-form-item label='C端程序名称:' prop='cProgramName'>
                <el-input  v-model='cProcedureAdd.cProgramName' placeholder="请输入C端程序名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='devAddHeight'>
            <el-col>
              <el-form-item label='设备形式 :' prop='devForm'>
                <el-radio-group  v-model='cProcedureAdd.devForm' disabled  @change='devFormChange'>
                  <el-radio v-for="item in devForm" :key="item.id" :label='item.devForm' border>{{item.devFormName}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='devAddHeight'>
            <el-col>
              <el-form-item label='C端程序基版:' prop='cProgramBasicId'>
                <el-select v-model="cProcedureAdd.cProgramBasicId" placeholder="请选择C端程序基版" @change='cChange' >
                  <el-option
                    v-for="item in cProcedureBase"
                    :key="item.value"
                    :label="item.cProgramBasicName"
                    :value="item.cProgramBasicId"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='devAddHeight'>
            <el-col >
              <el-form-item label="开发厂商:" prop='serviceProvider'>
                <el-input disabled v-model="cProcedureAdd.serviceProvider"></el-input>
              </el-form-item>
            </el-col>                          
          </el-row>
          <el-row class='devAddHeight'>
            <el-col >
              <el-form-item label="运行环境:" prop='installEnvironment'>
                <el-input  disabled v-model="cProcedureAdd.installEnvironment"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-row style="margin:20px 0;text-align:right">
        <el-button size="mini" @click="isShow=false">取消</el-button>                        
        <el-button type="primary" size="mini" @click="cProcAdd">确认</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import cProcedureadd from "@/message/deviceInfoManage/cProgram/c-procedure-add";

export default {
  data() {
    return {
      loading:false,
      devForm: [],
      cProcedureBase: [],  //C端程序基板下拉列表
      cProcedureBaseList:[],
      devForm: [],
      cProcedureAdd: {
        cProgramName: "",
        cProgramBasicId: "",
        devForm: []
      },
      rules: {
        cProgramName: [
          { required: true, message: "C端程序名称必填！", trigger: "blur" },
          {
            max: 200,
            message: "C端程序名称必须少于200个字符！",
            trigger: "blur"
          }
        ],
        cProgramBasicId: [
          { required: true, message: "C端程序基版必填！", trigger: "change" }
        ],
        devForm: [
          { required: true, message: "设备形式必填！", trigger: "blur" }
        ]
      },
    };
  },
  methods: {
    devFormChange(val) {
      this.cProcedureBase = [];
      this.cProcedureBaseList.forEach(element => {
        element.devForm == val ? this.cProcedureBase.push(element) : "";
      });
    },
    openCreate() {
      //初始化设备形式
      this.loading=true;
      let resBody = new devRunList();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "cProgramBasic" }
      ];
      request(resBody)
        .then(response => {
          this.loading=false;
          this.devForm = response.RSP_BODY.devFormSpinner;
          this.cProcedureBase = response.RSP_BODY.cProgramBasicSpinner;
          this.cProcedureBaseList=Object.assign([],this.cProcedureBase)
          this.cProcedureAdd.devForm=this.createCProcedure.devForm;
          this.devFormChange(this.cProcedureAdd.devForm)
        })
        .catch(error => {
          this.loading=false;          
          console.error("²éÑ¯´íÎó", error);
        });
    },
    cProcAdd() { //添加C端程序
        this.$refs["cProcedureAdd"].validate(valid => {
        if (valid) {
          this.loading=true;
          let resBody = new cProcedureadd();
          resBody.data.devForm = this.cProcedureAdd.devForm[0];
          resBody.data.cProgramName = this.cProcedureAdd.cProgramName;
          resBody.data.cProgramBasicId = this.cProcedureAdd.cProgramBasicId;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading=false;                
                this.$message({
                  type: "success",
                  message: "C端程序创建成功!"
                });
                this.isShow = false;
                this.$emit("refreshTableC");
              }else{
                this.loading=false;                                
              }
            })
            .catch(error => {
              this.loading=false;                              
              console.log(error);
            }); 
            } else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      });


    },
    cChange(val) { //C端程序change的时候回显内容
      this.cProcedureBase.forEach(element => {
        if (element.cProgramBasicId == val) {
          this.cProcedureAdd.installEnvironment = element.installEnvironment;
          this.cProcedureAdd.serviceProvider = element.serviceProvider;
        }
      });
    },
    clearForm(firstList, ...lists) {
      //重置表单数据
      // this.cProcedureAdd = {
      //   cProgramName: "",
      //   cProgramBasicId: "",
      //   devForm: []
      // };      
      this.$refs["cProcedureAdd"].clearValidate()//清楚表单验证 要先清除验证再重置表单数据，要不然会清不掉验证
      this.$refs["cProcedureAdd"].resetFields()//清楚表单验证      
      // this.devInfoRunAdd = {};

    }
  },
  props: {
    createCProcedure: Object
  },
  computed: {
    isShow: {
      get: function() {
        return this.createCProcedure.isShow;
      },
      set: function(newValue) {
        this.createCProcedure.isShow = newValue;
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
.content {
  display: flex;
  flex-direction: column;
}
</style>


