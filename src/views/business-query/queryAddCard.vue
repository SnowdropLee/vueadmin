<template>
  <div 
  v-loading="loading"
        element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px;overflow: visible;">
      <el-form :model="formInline" ref="formInline" label-position="top" size="mini">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="机构" prop="branchNo">
              <select-tree :tree-data="brnoList"  v-model="formInline.selBrno"
              :single-check="true"
              :node-key="'branchId'" 
              :props="{id:'branchId',label:'branchName',children:'childBranch'}"
              ></select-tree>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="开始日期" prop="startdate">
              <el-date-picker
                v-model="formInline.startdate"
                :editable=false
                :picker-options="pickerOptionsStart"
                value-format="yyyyMMdd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="结束日期" prop="enddate">
              <el-date-picker
                v-model="formInline.enddate"
                :editable=false
                :picker-options="pickerOptionsStart"
                value-format="yyyyMMdd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="设备编号" prop="devNum">
              <el-input v-model="formInline.devNum" placeholder="请选择设备编号"></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="3" :lg="2" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" @click="queryInfoList"
              icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type='warning' icon='el-icon-refresh' 
              @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="2" :md="3" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" icon="el-icon-download" 
              @click="exportInfoList" v-if="btnPermission('Button_AddCardQue_Export')">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-card>
    <el-card>
        <el-table :data="tableData3"
        header-row-class-name="tableHeaderClass"
        border style="min-height=390px">
          <el-table-column
            fixed prop="agentserialno" label="业务流水号" width="130">
          </el-table-column>
          <el-table-column
            prop="workdate" :formatter="dFormat" label="加卡日期" width="100">
          </el-table-column>
          <el-table-column
            prop="worktime" :formatter="tFormat" label="加卡时间" width="80">
          </el-table-column>
          <el-table-column
            prop="branchNo" label="机构号" width="80">
          </el-table-column>
          <el-table-column
            prop="devNum" label="设备编号" width="120">
          </el-table-column>
          <el-table-column
            prop="cardboxno" label="卡箱号" width="100">
          </el-table-column>
          <el-table-column
            prop="addcardnum" label="加卡数量" width="80">
          </el-table-column>
          <el-table-column
            prop="voucherbusitype" label="凭证种类代码" width="120">
          </el-table-column>
          <el-table-column
            prop="vchrserl" label="凭证序号" width="180">
          </el-table-column>
          <el-table-column
            prop="operater" label="操作柜员" width="120">
          </el-table-column>
          <el-table-column
            prop="remark" label="备注" min-width="150">
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

  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import toolBox from "@/utils/toolBox";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import queryAddCard from "@/message/businessQuery/queryAddCard/query-add-card"
import exportAddCard from "@/message/businessQuery/queryAddCard/export-add-card"

export default {
  components: { selectTree },
  data() {
    return {
      treeData: [
        {id:1,label:'1-1'},
        {id:2,label:'1-2',children:[
          {id:3,label:'2-1'},
          {id:4,label:'2-2'}
        ]}
      ],
      options: {
        label: "label",
        checkbox: true, // 多选开关
        checkedOpen: true, // 选中时是否展开节点
        folderBold: true, // 目录是否加粗显示
        idsWithParent: true, // 获取复选项目是否包含目录,默认`true`,如果只获取叶子节点设置为`false`
        depthOpen: 2, // 初始化时展开层级,根节点为0,默认0
        openIcon: "aui-icon aui-icon-angle-right", // 展开按钮图标， 默认值
        closeIcon: "aui-icon aui-icon-angle-down", // 收缩按钮图标， 默认值
        checkedIcon: "aui-icon aui-icon-fangxingxuanzhong", // 选中按钮图标， 默认值
        uncheckedIcon: "aui-icon aui-icon-fangxingweixuanzhong" // 未选中按钮图标， 默认值
      },
      ids: null,
      pickerOptionsStart: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let one = 30 * 24 * 3600 * 1000; //一个月
          let oneMonths = curDate - one;
          return time.getTime() > Date.now() || time.getTime() < oneMonths;
        }
      },
      brnoList: [], // 机构下拉框数据
      formInline: {
        startdate: "",
        enddate: "",
        devNum: undefined,
        selBrno: []
      },
      currentPage: 1,
      loading:false,
      tableData3: [{
          agentserialno: '',
          workdate: '',
          worktime: '',
          branchNo: '',
          devNum: '',
          cardboxno: '',
          addcardnum: '',
          voucherbusitype: '',
          vchrserl: '',
          operater: '',
          remark: ''
        }]
    };
    
  },
  created() {
    // 初始化日期
    this.formInline.startdate = toolBox.getNowTime(29);
    this.formInline.enddate = toolBox.getNowTime(0);
    this.pageSize = getGlobalParams.get("PageSize");
    this.initBrno()
    this.queryInfoList()
  },
  methods: {
    dFormat(row, column){
      return toolBox.timeFormat2Date(row[column.property])
    },
    tFormat(row, column){
      return toolBox.timeFormat2Time(row[column.property])
    },
    // 初始化机构下拉框
    initBrno() {
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brnoList = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    queryInfoList() {
      this.loading = true;
      let resBody = new queryAddCard();
      resBody.data.startdate = this.formInline.startdate
      resBody.data.enddate = this.formInline.enddate
      resBody.data.branchNo = this.formInline.selBrno[0]
      resBody.data.devNum = this.formInline.devNum

      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.tableData3 = response.RSP_BODY.addcardinfoList||[];
            this.loading = false;
          }else{
            this.tableData3=[];
            this.loading = false;
            console.log(response);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
      exportInfoList() {
      let resBody = new exportAddCard();
      resBody.data.startdate = this.formInline.startdate
      resBody.data.enddate = this.formInline.enddate
      resBody.data.branchNo = this.formInline.selBrno[0]
      resBody.data.devNum = this.formInline.devNum

      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.downloadFile(response.RSP_BODY.fileName);
          }else{
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    resetForm(formName) {
      this.formInline.selBrno=[];
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scope>
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
</style>