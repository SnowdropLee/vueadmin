<template>
  <div>
    <el-dialog title="设定"  @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="800px">
    <el-tabs type="border-card" v-model="paramReleaseType" @tab-click="handleTabClick" >
      <el-tab-pane label="按设备设定" name="2">
        <!-- <el-card style="margin-bottom:10px"> -->
          <el-form :model="formInline" ref="formInline2" :rules="formInlineRules" label-position="left" size="mini" label-width="80px">
            <el-row :gutter="10">      
              <el-col :md="12" :lg="12">
                <el-form-item label="设备形式" prop="devDForm">
                  <el-select v-model="formInline.devDForm"
                  @change="devFormQueryCDevProgram"
                  placeholder="请选择设备形式">
                    <el-option
                    v-for="item in devFormSpinner"
                    :key="item.devForm"
                    :value="item.devForm"
                    :label="item.devFormName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12" :lg="12">
                <el-form-item label="C端程序" prop="cDevProgram">
                  <el-select v-model="formInline.cDevProgram" 
                  @change="paramQueryDevinfo"
                  placeholder="请选择C端程序">
                    <el-option
                    v-for="item in cProgramSpinner"
                    :key="item.cProgramID"
                    :value="item.cProgramID"
                    :label="item.cProgramName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        <!-- </el-card>
        <el-card> -->
          <el-table :data="devTableData" 
          header-row-class-name="tableHeaderClass"
          @selection-change="devList"
          border>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="devNum" label="设备编号"></el-table-column>
            <el-table-column prop="branchNo" label="机构号"></el-table-column>
            <el-table-column prop="branchName" label="机构名称"></el-table-column>
          </el-table>

        <el-pagination
          style="text-align: right; margin-top:20px;"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          background
          layout="total, prev, pager, next, jumper"
          :total="devTableData.length">
        </el-pagination>

      <!-- </el-card> -->
      </el-tab-pane>
      <el-tab-pane label="按C端程序设定" name="1">
        <!-- <el-card> -->
          <el-form :model="formInline" ref="formInline1" :rules="formInlineRules" label-position="left" size="mini" label-width="80px">
            <el-row :gutter="10">            
              <el-col :md="12" :lg="12">
                <el-form-item label="设备形式" prop="devCForm">
                  <el-select v-model="formInline.devCForm"
                  @change="devFormQueryCDevProgram"
                  placeholder="请选择设备形式">
                    <el-option
                    v-for="item in devFormSpinner"
                    :key="item.devForm"
                    :value="item.devForm"
                    :label="item.devFormName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12" :lg="12">
                <el-form-item label="C端程序" prop="cProgram">
                  <el-select multiple v-model="formInline.cProgram" placeholder="请选择C端程序">
                    <el-option
                    v-for="item in cProgramSpinner"
                    :key="item.cProgramID"
                    :value="item.cProgramID"
                    :label="item.cProgramName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
            </el-row>
          </el-form>
        <!-- </el-card> -->
      </el-tab-pane>
      <el-tab-pane label="按设备形式设定" name="0">
        <!-- <el-card> -->
          <el-form :model="formInline" ref="formInline0" :rules="formInlineRules" label-position="left" size="mini" label-width="80px">
            <el-row :gutter="10">            
              <el-col :md="12" :lg="12">
                <el-form-item label="设备形式" prop="devForm">
                  <el-select v-model="formInline.devForm" placeholder="请选择设备形式">
                    <el-option
                    v-for="item in devFormSpinner"
                    :key="item.devForm"
                    :value="item.devForm"
                    :label="item.devFormName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        <!-- </el-card> -->
      </el-tab-pane>
    </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isShow = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="paramBindDevClick('paramReleaseType')">设 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
