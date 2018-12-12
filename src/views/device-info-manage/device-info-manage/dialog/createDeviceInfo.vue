<template>
  <el-dialog title='新增设备信息' :visible.sync='isShow' width='720px' @open="openDevInfo"
    :close-on-click-modal=false center
      @close='clearForm("this.devInfoBaseAdd","devInfoBronAdd","devInfoRunAdd")'>
    <div v-loading="loading">
      <el-steps finish-status="success" :active='active' align-center>
        <el-step title='设备基本信息'></el-step>
        <el-step title='设备机构信息'></el-step>
        <el-step title='设备运行信息'></el-step>            
      </el-steps>
      <div class="content" v-show='active==0'>
        <el-card >
          <el-form ref='devInfoBaseAdd' :model='devInfoBaseAdd' :rules="rulesBase" label-width="90px" size='mini' label-position='left'>
            <!-- <el-row class='devAddHeight'>
                <el-col :span="11">
                      <el-form-item label='设备编号:' prop='devNum'>
                              <el-input  v-model='devInfoBaseAdd.devNum' placeholder="设备编号由系统生成" disabled>
                              </el-input>
                      </el-form-item>
                  </el-col>
            </el-row> -->
            <el-row class='devAddHeight'>
              <el-col :span="12">
                <el-form-item label='设备形式:' prop='devForm'>
                        <el-radio-group  v-model='devInfoBaseAdd.devForm'  @change='devFormChange' disabled>
                          <el-radio v-for="item in devForm" :key="item.id" :label='item.devForm' border>{{item.devFormName}}</el-radio>
                        </el-radio-group>
                </el-form-item>
                </el-col>
            
            </el-row>
            <el-row>
              <el-col :span='11'>
                <el-form-item label='设备分类 :' prop='SortAdd'>
                  <el-select v-model="devInfoBaseAdd.SortAdd" placeholder="请选择设备分类"  @change='cChange'>
                    <el-option
                    v-for="item in devSort"
                    :key="item.value"
                    :label="item.devAssortmentName"
                    :value="item.devAssortmentId"
                    :disabled="item.disabled">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class='devAddHeight'>
              <el-col :span='23'>
                <el-form-item label="C端程序 :" prop='cProcAdd'>
                    <el-input disabled v-model='devInfoBaseAdd.cProcAdd'></el-input>
                </el-form-item>
              </el-col>                          
            </el-row>
            <el-row class='devAddHeight'>
              <el-col :span='23'>
                <el-form-item label="外   设 :" prop='deviceAdd'>
                    <el-input type='textarea' :rows='1' disabled v-model='devInfoBaseAdd.deviceAdd'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
              <el-row class='devAddHeight'>
                <el-col :span='11'>
                  <el-form-item label='设备类型:' prop='devTypeAdd1'>
                      <el-input disabled v-model='devInfoBaseAdd.devTypeAdd1'></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='11' :offset="1">
                  <el-form-item label='设备型号:' prop='devModelAdd'>
                      <el-input disabled v-model='devInfoBaseAdd.devModelAdd'></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row class='devAddHeight'>
              <el-col :span='11'>
                <el-form-item label="制造厂商:" prop='devFactaryAdd'>
                      <el-input disabled v-model='devInfoBaseAdd.devFactaryAdd'></el-input>
                </el-form-item>
              </el-col>
            
              <!-- <el-col :span='11' :offset="1">
                <el-form-item label="厂商联系人:" prop='devLinkmanAdd'>
                    <el-input disabled v-model='devInfoBaseAdd.devLinkmanAdd'></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row class='devAddHeight'>
              <el-col :span='23'>
                  <el-form-item label="设备箱:">
                  <el-col >
                    <el-input type='textarea' :rows='1' disabled v-model='devInfoBaseAdd.devBox'></el-input>       
                  </el-col>       
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <div class="footer">
          <el-button @click='nextClick' type='primary' size="mini">下一步</el-button>
        </div>
      </div>
      <div class="content" v-show='active===1'>
          <el-card style="overflow:visible">
              <el-form :model='devInfoBronAdd' ref='devInfoBronAdd' :rules="rulesBrno" size='small' label-width="110px" label-position='left'>
                  <el-row class='devAddHeight'>
                      <el-col :span="12">
                          <el-form-item label="机构 :" prop='brnoAdd'>
                            <select-tree  :single-check="true"  v-model="devInfoBronAdd.brnoAdd" ref="tree" @select-check="brnoChange"
                              :tree-data="brno"
                              :props="{id:'branchId',label:'branchName',children:'childBranch'}"
                            ></select-tree>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row class='devAddHeight' :gutter="10">
                      <el-col :lg='12' :md="24">
                          <el-form-item label="网点地址:" prop='devBranchAddress'>
                              <el-input disabled v-model='devInfoBronAdd.devBranchAddress'></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :lg='12' :md="24" >
                          <el-form-item label="联系人电话:" prop='devBranchPhone'>
                              <el-input disabled v-model='devInfoBronAdd.devBranchPhone'></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row class='devAddHeight' :gutter="10">
                        <el-col :lg='12' :md="24">
                          <el-form-item label="手机号:" prop='devBranchTel'>
                              <el-input :options='cSort' disabled v-model='devInfoBronAdd.devBranchTel'></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :lg='12' :md="24" >
                          <el-form-item label="柜员号:" prop='devBranchTellNo'>
                              <el-input disabled v-model='devInfoBronAdd.devBranchTellNo'></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <!-- <el-row class='devAddHeight'>
                      <el-col  :lg='12' :md="24">
                          <el-form-item label="设备维护用户:" prop='devBrnoPzAdd'>
                            <el-select v-model="devInfoBronAdd.devBrnoPzAdd" placeholder="请选择设备维护用户">
                              <el-option
                              v-for="item in cSort"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                              :disabled="item.disabled">
                              </el-option>
                            </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row> -->
              </el-form>
          </el-card>
          <div class="footer">
            <el-button @click='back' type='primary' size="mini" >上一步</el-button>
            <el-button @click='nextClick' type='primary' size="mini" >下一步</el-button>
          </div>
      </div>
      <div class="content" v-show='active===2'>
          <el-card >
              <el-form :model='devInfoRunAdd' ref='devInfoRunAdd' :rules="rulesRun" size='small' label-width="110px" label-position="left">
            
                  <el-row class='devAddHeight' :gutter="100">
                      <el-col :lg='11' :md="24">
                          <el-form-item label="服务开始时间:" prop="startTime">
                              <el-time-picker value-format="HHmmss" v-model='devInfoRunAdd.startTime' style='width:180px;'></el-time-picker>
                          </el-form-item>
                      </el-col>
                      <el-col :lg='11' :md="24">
                          <el-form-item label="服务结束时间:" prop="endTime">
                              <el-time-picker value-format="HHmmss" v-model='devInfoRunAdd.endTime' style='width:180px;'></el-time-picker>
                          </el-form-item>
                      </el-col>  
                  </el-row>
                    <el-row class='devAddHeight' :gutter="40">
                      <el-col :lg='12' :md="24">
                          <el-form-item label="设备IP:" prop="devIp">
                              <el-input  v-model='devInfoRunAdd.devIp'  placeholder="请输入设备IP"></el-input>                            
                          </el-form-item>
                      </el-col>
                      <el-col :lg='12' :md="24">
                          <el-form-item label="虚拟柜员号:" prop="virtualTeller">
                              <el-input  v-model='devInfoRunAdd.virtualTeller' placeholder="请输入虚拟柜员"></el-input>                            
                          </el-form-item>
                      </el-col>  
                  </el-row>
              </el-form>
          </el-card>
          <div class="footer" >
            <el-button @click='back' type='primary'  size="mini">上一步</el-button>
            <el-button @click='sure' type='primary'  size="mini" >确 定</el-button>
          </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import devAdd from "@/message/deviceInfoManage/devInfo/dev-info-add";
