<template>
  <el-dialog title="版本回退" width="70%"
    :lock-scroll=false
    :close-on-click-modal=false
    :visible.sync="isShow"
    @open="openUpdate">
    <div 
      v-loading="loading"
      element-loading-text="拼命加载中">
      <el-card>
        <el-form :model="form" ref="form" size="mini" label-width="80px" label-position="left">
          <el-row :gutter="10">
            <el-col>
              <el-form-item label="版本号">
                <span v-text="form.versionCode"></span>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="版本描述">
                <span v-text="form.adDescription"></span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-table :data="tableData"
          header-row-class-name="tableHeaderClass"
          border>
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column fixed prop="devNum" label="机具编号" width="200"></el-table-column>
            <el-table-column prop="branchNo" label="机构号" width="130"> </el-table-column>
            <el-table-column prop="branchName" label="机构名称" width="330"> </el-table-column>
            <el-table-column prop="versionCode" label="当前版本" min-width="100"> </el-table-column>
            <el-table-column prop="upperVersionCode" label="上一版本" min-width="100"> </el-table-column>
          </el-table>
          <el-pagination
            style="text-align: right;margin-top:20px;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-sizes="[10, 20, 50,100]"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            background
            layout="total, prev, pager, next, jumper"
            :total="tableTotal"> 
          </el-pagination>
          
          
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button size="mini" @click="isShow = false" style="margin-top: 10px;">取 消</el-button>
        <el-button size="mini" type="primary" @click="retreatvs" style="margin-top: 10px;">立即回退</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from '@/utils/getGlobalParams';
import versionDevinfo from '@/message/version/versionRetreat/version-devinfo';
import retreatbyvs from '@/message/version/versionRetreat/retreatbyversioncode';
export default {
  props: {
    option: Object
  },
  data(){
    return {
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      loading:false,
      form: {
        strategy_Id:'',
        versionCode:'',
        applyDate:'',
        adDescription:'',
        adStatus:''
      },
      dialogFormVisible: false,
      tableData: [],
      currentPage: 1
    }
  },
  created() {},
  computed: {
    isShow: {
      get: function(){
         return this.option.importTemplateIsShow;
      },
      set: function(newVal){
        this.option.importTemplateIsShow = newVal;
      }
    }
  },
  props: {
    option: Object
  },
  methods: {
    handleCurrentChange() {
      this.queryDevinfoList();
    },
    handleSizeChange() {
      this.queryDevinfoList();
    },
    queryDevinfoList() {
      this.loading = true;
      let resBody = new versionDevinfo()
      resBody.data.strategy_Id = this.form.strategy_Id
      
      resBody.QueryRowNum = this.pageSize;
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
      .then(response=>{
        // console.log(response)
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.loading = false;
          this.tableData=response.RSP_BODY.verRollbackDevInfoList||[];
          this.tableTotal = Number(response.QUERY_INFO_HEAD.QueryAllDataCount||this.tableData.length);
        } else {
          this.$message({
            message: response.SYS_HEAD.ReturnMessage,
            type: "error"
          });
          this.loading = false;
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false;
        console.log("error", error);
      })
    },
    retreatvs(){
      this.loading = true;
      let resBody = new retreatbyvs();
      resBody.data.versionCode = this.form.versionCode;
      resBody.data.branchNo = this.$store.getters.branchNo;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log(response);
          this.loading = false;
          this.$message({
          message: '版本回退成功',
          type: 'success'
          });
          this.$parent.queryInfoList();
          this.isShow = false;
        } else {
          this.loading = false;
          this.$message({
            message: response.SYS_HEAD.ReturnMessage,
            type: "error"
          });
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false;
        console.log("error", error);
      })
    },
    openUpdate() {
      for(var key in this.option.currentRow){
        this.form[key]=this.option.currentRow[key]
      }
      this.queryDevinfoList();
      // console.log(this.form);
    }
  }
}
</script>