import paramQueryDevinfo from "@/message/parameterManage/param-query-devinfo";
import paramBindDev from "@/message/parameterManage/param-bind-dev";
export default {
  props: {
    option: Object,
    rowData: Object
  },
  data() {
    return {
      formInline: {
        cDevProgram: "", //c端程序
        cProgram: [],
        devDForm: "",
        devForm: "",
        devCForm: ""
      },
      formInlineRules: {
        devDForm: [
          { required: true, message: "请选择设备形式", trigger: "change" }
        ],
        devForm: [
          { required: true, message: "请选择设备形式", trigger: "change" }
        ],
        devCForm: [
          { required: true, message: "请选择设备形式", trigger: "change" }
        ],
        cDevProgram: [
          { required: true, message: "选择c端程序", trigger: "change" }
        ],
        cProgram: [
          { required: true, message: "选择c端程序", trigger: "change" }
        ]
      },

      cProgramList: [],
      cProgramSpinner: [],
      devFormSpinner: [],
      currentPage: 1,
      devTableData: [],
      devId: [],
      paramReleaseType: "2" // 参数发布类型
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newVal) {
        this.option.isShow = newVal;
      }
    },
    tableDataRow: function() {
      return this.rowData;
    }
  },
  created() {
    this.initSpinnerList();
  },
  methods: {
    // 初始化下拉框
    initSpinnerList() {
      let resBody = new spinnerDataQuery();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "cProgram" }
      ];
      request(resBody)
        .then(response => {
          this.cProgramList = response.RSP_BODY.cProgramSpinner;
          this.cProgramSpinner=Object.assign([],this.cProgramList)
          this.devFormSpinner = response.RSP_BODY.devFormSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    //清空对话框验证结果数据
    closeDialog(paramReleaseType) {
      let formName;
      if (this.paramReleaseType === "2") {
        formName = "formInline2";
      } else if (this.paramReleaseType === "1") {
        formName = "formInline1";
      } else if (this.paramReleaseType === "0") {
        formName = "formInline0";
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate();
      });
    },
    // 根据设备形式查询C端程序
    devFormQueryCDevProgram(val) {
      this.cProgramSpinner = [];
      console.log(this.cProgramList,"this.cProgramList")
      console.log(val,"val")
      for (let i = 0; i < this.cProgramList.length; i++) {
        // let result = this.cProgramList.find(function(x) {
        //   return x.devForm === val
        // })
        if (val === this.cProgramList[i].devForm) {
          // 可优化查找
          this.cProgramSpinner.push(this.cProgramList[i]);
        }
      }
      console.log(this.cProgramSpinner,"this.cProgramSpinner")

    },
    // 获取devinfo
    paramQueryDevinfo() {
      let resBody = new paramQueryDevinfo();
      resBody.data.devForm = this.formInline.devDForm;
      resBody.data.cProgramBasicId = this.formInline.cDevProgram;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.devTableData = response.RSP_BODY.queryDevInfoList || [];
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    devList(row) {
      console.log(row);
      this.devId = row;
    },
    // 参数绑定设备
    paramBindDevClick(paramReleaseType) {
      let formName;
      if (this.paramReleaseType === "2") {
        formName = "formInline2";
      } else if (this.paramReleaseType === "1") {
        formName = "formInline1";
      } else if (this.paramReleaseType === "0") {
        formName = "formInline0";
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let resBody = new paramBindDev();
          resBody.data.paramReleaseType = this.paramReleaseType;
          resBody.data.paramID = this.tableDataRow.paramID;
          if (this.paramReleaseType === "2") {
            resBody.data.paramType = this.formInline.devDForm; // 设备-设备形式
            resBody.data.paramApp = this.formInline.cDevProgram; //c端程序
            let devIds = [];

            if (this.devId.length == 0) {
              console.log("devId is null.");
              this.$message({
                message: "请选择设备列表",
                type: "warning"
              });
              return false;
            } else {
              for (let i = 0; i < this.devId.length; i++) {
                devIds.push(this.devId[i].devId);
              }
              resBody.data.paramDevInfoList = devIds; //设备列表
            }
          } else if (this.paramReleaseType === "1") {
            resBody.data.paramType = this.formInline.devCForm; // C-设备形式
            resBody.data.paramAppInfoList = this.formInline.cProgram;
          } else if (this.paramReleaseType === "0") {
            resBody.data.paramType = this.formInline.devForm; // 设备形式-设备形式
          }
          console.log(resBody);
          resBody.QueryPageNo = this.currentPage;
          resBody.QueryRowNum = getGlobalParams.get("PageSize");
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.isShow = false;
              } else {
                console.log(response);
              }
            })
            .catch(error => {
              console.log("error", error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    // 切换tab页点击事件
    handleTabClick(tab, event) {
      this.formInline = {
        cDevProgram: "", //c端程序
        cProgram: [],
        devDForm: "",
        devForm: "",
        devCForm: ""
      }; // 清空数据
      let formName;
      if (this.paramReleaseType === "2") {
        formName = "formInline2";
      } else if (this.paramReleaseType === "1") {
        formName = "formInline1";
      } else if (this.paramReleaseType === "0") {
        formName = "formInline0";
      }
      this.$refs[formName].clearValidate(); // 清空每个标签页验证数据
      this.paramReleaseType = tab.name;
      // console.log(this.tableDataRow)
    }
  }
};
</script>

<style scope>
</style>