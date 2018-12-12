<template>
  <el-dialog title='修改预警策略' :visible.sync='isShow' width='900px'  :lock-scroll=false @open="openWarning"
              :close-on-click-modal=false @close='clearForm("queryForm")' >
    <div v-loading="loading">
      <div  class="detailInfo">
        <el-card class='type-info-box-card'>
          <el-form ref='queryForm' :model='queryForm' size='mini' :rules="rules" label-width="140px" label-position="left">
            <el-row :gutter="20">
              <el-col :sm='12' :md='12' :lg='12'>
                <el-form-item label='策略类型:' class='typeInfo-el-form-item' prop='type' >
                  <el-select v-model="queryForm.type" placeholder="请选择策略类型" disabled>
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
              <el-col :sm='12' :md='12' :lg='12'>
                <el-form-item label='策略属性:' class='typeInfo-el-form-item' prop='policyPropertyId'>
                  <el-select v-model="queryForm.policyPropertyId" clearable multiple placeholder="请选择表达式"  >
                    <el-option
                    v-for="item in strategyDes"
                    :key="item.value"
                    :label="item.value"
                    :value="item.key"
                    :disabled="item.disabled">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :sm='12' :md='12' :lg='12'>
                <el-form-item label='异常排查开始时间:' class='typeInfo-el-form-item' prop='execute_StartTime'>
                    <!-- <el-input v-model='queryForm.execute_StartTime'  style='width:100%'
                    placeholder=""  ></el-input> -->
                  <el-time-picker
                    style="width:100%"
                      value-format="HHmmss"
                      v-model="queryForm.execute_StartTime"
                      placeholder="请选择时间">
                  </el-time-picker>
                </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12'>
                  <el-form-item label='异常排查结束时间:' class='typeInfo-el-form-item'  prop='execute_EndTime'>
                    <!-- <el-input v-model='queryForm.execute_EndTime'  style='width:100%'
                    placeholder=""  ></el-input> -->
                    <el-time-picker
                      style="width:100%"
                        value-format="HHmmss"
                        v-model="queryForm.execute_EndTime"
                        placeholder="请选择时间">
                    </el-time-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12'>
                  <el-form-item label='预警时间间隔:' class='typeInfo-el-form-item' prop='working_Interval'>
                    <el-input v-model='queryForm.working_Interval'  style='width:100%'
                    placeholder=""  ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12'>
                  <el-form-item label='预警通知方式:' class='typeInfo-el-form-item' prop='notifyMethod'>
                    <el-checkbox-group v-model="queryForm.notifyMethod">
                      <el-checkbox label="1">短信</el-checkbox>
                      <el-checkbox label="2">邮件</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :sm='12' :md='12' :lg='12' >
                  <el-form-item label='联系人:'  prop="contact">
                    <el-select v-model="queryForm.contact" multiple :multiple-limit="2" clearable placeholder="请选择联系人">
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
        </el-card>
      </div>
      <div slot="footer" style="margin:10px 0;text-align:right">
        <el-button type='default' size="mini"  @click="isShow=false">取消</el-button>
        <el-button type='primary' size='mini' @click="submit">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import alertUpdate from "@/message/alertManage/warning/alert-update";
import strategyPropList from "@/message/alertManage/warning/alert-prop-list";
import contactList from "@/message/alertManage/message/message-contact";

export default {
  data() {
    return {
      loading: false,
      queryForm: {
        //表单数据
        type: "DeviceAlert",
        policyPropertyId: [],
        execute_StartTime: "",
        execute_EndTime: "",
        working_Interval: "",
        notifyMethod: [],
        contact: []
      },
      contact: [],
      strategyType: [
        { label: "设备", value: "DeviceAlert" },
        { label: "业务", value: "BusinessAlert" }
      ],
      strategyDes: [],
      rules: {
        type: [{ required: true, message: "请选择策略类型", trigger: "blur" }],
        policyPropertyId: [
          { required: true, message: "请选择策略属性", trigger: "blur" }
        ],
        execute_StartTime: [
          { required: true, message: "请选择异常排查开始时间", trigger: "blur" }
        ],
        execute_EndTime: [
          { required: true, message: "请选择异常排查结束时间", trigger: "blur" }
        ],
        working_Interval: [
          { required: true, message: "请输入预警时间间隔", trigger: "blur" }
          // { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        notifyMethod: [
          { required: true, message: "请选择预警通知方式", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请选择联系人！", trigger: "change" }
        ]
      }
    };
  },
  props: ["option", "currentSelect"],
  methods: {
    openWarning() {
      this.queryForm.notifyMethod = this.currentSelect[0].hasOwnProperty(
        "notifyMethod"
      )
        ? this.currentSelect[0].notifyMethod.split(",")
        : [];
      this.queryForm.type = "DeviceAlert";
      this.queryForm.execute_StartTime = this.currentSelect[0].execute_StartTime;
      this.queryForm.execute_EndTime = this.currentSelect[0].execute_EndTime;
      this.queryForm.working_Interval = this.currentSelect[0].working_Interval;
      this.queryForm.contact = this.currentSelect[0].umId.split(",");
      let resBody = new strategyPropList(); //这里需要改
      resBody.data.policyType = "DeviceAlert";
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode == "000000") {
            this.strategyDes = response.RSP_BODY.resultSet;
            // this.queryForm.policyProperty=this.currentSelect.policyProperty
            let arr = [];
            this.currentSelect[0].policyProperty.forEach(element => {
              arr.push(element.policyPropertyId);
            });
            this.queryForm.policyPropertyId = arr;
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message:
              "请求失败，错误码:" +
              response.SYS_HEAD.ReturnCode +
              "，错误信息：" +
              response.SYS_HEAD.ReturnMessage
          });
        });
      let resBody1 = new contactList();
      request(resBody1)
        .then(response => {
          this.contact = response.RSP_BODY.resultSet;
        })
        .catch(error => {
          console.error("错误信息", error);
        });
    },
    submit() {
      //修改策略事件
      this.$refs["queryForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let resBody = new alertUpdate();
          resBody.data.policyId = this.currentSelect[0].policyId;
          resBody.data.type = this.queryForm.type;
          resBody.data.policyProperty = this.queryForm.policyPropertyId.join(
            ","
          );
          resBody.data.execute_Starttime = this.queryForm.execute_StartTime;
          resBody.data.execute_Endtime = this.queryForm.execute_EndTime;
          resBody.data.working_Interval = this.queryForm.working_Interval;
          resBody.data.notifyMethod = this.queryForm.notifyMethod.join(",");
          resBody.data.umId = this.queryForm.contact;

          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "预警策略修改成功!"
                });
                this.isShow = false;
                this.$emit("refreshTable");
              } else {
                this.loading = false;
              }
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
        }
      });
    },
    clearForm(item) {
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
  mounted() {}
};
</script>

<style lang="scss" scope>
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
</style>
