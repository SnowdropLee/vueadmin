<template>
  <el-dialog title='新增预警策略' :visible.sync='isShow' width='900px'  :lock-scroll=false
              :close-on-click-modal=false @close='clearForm("queryForm")' 
              @open="openStrage"
             >
    <div  v-loading="loading">
      <div  class="detailInfo" >
          <el-card class='type-info-box-card'>
            <el-row>
              <el-col :lg='24'>
                    <el-form ref='queryForm' size='mini' :model="queryForm" label-width="140px" :rules="rules" label-position="left">
                      <el-row :gutter="20">
                          <el-col :span='12'>
                                <el-form-item label='策略类型:' prop="strategyType"  v-loading="loading">
                                  <!-- @change="strategyTypeChange" 暂时只支持策略类型为设备得 -->
                                  <el-select v-model="queryForm.strategyType" clearable disabled
                                  placeholder="请选择策略类型">
                                    <el-option
                                    v-for="item in strategyType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                          </el-col>
                          <el-col :span='12' >
                                <el-form-item label='策略属性:' prop="strategyDes">
                                  <el-select v-model="queryForm.strategyDes" multiple clearable placeholder="请选择策略属性">
                                    <el-option
                                    v-for="item in strategyDes"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.key"
                                  >
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                          </el-col>
                      </el-row>
                        <!--  <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                                <el-form-item label='表达式:'  prop="expression">
                                  <el-select v-model="queryForm.expression" clearable placeholder="请选择表达式">
                                    <el-option
                                    v-for="item in expression"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                          </el-col>
                          <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                                <el-form-item label='策略值:' prop="strategyValue">
                                    <el-input v-model='queryForm.strategyValue'  
                                    placeholder="请输入策略值"  ></el-input>
                                </el-form-item>
                          </el-col>
                          <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                                <el-form-item label='数据收集开始时间:' prop="collectSTime">
                                  <el-time-picker
                                  style="width:100%"
                                    value-format="HHmmss"
                                    v-model="queryForm.collectSTime"
                                    placeholder="请选择时间">
                                  </el-time-picker>
                                </el-form-item>
                          </el-col>
                          <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                                <el-form-item label='数据收集结束时间:' prop="collectETime">
                                    <el-time-picker
                                    style="width:100%"
                                    value-format="HHmmss"
                                    v-model="queryForm.collectETime"
                                    placeholder="请选择时间">
                                  </el-time-picker>
                                </el-form-item>
                          </el-col> -->
                        <el-row :gutter="20">
                          <el-col :span='12' >
                                <el-form-item label='异常排查开始时间:' prop="errorSTime">
                                    <el-time-picker
                                    style="width:100%"
                                    value-format="HHmmss"
                                    v-model="queryForm.errorSTime"
                                    placeholder="请选择时间">
                                  </el-time-picker>
                                </el-form-item>
                          </el-col>
                          <el-col :span='12'>
                                <el-form-item label='异常排查结束时间:' prop="errorETime">
                                  <el-time-picker
                                  style="width:100%"
                                    value-format="HHmmss"
                                    v-model="queryForm.errorETime"
                                    placeholder="请选择时间">
                                  </el-time-picker>
                                </el-form-item>
                          </el-col>
                          <el-col :span='12'>
                                <el-form-item label='预警时间间隔:' prop="timeInterval">
                                    <el-input v-model='queryForm.timeInterval'  
                                    placeholder="请输入时间间隔（秒）"  ></el-input>
                                </el-form-item>
                          </el-col>
                          <el-col :span='12'>
                                <el-form-item label='预警通知方式:' prop="notice">
                                  <el-checkbox-group v-model="queryForm.notice">
                                    <el-checkbox label="1">短信</el-checkbox>
                                    <el-checkbox label="2">邮件</el-checkbox>
                                  </el-checkbox-group>
                                </el-form-item>
                          </el-col>
                          <el-col :span='12'>
                            <el-form-item label='联系人:'  prop="contact">
                              <el-select v-model="queryForm.contact" clearable multiple :multiple-limit="2" placeholder="请选择联系人">
                                <el-option
                                v-for="item in contact"
                                :key="item.umId"
                                :label="item.umName"
                                :value="item.umId"
                                :disabled="item.disabled">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          </el-row>
                </el-form>
              </el-col>
            </el-row>
          </el-card>
      </div>
      <div slot="footer"  style="margin:10px 0;text-align:right">
            <el-button size="mini"  @click="isShow=false">取消</el-button>
            <el-button type='primary' size='mini'  @click="submit">确定</el-button>
      </div>
    </div>
   </el-dialog>
</template>

<script>
import request from "@/utils/request";
import alertAdd from "@/message/alertManage/warning/alert-add";
import strategyTpeyList from "@/message/alertManage/warning/alert-type-list";
import strategyPropList from "@/message/alertManage/warning/alert-prop-list";
import contactList from "@/message/alertManage/message/message-contact";

