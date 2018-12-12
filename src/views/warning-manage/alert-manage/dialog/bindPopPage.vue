<template>
  <el-dialog title='绑定设备' :visible.sync='isShow' width='970px' :lock-scroll=false
    :close-on-click-modal=false
    @open="openbind" 
    @close='clearForm("queryForm")'>
   <div  class="detailInfo"  v-loading="loading">
      <el-card class='bindPopCard'>
        <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top'>
            <el-row :gutter="10">
                <el-col :span="5">
                      <el-form-item label='网点名称' class='typeInfo-el-form-item' prop='branchNo'>
                          <select-tree ref="tree" 
                            v-model="queryForm.selBrno"
                            :node-key="'branchId'" 
                            :props='{id:"branchId",label: "branchName",children: "childBranch"}' 
                            :tree-data="brnoSpinner">
                          </select-tree>
                      </el-form-item>
                </el-col>
                <el-col :span="5">
                      <el-form-item label='设备类型' class='typeInfo-el-form-item' prop='devType'>
                          <el-cascader v-model='queryForm.devType' :props="{value: 'devTypeNum',label: 'devType'}"
                          placeholder="---请选择---" :options='deviceTypeSpinner'></el-cascader>
                      </el-form-item>
                </el-col>
                <el-col :span="2" class="searchBtnMarginTop">
                      <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                </el-col>
                <el-col  :span="2" class="searchBtnMarginTop">
                      <el-button type='warning' size='mini' icon='el-icon-refresh' @click='clearForm("queryForm")'>重置</el-button>
                </el-col>
            </el-row>
            
        </el-form>
        <el-table ref="tableData" 
          :data='tableData' height="460"
            @selection-change="tableSelect" 
            header-row-class-name="tableHeaderClass"
            class="tableMarginTop"
            border
            :reserve-selection="true"
            >
            <el-table-column type='selection' width="40" ></el-table-column>
            <!-- 这里的prop按照返回的字段去更新 -->
            <el-table-column prop='devNum' label='设备编号' fixed ></el-table-column>
            <el-table-column prop='branchNo' label='机构编号' ></el-table-column>
            <el-table-column prop='branchName' label='网点名称' ></el-table-column>
            <el-table-column prop='devType' label='设备类型' ></el-table-column>
            <el-table-column prop='devAssortmentName' label='设备描述'></el-table-column>
        </el-table>
        <div class="box">
          <el-pagination background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 50,100]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tableTotal"> 
          </el-pagination>
         </div>
      </el-card>
       <!-- <div class="returnBtn"><a  style="color:#409EFF" @click="isShow=false">返回</a> </div> -->
   </div>
   <div slot="footer" >
      <el-button type='default' size="mini" @click="isShow=false">取消</el-button>
      <el-button type='primary' size='mini'  @click="submit">绑定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import selectTree from "@/components/selectTree2/";

import request from "@/utils/request";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";
import InquireModel from "@/message/deviceRunManage/dev-run-info-query";
import alertBind from "@/message/alertManage/warning/alert-bind";

export default {
  components: { selectTree },
  data() {
    return {
      loading: false,
      devId:[],
      //表格
      loading:false,
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      tableData: [],
      tableTotal: 0,
      //下拉框
      brnoSpinner: [], //网点名称
      deviceTypeSpinner: [],  //设备类型
      //请求
      queryForm: {  //表单
        selBrno:[],
        branchNo:"",
        alertType: [],
        devType: []
      }
    };
  },
  props: ["option", "currentSelect"],
  methods: {
    handleCurrentChange() {
      this.queryModel();
    },
    handleSizeChange() {
      this.queryModel();
    },
    tableSelect(selection,value) { //表格选中
      this.devId=""
      selection.forEach(element => {
        this.devId=this.devId+element.devId+","
      });
      this.devId=this.devId.slice(0,this.devId.length-1)
    },
    submit() { //绑定设备
      let resBody = new alertBind();
      this.loading=true;
      resBody.data.policyId = this.currentSelect[0].policyId;
      resBody.data.devId = this.devId;
       request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading=false;                
                this.$message({
                  type: "success",
                  message: "预警策略绑定设备成功!"
                });
                this.isShow = false;
                this.$emit("refreshTable");
              }else{
                this.loading=false;                                
              }
            })
            .catch(error => {
                this.loading=false;                              
              console.log(error);
            });
    },
    async queryModel() {  //查询表格
      this.loading = true;
      //请求表格  当然还要带上传入的机具ip还是id什么的balabala
      let resBody = new InquireModel();//要改
      resBody.data.BranchId = this.queryForm.selBrno[0];
      resBody.data.deviceType = this.queryForm.devType;

      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;

      let response = await request(resBody);
      console.log(response);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.devRunningInfoList;
        this.tableTotal = response.RSP_BODY.total||response.QUERY_INFO_HEAD.QueryAllDataCount||this.tableData.length;
      } else {
        this.$message({
          type: "error",
          message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
        });
      }
    },
    openbind(){
      this.queryModel();
    },
    clearForm(item) {
      this.queryForm.selBrno=[];
      this.$refs[item].resetFields();
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
  async created() {
    let resBody = new spinnerList();
    resBody.data.spinnerList = [
      { spinnerName: "branch" },
      { spinnerName: "devType" }
    ];
    let response = await request(resBody);

    if (response.SYS_HEAD.ReturnCode == "000000") {
      //在之后要塞入空选项
      this.brnoSpinner = response.RSP_BODY.branchSpinner;
      this.deviceTypeSpinner = response.RSP_BODY.deviceTypeSpinner||[];
      this.deviceTypeSpinner.unshift({});
    } else {
      this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
      });
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  watch: {
    "option.isShow"() {
      //在页面切换时将事件给父元素使其能重新在表格中选中已选项并控制按钮的禁用情况
    },
    deep: true
  }
};
</script>

<style lang="scss" scope>
.bindPopCard{
  height:650px;
  overflow: auto;
}
.bindPopCard::-webkit-scrollbar{
  display:none;
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
.el-card{
  overflow: inherit;
}
</style>
