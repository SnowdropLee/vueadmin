<template>
  <el-dialog title='修改短信联系人' :visible.sync='isShow' width='900px'  :lock-scroll=false
    :close-on-click-modal=false @close='clearForm("queryForm")' 
    @open="openStrage"
  >
    <div  class="detailInfo" v-loading="loading">
      <el-card class='type-info-box-card' style="overflow:visible">
        <el-row>
          <el-col :lg='24'>
            <el-form ref='queryForm' size='mini' :model="queryForm" label-width="140px" :rules="rules" label-position="left">
              <el-row :gutter="20">
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='短信联系人工号:' prop="umId">
                      <el-input v-model='queryForm.umId'  
                      placeholder="请输入短信联系人工号"  ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='短信联系人姓名:' prop="uName">
                      <el-input v-model='queryForm.uName'  
                      placeholder="请输入短信联系人姓名"  ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='短信联系人电话:' prop="phoneNumber">
                      <el-input v-model='queryForm.phoneNumber'  
                      placeholder="请输入短信联系人电话"  ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='备用电话1:' prop="phoneNumber1">
                      <el-input v-model='queryForm.phoneNumber1'  
                      placeholder="请输入备用电话1"  ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='备用电话2:' prop="phoneNumber2">
                      <el-input v-model='queryForm.phoneNumber2'  
                      placeholder="请输入备用电话2"  ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='邮箱地址:' prop="emails">
                      <el-input v-model='queryForm.emails'  
                      placeholder="请输入邮箱地址"  ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='备用邮箱1:' prop="emails1">
                    <el-input v-model='queryForm.emails1'  
                    placeholder="请输入备用邮箱1"  ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='备用邮箱2:' prop="emails2">
                    <el-input v-model='queryForm.emails2'  
                    placeholder="请输入备用邮箱2"  ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='发送开始时间:' prop="startTime">
                    <el-time-picker
                    style="width:100%"
                      value-format="HHmmss"
                      v-model="queryForm.startTime"
                      placeholder="请选择时间">
                    </el-time-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='发送结束时间:' prop="endTime">
                      <el-time-picker
                      style="width:100%"
                      value-format="HHmmss"
                      v-model="queryForm.endTime"
                      placeholder="请选择时间">
                    </el-time-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :sm='12' :md='12' :lg='12' :class="{isShow:deviceShow}">
                  <el-form-item label='是否发送:'  prop="isSend">
                    <el-select v-model="queryForm.isSend" clearable placeholder="请选择">
                      <el-option
                      v-for="item in isSend"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12'>
                  <el-form-item label='机构号:' prop="branchId">
                    <select-tree :single-check="true"  v-model="queryForm.branchId" style="min-width:259px;"
                      :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno" :node-key="'branchId'" >
                    </select-tree> 
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :sm='12' :md='12' :lg='12'>
                  <el-form-item label='人员技能:' prop="role">
                    <el-checkbox-group v-model="queryForm.role">
                      <el-checkbox label="1">技术</el-checkbox>
                      <el-checkbox label="2">业务</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div slot="footer" >
      <el-button size="mini"  @click="isShow=false">取消</el-button>
      <el-button type='primary' size='mini'  @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import messageUpdate from "@/message/alertManage/message/message-update";
