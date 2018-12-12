<template>
  <div>
    <el-dialog title="版本发布" :visible.sync="isShow" @close="closeCallback" center :lock-scroll=false :close-on-click-modal="false" width="800px">
      <div v-loading="loading" element-loading-text="拼命加载中">
        <el-steps :active="active" align-center style="margin-bottom:10px" finish-status="success">
          <el-step title="发布类型"></el-step>
          <el-step title="发布规则"></el-step>
        </el-steps>

        <div v-if="active === 0">
          <el-card style="margin-bottom:10px;overflow:visible;">
            <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="90px" label-position="left">
              <el-row :gutter="10">
                <!-- <el-col :md="12" :lg="12">
                <el-form-item label="设备分类">
                  <el-select v-model="form.region" placeholder="请选择设备分类">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
                <el-col :span="12">
                  <el-form-item label="版本编号 : " prop="versionCode">
                    <el-select v-model="form.versionCode" placeholder="请选择版本编号">
                      <el-option v-for="item in verBaseInfo" :key="item.adID" :label="item.versionCode" :value="item.versionCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="13">
                  <el-form-item label="发布方式 : ">
                    <el-radio-group v-model="radio" @change="initselBrno">
                      <el-radio :label="0">按分组</el-radio>
                      <el-radio :label="1">按机构</el-radio>
                      <el-radio :label="2">按设备</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <el-col :span="12" v-if="radio == '0'">
                  <el-form-item label="分组 : " prop="area">
                    <el-select v-model="form.area" placeholder="请选择分组">
                      <el-option v-for="item in areaList" :key="item.branchAreaId" :label="item.branchAreaName" :value="item.branchAreaId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="radio == '1'">
                  <el-form-item label="机构 : " prop="selBrno">
                    <select-tree :tree-data="brnoList" v-model="form.selBrno" :node-key="'branchId'" :props="{id:'branchId',label:'branchName',children:'childBranch'}"></select-tree>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row v-if="radio=='2'">
                <el-col>
                  <el-table :data="devTableData" header-row-class-name="tableHeaderClass" ref="multipleTable" @selection-change="handleSelectionChange" border>
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column fixed prop="devnum" label="设备编号" width="120"></el-table-column>
                    <el-table-column prop="devtype" label="设备类型" width="120"> </el-table-column>
                    <el-table-column prop="branchname" label="及其所在网点" width="150"> </el-table-column>
                    <el-table-column prop="devip" label="设备IP" min-width="120"> </el-table-column>
                  </el-table>
                  <el-pagination style="text-align: right;margin-top:20px;" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 50,100]" :page-size="pageSize" background layout="total, prev, pager, next, jumper" :total="tableTotal">
                  </el-pagination>
                </el-col>
              </el-row>

            </el-form>
          </el-card>
          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" size="mini" style="margin-top: 10px;" @click="next('form')">下一步</el-button>
          </div>
        </div>

        <div v-if="active === 1">
          <el-card style="margin-bottom:10px;overflow:visible;">
            <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="110px" label-position="left">
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item label="立即生效 :" prop="isEffective">
                    <el-radio-group v-model="form.isEffective" @change="radioChange">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="2">
                  <el-form-item label="预计发布时间:" prop="verUpdatePrepareTime">
                    <el-date-picker type="datetime" :readonly="isdatenow" placeholder="选择日期时间" value-format="yyyyMMddHHmmss" v-model="form.verUpdatePrepareTime" :disabled="form.isEffective==1">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="升级间隔时间:" prop="verUpdateInterval">
                    <el-input v-model="form.verUpdateInterval" placeholder="请输入升级间隔时间（秒）"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="12" :lg="12">
                  <el-form-item label="单次升级数量:" prop="verUpdateDevNum">
                    <el-input v-model="form.verUpdateDevNum" placeholder="请输入单次升级数量"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button @click='back' size="mini" type='primary' style="margin-top: 10px;">上一步</el-button>
            <el-button @click="sure('form')" size="mini" type='primary' style="margin-top: 10px;">确 定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import spinnerDataList from "@/message/spinnerDataQuery/spinner-data-query";
