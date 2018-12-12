<template>
  <div>
    <el-dialog title="参数详情"
    :lock-scroll=false @open="openCollback"
    :visible.sync="isShow" width="800px">
      <el-card style="margin-bottom:10px">
        <el-form :model="formInline" label-position="left" size="mini" label-width="80px">
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="参数名称">
                <el-input v-model="formInline.paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="描述">
                <el-input v-model="formInline.paramDesc" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="24">
              <el-form-item label="参数值">
                <el-input v-model="formInline.paramValue" type="textarea" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="设备形式">
                <el-select v-model="formInline.devDForm" disabled>
                    <el-option
                    v-for="item in devFormSpinner"
                    :key="item.devForm"
                    :value="item.devForm"
                    :label="item.devFormName"
                    ></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="C端程序">
                <el-select v-model="formInline.cDevProgram" multiple disabled>
                    <el-option
                    v-for="item in cProgramList"
                    :key="item.cProgramID"
                    :value="item.cProgramID"
                    :label="item.cProgramName"
                    ></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-card>
      
      <el-card>
          <el-table :data="devTableData"
          header-row-class-name="tableHeaderClass"
          border>
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

      </el-card>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="isShow = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import paramDetailinfoQuery from '@/message/parameterManage/param-detailinfo-query'
import spinnerDataQuery from '@/message/spinnerDataQuery/spinner-data-query';

export default {
  props: {
    option: Object,
    paramObj: Object
  },
  data() {
    return {
      formInline: {
        devDForm: null,
        cDevProgram: null
      },
      devFormSpinner: [],
      cProgramList: [],
      // paramForm: {
      //   paramKey: "",
      //   paramDesc: "",
      //   paramID: ""
      // },
      currentPage: 1,
      loading: false,
      devTableData: []
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
    paramForm: function() {
      return this.paramObj
    }
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

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
          this.devFormSpinner = response.RSP_BODY.devFormSpinner
          console.log(this.cProgramList)
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    // 打开dialog回调
    openCollback() {
      this.initSpinnerList()
      this.paramQueryDetailinfo()
      this.formInline.paramKey = this.paramForm.paramKey
      this.formInline.paramDesc = this.paramForm.paramDesc
      this.formInline.paramValue = this.paramForm.paramValue
    },
    // 获取devinfo
    paramQueryDetailinfo() {
      let resBody = new paramDetailinfoQuery()
      resBody.data.paramID = this.paramObj.paramID
      resBody.QueryPageNo = this.currentPage
      resBody.QueryRowNum = getGlobalParams.get("PageSize")
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log(response)
          this.devTableData = response.RSP_BODY.paramDevInfoList || []
          this.formInline.devDForm = response.RSP_BODY.releaseBaseInfo[0].devForm || ""
          this.formInline.cDevProgram = response.RSP_BODY.paramAppInfoList || []
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        console.log("error", error);
      })
    }
    
  }
};
</script>

<style scope>

</style>