import selectTree from "@/components/selectTree2/";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
export default {
  components: { selectTree },
  data() {
    var validatorPhone = (rule, value, callback) => {
      if (value != "") {
        let regtel = /(^[1][3,4,5,7,8][0-9]{9}$)|(^[0]\d{2}[-]\d{7,8}$)/;
        let regPhone = /^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/;
        if (regtel.test(value) || regPhone.test(value)) {
          callback();
        } else {
          callback(new Error("请输入11位正确的联系电话"));
        }
      } else {
        callback();
      }
    };
    let validatorEmail = (rule, value, callback) => {
      if (value != "") {
        let reg = new RegExp(
          "^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$"
        );
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱"));
        }
      } else {
        callback();
      }
    };
    return {
      loading: false,
      deviceShow: false,
      isSend: [{ label: "是", value: "1" }, { label: "否", value: "0" }],
      strategyDes: [],
      strategyDesCopy: [],
      brno: [],
      queryForm: {
        umId: "",
        uName: "",
        phoneNumber: "",
        phoneNumber1: "",
        phoneNumber2: "",
        emails: "",
        emails1: "",
        emails2: "",
        startTime: "",
        endTime: "",
        isSend: "",
        branchId: [],
        role: []
      },
      rules: {
        umId: [
          { required: true, message: "请输入短信联系人工号", trigger: "blur" }
        ],
        uName: [
          { required: true, message: "请输入短信联系人姓名", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入短信联系人电话", trigger: "blur" },
          { required: false, validator: validatorPhone, trigger: "blur" }
        ],
        phoneNumber1: [
          { required: false, validator: validatorPhone, trigger: "blur" }
        ],
        phoneNumber2: [
          { required: false, validator: validatorPhone, trigger: "blur" }
        ],
        emails: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { required: false, validator: validatorEmail, trigger: "blur" }
        ],
        emails1: [
          { required: false, validator: validatorEmail, trigger: "blur" }
        ],
        emails2: [
          { required: false, validator: validatorEmail, trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请输入发送开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请输入发送结束时间", trigger: "blur" }
        ],
        isSend: [
          { required: true, message: "请选择是否发送", trigger: "blur" }
        ],
        branchId: [
          { required: true, message: "请选择机构号", trigger: "change" }
        ],
        role: [{ required: true, message: "请选择人员技能", trigger: "blur" }]
      }
    };
  },
  props: ["option", "currentSelect"],
  methods: {
    openStrage() {  //回显数据
      // this.queryForm=this.currentSelect[0]
      this.initList();
      for (var key in this.currentSelect[0]) {
        if (key == "phoneNumber") {
          let count = 0; //统计出现“,”的个数后续进行分支判断；
          var pos = this.currentSelect[0]["phoneNumber"].lastIndexOf(",");
          while (pos != -1) {
            count++;
            pos = this.currentSelect[0]["phoneNumber"].lastIndexOf(
              ",",
              pos - 1
            );
          }
          if (count == 0) {
            this.queryForm["phoneNumber"] = this.currentSelect[0][
              "phoneNumber"
            ];
          } else {
            if (count == 1) {
              var Idx = this.currentSelect[0]["phoneNumber"].indexOf(",");
              var len = this.currentSelect[0]["phoneNumber"].length;
              var TL = this.currentSelect[0]["phoneNumber"].slice(0, Idx);
              var TL1 = this.currentSelect[0]["phoneNumber"].slice(
                Idx + 1,
                len
              );
              this.queryForm["phoneNumber"] = TL;
              this.queryForm["phoneNumber1"] = TL1;
            } else {
              if (count == 2) {
                var len = this.currentSelect[0]["phoneNumber"].length;
                var Idx1 = this.currentSelect[0]["phoneNumber"].indexOf(",");
                var Idx2 = this.currentSelect[0]["phoneNumber"].lastIndexOf(
                  ","
                );
                var TL = this.currentSelect[0]["phoneNumber"].slice(0, Idx1);
                var TL1 = this.currentSelect[0]["phoneNumber"].slice(
                  Idx1 + 1,
                  Idx2
                );
                var TL2 = this.currentSelect[0]["phoneNumber"].slice(
                  Idx2 + 1,
                  len
                );
                this.queryForm["phoneNumber"] = TL;
                this.queryForm["phoneNumber1"] = TL1;
                this.queryForm["phoneNumber2"] = TL2;
              }
            }
          }
        } else {
          if (key == "emails") {
            //对邮件元素处理；首先获取“,”的个数后进行分支处理；
            let count = 0; //统计出现“,”的个数
            var pos = this.currentSelect[0]["emails"].lastIndexOf(",");
            while (pos != -1) {
              count++;
              pos = this.currentSelect[0]["emails"].lastIndexOf(",", pos - 1);
            }
            // console.log(count);
            if (count == 0) {
              this.queryForm["emails"] = this.currentSelect[0]["emails"];
            } else {
              if (count == 1) {
                var Idx = this.currentSelect[0]["emails"].indexOf(",");
                var len = this.currentSelect[0]["emails"].length;
                var EM = this.currentSelect[0]["emails"].slice(0, Idx);
                var EM1 = this.currentSelect[0]["emails"].slice(Idx + 1, len);
                this.queryForm["emails"] = EM;
                this.queryForm["emails1"] = EM1;
              } else {
                if (count == 2) {
                  var len = this.currentSelect[0]["emails"].length;
                  var Idx1 = this.currentSelect[0]["emails"].indexOf(",");
                  var Idx2 = this.currentSelect[0]["emails"].lastIndexOf(",");
                  var EM = this.currentSelect[0]["emails"].slice(0, Idx1);
                  var EM1 = this.currentSelect[0]["emails"].slice(
                    Idx1 + 1,
                    Idx2
                  );
                  var EM2 = this.currentSelect[0]["emails"].slice(
                    Idx2 + 1,
                    len
                  );
                  this.queryForm["emails"] = EM;
                  this.queryForm["emails1"] = EM1;
                  this.queryForm["emails2"] = EM2;
                }
              }
            }
          } else {
            if (key == "role") {
              this.queryForm[key] = this.currentSelect[0][key].split(",");
            } else {
              if (key == "branchId") {
                this.queryForm[key] = [this.currentSelect[0][key]];
                console.log(this.queryForm[key], "branchId");
              } else {
                this.queryForm[key] = this.currentSelect[0][key];
              }
            }
          }
        }
        // console.log(this.queryForm,"queryForm")
      }
    },
    initList() { //初始化下拉列表
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brno = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("错误信息", error);
        });
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
    submit() { //修改策略事件
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let resBody = new messageUpdate();
          resBody.data.umID = this.queryForm.umId;
          resBody.data.msgId = this.queryForm.msgId;
          resBody.data.umName = this.queryForm.uName;
          resBody.data.phoneNumber = this.queryForm.phoneNumber;
          resBody.data.phoneNumber1 = this.queryForm.phoneNumber1;
          resBody.data.phoneNumber2 = this.queryForm.phoneNumber2;
          resBody.data.email = this.queryForm.emails;
          resBody.data.email1 = this.queryForm.emails1;
          resBody.data.email2 = this.queryForm.emails2;
          resBody.data.isSend = this.queryForm.isSend;
          resBody.data.startTime = this.queryForm.startTime;
          resBody.data.endTime = this.queryForm.endTime;
          resBody.data.brno = this.queryForm.branchId.join(",");
          resBody.data.role = this.queryForm.role.join(",");
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "短信参数修改成功!"
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
      this.$refs["" + item].resetFields();
      this.$refs["" + item].clearValidate();
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