export default {
  data() {
    return {
      loading: false,
      deviceShow: false,
      strategyType: [ //策略类型下拉框
        { label: "设备", value: "DeviceAlert" },
        { label: "业务", value: "BusinessAlert" }
      ],
      strategyDes: [],  //策略属性下拉框
      // strategyDesCopy: [],
      contact: [], //联系人
      queryForm: {  //表单数据
        strategyType: "DeviceAlert",
        strategyDes: [],
        errorSTime: "",
        errorETime: "",
        timeInterval: "",
        notice: [],  //预警通知方式
        contact: []  //联系人
      },
      rules: {  //表单校验规则
        strategyType: [
          { required: true, message: "请选择策略类型", trigger: "blur" }
        ],
        strategyDes: [
          { required: true, message: "请选择策略属性", trigger: "change" }
        ],
        errorSTime: [
          { required: true, message: "请选择异常排查开始时间", trigger: "blur" }
        ],
        errorETime: [
          { required: true, message: "请选择异常排查结束时间", trigger: "blur" }
        ],
        timeInterval: [
          { required: true, message: "请输入预警时间间隔", trigger: "blur" }
          // { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        notice: [
          { required: true, message: "请选择预警通知方式", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请选择联系人！", trigger: "change" }
        ]
      }
    };
  },
  props: { option: Object },
  methods: {
    openStrage() { 
      //初始化下拉框
      this.clearForm();
      this.strategyPropList();
      let resBody1 = new contactList();
      request(resBody1)
        .then(response => {
          this.contact = response.RSP_BODY.resultSet;
        })
        .catch(error => {
          console.error("错误信息", error);
        });
    },
    // async strategyTpeyList(){
    //   let resBody = new strategyTpeyList(); //这里需要改
    //   let response=await request(resBody)
    //   if (response.SYS_HEAD.ReturnCode == "000000") {
    //     // this.strategyType = response.RSP_BODY.resultSet;
    //   } else {
    //     this.$message({
    //       type: "error",
    //       message:
    //         "请求失败，错误码:" +
    //         response.SYS_HEAD.ReturnCode +
    //         "，错误信息：" +
    //         response.SYS_HEAD.ReturnMessage
    //     });
    //   }
    // },
    async strategyPropList() { 
      let resBody = new strategyPropList(); 
      resBody.data.policyType = "DeviceAlert";
      this.loading = true;
      let response = await request(resBody);
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.loading = false;
        this.strategyDes = response.RSP_BODY.resultSet;
        // console.log(this.strategy)
      } else {
        this.loading = false;
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    // strategyTypeChange(val) {
    //   //策略类型值改变时间控制组件的显示
    //   if (val == "DeviceAlert") {
    //     this.deviceShow = true;
    //     this.strategyDes = Object.assign([], this.strategyDesCopy);
    //   } else if (val == "BusinessAlert") {
    //     this.deviceShow = false;
    //     this.strategyDes = [];
    //   } else {
    //     this.deviceShow = false;
    //     this.strategyDes = [];
    //   }
    // },
    submit() {
      //添加策略事件
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let resBody = new alertAdd();
          resBody.data.type = this.queryForm.strategyType;
          resBody.data.policyProperty = this.queryForm.strategyDes.join(",");
          resBody.data.execute_Starttime = this.queryForm.errorSTime;
          resBody.data.execute_Endtime = this.queryForm.errorETime;
          resBody.data.working_Interval = this.queryForm.timeInterval;
          resBody.data.notifyMethod = this.queryForm.notice.join(",");
          resBody.data.umId = this.queryForm.contact;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "预警策略创建成功!"
                });
                this.isShow = false;
                this.$emit("refreshTable");
              } else {
                this.loading = false;
              }
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
            });
        }
      });
    },
    clearForm(item) {
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields();
        this.$refs.queryForm.clearValidate();
      }
    }
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newValue) {
        this.option.isShow = newValue;
      }
    }
  },
  // mounted() {
  //   window.addEventListener("scroll", this.handleScroll);
  // }
};
</script>

<style lang="scss" scope>
.isShow {
  display: none;
}
.returnBtn {
  width: 50px;
  height: 50px;
  background: #000;
  opacity: 0.5;
  position: fixed;
  right: 45px;
  bottom: 53px;
  border-radius: 3px;
  text-align: center;
  padding-top: 15px;
}
.returnBtn:hover {
  opacity: 0.9;
}
.modelMargin {
  margin: 5px;
  .el-card__header {
    height: 65px;
  }
}
#returnBtnTop {
  height: 50px;
  background: #409eff;
  width: 100%;
  transition: all 0.3s;
}
.editClass {
  input.el-input__inner {
    border: none;
    background: rgba(0, 0, 0, 0) !important;
  }
}
.inputWidth100 {
  width: 100%;
}
</style>