import selectTree from "@/components/selectTree2/";

export default {
  components: { selectTree },
  data() {
    let validatorIp = (rule, value, callback) => { //自定义表单验证 校验IP地址
      if (value != "") {
        const reg = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的设备IP"));
        }
      } else {
        callback();
      }
    };
    return {
      //   active:0,
      loading: false,
      devBox: undefined, //设备箱
      brno: [],//机构下拉框
      devSort: [],//设备分类
      devSortList: [],//设备分类，用于保存数据，做筛选
      cSort: [],//手机号
      devForm: [],//设备形式
      startTime: "00:00:00",//服务开始时间
      endTime: "00:00:00",//服务结束时间
      devInfoBaseAdd: {//设备基本信息表单数据
        devForm: "",
        devNum: "",
        SortAdd: "",
        cProcAdd: "",
        deviceAdd: "",
        devTypeAdd1: "",
        devModelAdd: "",
        devFactaryAdd: "",
        devBox: ""
      },
      devInfoBronAdd: {
        brnoAdd: [],
        devBranchAddress: "",
        devBranchPhone: "",
        devBranchTel: "",
        devBranchTellNo: ""
      },
      devInfoRunAdd: {
        startTime: "",
        endTime: "",
        virtualTeller: "",
        devIp: ""
      },
      rulesBase: {
        SortAdd: [
          { required: true, message: "请选择设备分类", trigger: "change" }
        ]
      },
      rulesBrno: {
        brnoAdd: [{ required: true, message: "请选择机构", trigger: "change" }]
        // devBrnoPzAdd: [
        //   { required: true, message: "请选择设备维护用户", trigger: "blur" }
        // ],
      },
      rulesRun: {
        startTime: [
          { required: true, message: "请选择服务开始时间", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "请选择服务结束时间", trigger: "change" }
        ],
        devIp: [
          { required: true, message: "请输入设备IP ", trigger: "blur" },
          { require: false, validator: validatorIp, trigger: "blur" }
        ],
        virtualTeller: [
          { required: true, message: "请输入虚拟柜员号 ", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    brnoChange(val) { //机构下拉框选中后，回显内容，目前只有地址和电话
      this.devInfoBronAdd.devBranchAddress = val[0].branchAddress;
      this.devInfoBronAdd.devBranchPhone = val[0].branchPhone;
    },
    devFormChange(val) {
      this.devSort = [];
      this.devSortList.forEach(element => {
        element.devForm == val ? this.devSort.push(element) : "";
      });
    },
    openDevInfo() {
      if (this.$refs["devInfoBronAdd"] != undefined) { //清楚机构验证
        this.$refs["devInfoBronAdd"].clearValidate(); 
        this.$refs["devInfoBronAdd"].resetFields();
      }
      this.loading = true;
      this.devInfoBronAdd.brnoAdd = [];
      let resBody = new devRunList();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "devAssortment" },
        { spinnerName: "branch" }
      ];
      request(resBody)
        .then(response => {
          this.loading = false;
          this.brno = response.RSP_BODY.branchSpinner;
          this.devForm = response.RSP_BODY.devFormSpinner;
          this.devSort = response.RSP_BODY.deviceAssortmentSpinner;
          this.devSortList = Object.assign([], this.devSort);
          this.devInfoBaseAdd.devForm = this.option.devForm;
          this.devFormChange(this.devInfoBaseAdd.devForm);
        })
        .catch(error => {
          console.error("错误信息", error);
        });
    },
    back() {
      if (this.option.active >= 1) {
        this.active--;
      }
    },
    nextClick() {
      if (this.option.active == 0) {
        this.$refs["devInfoBaseAdd"].validate(valid => {
          if (valid) {
            this.active++;
            this.$refs["devInfoBaseAdd"].clearValidate();
            // this.$refs["devInfoBaseAdd"].resetFields();
          }
        });
      } else if (this.option.active == 1) {
        this.$refs["devInfoBronAdd"].validate(valid => {
          if (valid) {
            this.active++;
            this.$refs["devInfoBronAdd"].clearValidate();
            // this.$refs["devInfoBronAdd"].resetFields();
          }
        });
      }
    },
    sure() {
      this.$refs["devInfoRunAdd"].validate(valid => {
        if (valid) {
          this.isShow = false;
          let resBody = new devAdd();
          resBody.data.devAssortmentId = this.devInfoBaseAdd.SortAdd;
          resBody.data.branchId = this.devInfoBronAdd.brnoAdd[0];
          // resBody.data.devManageUserId = this.devInfoBronAdd.devBrnoPzAdd;
          resBody.data.serverStartTime = this.devInfoRunAdd.startTime;
          resBody.data.serverEndTime = this.devInfoRunAdd.endTime;
          resBody.data.devIp = this.devInfoRunAdd.devIp;
          resBody.data.virtualTeller = this.devInfoRunAdd.virtualTeller;
          resBody.data.devNum = this.devInfoBaseAdd.devNum;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.$message({
                  type: "success",
                  message: "设备创建成功!"
                });
                this.isShow = false;
                this.$refs["devInfoRunAdd"].clearValidate();
                this.$emit("refreshTable");
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    cChange(val) {
      for (let i = 0; i < this.devSort.length; i++) {
        if (val == this.devSort[i].devAssortmentId) {
          this.devInfoBaseAdd.cProcAdd = this.devSort[i].devAssortmentCppInfo;
          this.devInfoBaseAdd.deviceAdd = this.devSort[
            i
          ].devAssortmentModuleInfo;
          this.devInfoBaseAdd.devTypeAdd1 = this.devSort[i].devType;
          this.devInfoBaseAdd.devModelAdd = this.devSort[i].devModel;
          this.devInfoBaseAdd.devFactaryAdd = this.devSort[i].brandName;
          // this.devInfoBaseAdd.devFactaryAdd = this.devSort[i].devAssortmentCppInfo;
          this.devInfoBaseAdd.devBox = this.devSort[i].devAssortmentBoxInfo;
        }
      }
    },
    clearForm(firstList, ...lists) { // 重置表单数据
      if (this.$refs["devInfoBaseAdd"] != undefined) {
        this.$refs["devInfoBaseAdd"].clearValidate(); //清楚表单验证
        this.$refs["devInfoBaseAdd"].resetFields();
      }
      if (this.$refs["devInfoBronAdd"] != undefined) {
        this.$refs["devInfoBronAdd"].clearValidate(); //清楚表单验证
        this.$refs["devInfoBronAdd"].resetFields();
      }
      if (this.$refs["devInfoRunAdd"] != undefined) {
        this.$refs["devInfoRunAdd"].clearValidate(); //清楚表单验证
        this.$refs["devInfoRunAdd"].resetFields();
      }
    }
  },
  props: {
    option: Object
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newValue) {
        this.option.isShow = newValue;
      }
    },
    active: {
      get: function() {
        return this.option.active;
      },
      set: function(newValue) {
        this.option.active = newValue;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog .el-dialog__body {
  padding: 20px 27px 20px !important;
}
.content {
  display: flex;
  flex-direction: column;
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .el-card {
      overflow: inherit;
    }
  }
}
</style>


