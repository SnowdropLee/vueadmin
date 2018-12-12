<template>
<div 
  v-loading="loading"
  element-loading-text="拼命加载中">
    <el-card>
      <el-row :gutter="10">
        <el-col :sm='5' :lg='5'>
          <el-input v-model="search" size="mini" suffix-icon="el-icon-search" placeholder="请输入查询信息检索"></el-input>
        </el-col>
        <el-col :sm='3' :lg='2'>
          <el-button type='primary' size='mini'
          v-if="btnPermission('Button_VersionTemplate_Import')"
          @click="importTemplateDialog">导入模板</el-button>
        </el-col>
      </el-row>
        <el-table
            :data="tables"
            class="tableMarginTop"
            header-row-class-name="tableHeaderClass" border>
            <el-table-column fixed prop="verOptionsTemplateName" label="模板名称" width="310"></el-table-column>
            <el-table-column prop="createTime" :formatter="dtFormat" label="创建日期" width="160"></el-table-column>
            <el-table-column prop="verRuleExcludedFiles" label="排除文件" width="180"></el-table-column>
            <el-table-column prop="verRuleExcludedDirs" label="排除文件夹" min-width="280"></el-table-column>
            <el-table-column prop="verRuleOnceUpdateFiles" label="只更新一次的文件" width="150"></el-table-column>
            <el-table-column prop="verRuleUpdateDirs" label="只更新一次的文件夹" width="150"></el-table-column>
            <el-table-column prop="verRuleMatchPatterns" label="匹配模式" width="100"></el-table-column>
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
import toolBox from "@/utils/toolBox";
import getGlobalParams from '@/utils/getGlobalParams';
import importTemplate from './dialog/importTemplate';
import versionTemplate from '@/message/version/versionTemplate/version-template';

export default {
  data() {
    return {
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      search: "",
      currentPage: 1,
      loading:false,
      tableData: [],
      dialogList: {
        importTemplate
      },
      dialogOptions:{
        importTemplateIsShow:false
      },
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
    // 调用模版查询方法
    this.queryInfoList()
  },
  methods: {
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
    
    // 查询模版信息列表方法
    queryInfoList() {
      this.loading = true;
      let resBody = new versionTemplate()

      resBody.QueryRowNum = this.pageSize;
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.loading = false;
          this.tableData = response.RSP_BODY.verOptionsTemplateInfoList||[];
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
    importTemplateDialog() {
      this.dialogOptions.importTemplateIsShow = true;
    }

  }
};
</script>

<style scope>

</style>