import releasebydev from "@/message/version/versionRelease/release-by-dev";
import releasebybrno from "@/message/version/versionRelease/release-by-brno";
import releasebyarea from "@/message/version/versionRelease/release-by-area";
import releaseDevinfoQuery from "@/message/version/versionRelease/release-devinfo-query";
export default {
  components: { selectTree },
  props: { option: Object },
  data() {
    // 自定义校验机构是否有选择
    var validateselBrno = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("请选择机构号"));
      } else {
        callback();
      }
    };
    var validatorDevNumMinMax = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error("请输入数字"));
      } else if (value > 100 || value < 0) {
        callback(new Error("请输入0~100之间的数字"));
      } else {
        callback();
      }
    };
    var validatorTimeMinMax = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error("请输入数字"));
      } else if (value > 600 || value < 10) {
        callback(new Error("请输入10~600之间的数字"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      isdatenow: false,
      pageSize: getGlobalParams.get("PageSize"),
      tableTotal: 0,
      verBaseInfo: [], //
      brnoList: [], // 机构下拉框数据
      areaList: [],
      verUpdateDevList: [],
      form: {
        selBrno: [],
        versionCode: "",
        area: "",
        isEffective: 2,
        verUpdatePrepareTime: "",
        verUpdateInterval: "",
        verUpdateDevNum: ""
      },
      // 定义校验规则
      rules: {
        versionCode: [
          { required: true, message: "请选择版本编号", trigger: "change" }
        ],
        area: [{ required: true, message: "请选择分组", trigger: "change" }],
        selBrno: [
          { required: true, validator: validateselBrno, trigger: "change" }
        ],
        isEffective: [
          { required: true, message: "请选择是否立即生效", trigger: "change" }
        ],
        verUpdatePrepareTime: [
          {
            type: "string",
            required: true,
            message: "请选择预计发布时间",
            trigger: "change"
          }
        ],
        verUpdateInterval: [
          { required: true, message: "请输入升级间隔时间", trigger: "change" },
          { validator: validatorTimeMinMax, trigger: "change" } //最小最大值
        ],
        verUpdateDevNum: [
          { required: true, message: "请输入单次升级数量", trigger: "blur" },
          { validator: validatorDevNumMinMax, trigger: "change" } //最大最小值
        ]
      },
      dateDefined: "",
      currentPage: 1,
      radio: 0,
      active: 0,
      devTableData: [{}]
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.versionReleaseIsShow;
      },
      set: function(newVlaue) {
        this.option.versionReleaseIsShow = newVlaue;
      }
    }
  },
  created() {
    // 初始化日期
    this.initSpinnerDataList();
    this.queryInfoList();
  },
  methods: {
    // 初始化下拉框
    initSpinnerDataList() {
      let resBody = new spinnerDataList();
      resBody.data.spinnerList = [
        { spinnerName: "branch" },
        { spinnerName: "verBaseInfo" },
        { spinnerName: "branchArea" }
      ];
      request(resBody)
        .then(response => {
          this.brnoList = response.RSP_BODY.branchSpinner;
          this.verBaseInfo = response.RSP_BODY.verBaseInfoSpinner;
          this.areaList = response.RSP_BODY.branchAreaList;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    /**
     * 选择是否生效后逻辑处理
     */
    radioChange(val) {
      if (val === 1) {
        this.form.verUpdatePrepareTime = this.getdatetime();
        this.isdatenow = true;
      } else {
        this.form.verUpdatePrepareTime = "";
        this.isdatenow = false;
      }
    },
    // 获取时间方法
    getdatetime() {
      var datime = new Date();
      return (
        datime.getFullYear() +
        this.ifdouble((datime.getMonth() + 1).toString()) +
        this.ifdouble(datime.getDate().toString()) +
        this.ifdouble(datime.getHours().toString()) +
        this.ifdouble(datime.getMinutes().toString()) +
        this.ifdouble(datime.getSeconds().toString())
      );
    },
    ifdouble(val) {
      if (val.length === 2) {
        return val;
      } else {
        return "0" + val;
      }
    },

    initselBrno() {
      this.$refs["form"].clearValidate();
      this.form.area = "";
      this.form.selBrno = [];
      this.verUpdateDevList = [];
    },

    /**
     * 查询发布
     */
    queryInfoList() {
      let resBody = new releaseDevinfoQuery();
      resBody.QueryRowNum = this.pageSize;
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.devTableData = response.RSP_BODY.verUpdateDevInfoList;
            this.tableTotal = Number(
              response.QUERY_INFO_HEAD.QueryAllDataCount ||
                this.tableData.length
            );
          } else {
            this.$message({
              message: response.SYS_HEAD.ReturnMessage,
              type: "error"
            });
            console.log(response);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    handleSizeChange() {
      this.queryInfoList();
    },
    handleCurrentChange() {
      this.queryInfoList();
    },
    handleSelectionChange(val) {
      for (var i = 0; i < val.length; i++) {
        this.verUpdateDevList[i] = val[i].devid;
      }
    },
    closeCallback() {
      this.active = 0;
      this.radio = 0;
      this.verUpdateDevList = [];
      this.form.versionCode = "";
      this.form.area = "";
      // // this.form={};
      (this.form = {
        selBrno: [],
        versionCode: "",
        area: "",
        isEffective: 2,
        verUpdatePrepareTime: "",
        verUpdateInterval: "",
        verUpdateDevNum: ""
      }),
        // this.$refs["form"].resetFields();
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
    },
    next(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.radio == 2) {
            if (this.verUpdateDevList.length === 0) {
              this.$message("请至少选择一个设备");
            } else {
              if (this.active++ > 0) this.active = 0;
            }
          } else {
            if (this.active++ > 0) this.active = 0;
          }
        } else {
          this.$message({
            message: "请完善信息",
            type: "warning"
          });
          return false;
        }
      });
    },
    back() {
      this.verUpdateDevList = [];
      this.$refs["form"].clearValidate();
      if (this.active >= 0) this.active--;
    },
    sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.radio === 2) {
            let resBody = new releasebydev();
            resBody.data.versionCode = this.form.versionCode;
            resBody.data.isEffective = this.form.isEffective + "";
            resBody.data.verUpdatePrepareTime = this.form.verUpdatePrepareTime;
            resBody.data.verUpdateInterval = this.form.verUpdateInterval;
            resBody.data.verUpdateDevNum = this.form.verUpdateDevNum;
            resBody.data.verUpdatePattern = this.radio + "";
            resBody.data.branchNo = this.$store.getters.branchNo;
            resBody.data.verUpdateDevList = this.verUpdateDevList;
            request(resBody)
              .then(response => {
                this.verUpdateDevList = [];
                if (response.SYS_HEAD.ReturnCode === "000000") {
                  this.loading = false;
                  this.$parent.initSpinnerList();
                  this.$parent.currentPage = 1;
                  this.$parent.queryInfoList();
                  console.log(response);
                  this.isShow = false;
                  this.$message({
                    message: "恭喜你，版本发布成功！",
                    type: "success"
                  });
                } else {
                  this.loading = false;
                  this.$message({
                    message: response.SYS_HEAD.ReturnMessage,
                    type: "error"
                  });
                  console.log(response);
                }
              })
              .catch(error => {
                this.loading = false;
                console.log("error", error);
              });
          } else if (this.radio === 1) {
            let resBody = new releasebybrno();
            resBody.data.versionCode = this.form.versionCode;
            resBody.data.isEffective = this.form.isEffective + "";
            resBody.data.verUpdatePrepareTime = this.form.verUpdatePrepareTime;
            resBody.data.verUpdateInterval = this.form.verUpdateInterval;
            resBody.data.verUpdateDevNum = this.form.verUpdateDevNum;
            resBody.data.verUpdatePattern = this.radio + "";
            resBody.data.branchNo = this.$store.getters.branchNo;
            resBody.data.verUpdateBrnoList = this.form.selBrno;
            this.form.selBrno = [];
            request(resBody)
              .then(response => {
                if (response.SYS_HEAD.ReturnCode === "000000") {
                  this.loading = false;
                  this.$parent.initSpinnerList();
                  this.$parent.currentPage = 1;
                  this.$parent.queryInfoList();
                  this.isShow = false;
                  this.$message({
                    message: "恭喜你，版本发布成功！",
                    type: "success"
                  });
                } else {
                  this.loading = false;
                  this.$message({
                    message: response.SYS_HEAD.ReturnMessage,
                    type: "error"
                  });
                  console.log(response);
                }
              })
              .catch(error => {
                this.loading = false;
                console.log("error", error);
              });
          } else {
            let resBody = new releasebyarea();
            resBody.data.versionCode = this.form.versionCode;
            resBody.data.isEffective = this.form.isEffective + "";
            resBody.data.verUpdatePrepareTime = this.form.verUpdatePrepareTime;
            resBody.data.verUpdateInterval = this.form.verUpdateInterval;
            resBody.data.verUpdateDevNum = this.form.verUpdateDevNum;
            resBody.data.verUpdatePattern = this.radio + "";
            resBody.data.branchNo = this.$store.getters.branchNo;
            resBody.data.zoneNo = this.form.area;
            request(resBody)
              .then(response => {
                if (response.SYS_HEAD.ReturnCode === "000000") {
                  this.loading = false;
                  this.$parent.initSpinnerList();
                  this.$parent.currentPage = 1;
                  this.$parent.queryInfoList();
                  console.log(response);
                  // this.tableData = response.RSP_BODY.verOptionsTemplateInfoList
                  this.isShow = false;
                  this.$message({
                    message: "恭喜你，版本发布成功！",
                    type: "success"
                  });
                } else {
                  this.loading = false;
                  this.$message({
                    message: response.SYS_HEAD.ReturnMessage,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                this.loading = false;
                console.log("error", error);
              });
          }
        } else {
          this.$message({
            message: "请完善信息",
            type: "warning"
          });
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
