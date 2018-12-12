<template>
  <div>
    <el-dialog title="设备解除"
    :lock-scroll=false @open="dialogCallback"
    :visible.sync="isShow" width="700px">
      <el-card style="margin-bottom:10px">
        <el-form size="mini" label-position="left" label-width="80px">
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="参数名称">
                <el-input v-model="paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :md="12" :lg="12">
              <el-form-item label="描述">
                <el-input v-model="formInline.b" placeholder="请输入描述"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="参数值">
                <el-input v-model="formInline.b" placeholder="请输入参数值"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>

        </el-form>
      </el-card>
      
      <el-card>
        <el-table :data="tableData3"
        header-row-class-name="tableHeaderClass" 
        border>
          <el-table-column
            fixed prop="branchNo" label="设备ID">
          </el-table-column>
          <el-table-column
            prop="devNum" label="设备网点号">
          </el-table-column>
        </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        layout="total, prev, pager, next, jumper"
        :total="tableData3.length">
      </el-pagination>

      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isShow = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="paramUntieDevClick">确定解除</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";

import paramDevinfoQueryUnite from '@/message/parameterManage/param-devinfo-query-untie'
import paramUntieDev from '@/message/parameterManage/param-untie-dev'
export default {
  props: {
    option: Object,
    rowData: Object
  },
  data() {
    return {
      currentPage: 1,
      loading: false,
      tableData3: [],
      rowTableData: null,
      paramKey: ""
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
    }
  },
  methods: {
    // dialog回调
    dialogCallback() {
      this.rowTableData = this.rowData
      this.paramKey = this.rowTableData.paramKey
      this.queryDevinfo()
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    // 获取devinfo
    queryDevinfo() {
      let resBody = new paramDevinfoQueryUnite()
      resBody.data.paramID = this.rowTableData.paramID
      resBody.QueryPageNo = this.currentPage
      resBody.QueryRowNum = getGlobalParams.get("PageSize")
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.tableData3 = response.RSP_BODY.queryUntieDevInfoList || []
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        console.log("error", error);
      })
    },

    // 解除设定
    paramUntieDevClick() {
      let resBody = new paramUntieDev()
      resBody.data.paramID = this.rowTableData.paramID
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.isShow = false
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        console.log("error", error);
      })
    },
    resetForm(formName) {
      console.log(formName);
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scope>

</style>