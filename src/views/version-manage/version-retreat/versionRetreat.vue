<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"> 
    <el-card>
      <el-row :gutter="10">
        <el-col :sm='5' :lg='5'>
          <el-input v-model="search" size="mini" suffix-icon="el-icon-search" placeholder="请输入查询信息检索"></el-input>
        </el-col>
      </el-row>
        <el-table
            :data="tableData"
            class="tableMarginTop"
            header-row-class-name="tableHeaderClass" border>
            <el-table-column fixed prop="versionCode" label="版本号" width="200"></el-table-column>
            <el-table-column prop="applyDate" :formatter="dtFormat" label="版本发布时间" width="160"></el-table-column>
            <el-table-column prop="adDescription" label="版本描述" min-width="100"></el-table-column>
            <el-table-column prop="adStatus" :formatter="Format" label="发布结果" width="150"></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button
                  v-if="btnPermission('Button_VersionRevert_Revert')"
                  @click.native.prevent="versionRetreatRow(scope.$index, tables)"
                  type="primary"
                  size="mini">
                  版本回退
                </el-button>

              </template>
            </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: right; margin-top:20px;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 50,100]"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          background
          layout="total, prev, pager, next, jumper"
          :total="tableTotal">
        </el-pagination>

    </el-card>
    <!-- 弹窗 -->
    <keep-alive>
        <component :is='dialogList.importTemplate' :option='dialogOptions'></component>
    </keep-alive>
  
  </div>
</template>

<script>
import request from "@/utils/request";
import importTemplate from './dialog/importTemplate'
import versionTemplate from '@/message/version/versionTemplate/version-template'
import retreatbyvs from '@/message/version/versionRetreat/retreatbyversioncode';
import versionRetreat from '@/message/version/versionRetreat/version-retreat'
import getGlobalParams from '@/utils/getGlobalParams';
import toolBox from "@/utils/toolBox";

export default {
  data() {
    return {
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      search: "",
      currentPage: 1,
      loading:false,
      tableData:[],
      // tableData: [
      //   {
      //     versionCode: 'v_20180601_0013',
      //     applyDate: '20180720094548',
      //     adDescription: 'sds',
      //     adStatus:3,
      //     strategy_Id:'2'
      //   },{
      //     versionCode: 'V_487555413',
      //     applyDate: '20180602101010',
      //     adDescription: 'V端程序版本升级',
      //     adStatus:2,
      //     strategy_Id:'1'
      //   }
      // ],
      dialogList: {
        importTemplate
      },
      dialogOptions:{
        importTemplateIsShow:false,
        currentRow: []
      },
      adStatustype : getGlobalParams.get("adStatustype")
    };
    
  },
  computed:{
    // 表格前端模糊查询
    tables: function(){
      var search=this.search;
      if(search){
        return  this.tableData.filter(function(dataNews){
          return Object.keys(dataNews).some(function(key){
            return String(dataNews[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.tableData
    }
  },
  created() {
    this.queryInfoList()
  },
  methods: {
    Format(row, column) {
      return this.adStatustype[row[column.property]];
    },
    versionRetreatRow(vindex,vtables) {
      this.$confirm('是否回退版本?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
          this.dialogOptions.currentRow=vtables[vindex];
          // console.log(this.dialogOptions.currentRow)
          this.retreatvs()
          this.$message({
            type: 'success',
            message: '回退成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消回退'
          });          
        });
    },
    retreatvs(){
      this.loading = true;
      let resBody = new retreatbyvs();
      resBody.data.versionCode = this.dialogOptions.currentRow.versionCode;
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
          this.queryInfoList();
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
    handleSizeChange(val) {
      this.queryInfoList();
    },
    handleCurrentChange(val) {
      this.queryInfoList();
    },
    
    /**
     * @desc formatter 格式化时间
     * @param row
     * @param columu
     */
    dtFormat(row, column){
      return toolBox.timeFormat(row[column.property])
    },

    // 查询版本回退列表方法
    queryInfoList() {
      this.loading = true;
      let resBody = new versionRetreat()

      resBody.QueryRowNum = this.pageSize;
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.loading = false;
          // console.log(response);
          this.tableData = response.RSP_BODY.verRollbackBaseInfoList || [];
          this.tableTotal = Number(response.QUERY_INFO_HEAD.QueryAllDataCount||this.tableData.length);
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
    }
  }
};
</script>

<style scope>

</style>