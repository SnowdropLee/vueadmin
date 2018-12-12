<template>
   <el-dialog title='修改C端程序' :visible.sync='isShow' width='600px' @open="openUpdate"
      :close-on-click-modal=false  @close='clearForm'>
    <div v-loading="loading">
      <el-card>
        <el-form ref='cProcedureModList' :model='cProcedureModList'  :rules="rules"  label-width="110px" size='small' label-position='left'>
          <el-row class='devAddHeight'>
            <el-col>
              <el-form-item label='C端程序名称:' prop='cProgramName'>
                <el-input  v-model='cProcedureModList.cProgramName' placeholder="请输入C端程序名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='devAddHeight'>
            <el-col>
              <el-form-item label='设备形式 :' prop='devForm'>
                <el-radio-group  v-model='cProcedureModList.devForm' disabled size="mini">
                  <el-radio v-for="item in devForm" :key="item.id" :label='item.devForm' border>{{item.devFormName}}</el-radio>
                </el-radio-group>
                  <!-- <el-cascader v-model='cProcedureModList.devForm' :options="devForm"
                :props="{value:'devForm',label:'devFormName'}"
                placeholder='请输入设备形式' ></el-cascader> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class='devAddHeight'>
            <el-col>
              <el-form-item label='C端程序基版:' prop='cProgramBasicId'>
                <el-select v-model="cProcedureModList.cProgramBasicId" 
                @change='cChange'
                placeholder="请选择交易">
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
            <el-col>
              <el-form-item label="开发厂商:" prop='serviceProvider'>
                <el-input disabled v-model='cProcedureModList.serviceProvider'></el-input>
              </el-form-item>
            </el-col>                          
          </el-row>
          <el-row class='devAddHeight'>
            <el-col >
              <el-form-item label="运行环境:" prop='installEnvironment'>
                <el-input  disabled v-model='cProcedureModList.installEnvironment'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-row style="margin:20px 0;text-align:right">
        <el-button size="mini" @click="isShow=false">取消</el-button>
        <el-button type="primary" size="mini" @click="sureMod">确认</el-button>
      </el-row>
    </div>
   </el-dialog>
</template>

<script>
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import cProcedureMod from "@/message/deviceInfoManage/cProgram/c-procedure-modify";

export default {
  data() {
    return {
      loading: false,
      cProcedureBase: [],
      cProcedureBaseList: [],
      devForm: [],
      cProcedureModList: {
        cProgramName: "",
        devForm: [],
        cProgramBasicId: [],
        serviceProvider: "",
        installEnvironment: ""
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
      }
    };
  },
  created() {},
  methods: {
    devFormChange(val) {
      this.cProcedureBase = [];
      this.cProcedureBaseList.forEach(element => {
        element.devForm == val ? this.cProcedureBase.push(element) : [];
      });
    },
    openUpdate() {
      //初始化设备形式
      this.loading = true;
      let resBody = new devRunList();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "cProgramBasic" }
      ];
      request(resBody)
        .then(response => {
          this.loading = false;
          this.devForm = response.RSP_BODY.devFormSpinner;
          this.cProcedureBase = response.RSP_BODY.cProgramBasicSpinner;
          this.cProcedureBaseList = Object.assign([], this.cProcedureBase);
          this.cProcedureModList.devForm = this.modCProcedure.currentRow.devForm;
          this.devFormChange(this.cProcedureModList.devForm);
          this.cProcedureModList.cProgramBasicId = this.modCProcedure.currentRow.cProgramBasicId;
        })
        .catch(error => {
          this.loading = false;
          console.error("错误信息", error);
        });
      //回显数据
      this.cProcedureModList.cProgramName = this.modCProcedure.currentRow.cProgramName;
      this.cProcedureModList.serviceProvider = this.modCProcedure.currentRow.serviceProvider;
      this.cProcedureModList.installEnvironment = this.modCProcedure.currentRow.installEnvironment;
    },
    sureMod() {
      this.loading = true;
      let resBody = new cProcedureMod();
      resBody.data.cProgramID = this.modCProcedure.currentRow.cProgramID;
      resBody.data.devForm = this.cProcedureModList.devForm;
      resBody.data.cProgramName = this.cProcedureModList.cProgramName;
      resBody.data.cProgramBasicId = this.cProcedureModList.cProgramBasicId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: "C端程序修改成功!"
            });
            this.isShow = false;
            this.$emit("refreshTableC");
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    cChange(val) {
      this.cProcedureBase.forEach(element => {
        if (element.cProgramBasicId == val) {
          this.cProcedureModList.installEnvironment =
            element.installEnvironment;
          this.cProcedureModList.serviceProvider = element.serviceProvider;
        }
      });
    },
    clearForm(firstList, ...lists) {
      //重置表单数据
      this.cProcedureAdd = {};
      this.devInfoRunAdd = {};
      //   console.log(firstList);
      //   firstList={};

      //   console.log(firstList);
      //    var a=firstList.replace(/\"/g, "");
      //    a={};
      //    console.log(typeof(a))
      //   console.log(this.devInfoBaseAdd);
    }
  },
  props: {
    modCProcedure: Object
  },
  computed: {
    isShow: {
      get: function() {
        return this.modCProcedure.isShow;
      },
      set: function(newValue) {
        this.modCProcedure.isShow = newValue;
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
.footer {
  display: flex;
  justify-content: center;
}
</style>


