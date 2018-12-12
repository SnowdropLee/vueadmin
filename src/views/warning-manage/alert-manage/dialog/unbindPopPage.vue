<template>
  <el-dialog title='解绑设备' :visible.sync='isShow' width='970px' :lock-scroll=false
    :close-on-click-modal=false
    @open="openUnbind"
    @close="closeCallback">
   <div  class="detailInfo"  v-loading="loading">
      <el-card class='bindPopCard'>
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
          <el-table-column prop='devId' label='设备编号' fixed ></el-table-column>
          <el-table-column prop='branchNo' label='机构编号' ></el-table-column>
          <el-table-column prop='branchName' label='网点名称' ></el-table-column>
          <el-table-column prop='devType' label='设备类型' ></el-table-column>
          <el-table-column prop='devDescribe' label='设备描述'></el-table-column>
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
      <el-button type='primary' size='mini'  @click="submit">解绑</el-button>
    </div>
  </el-dialog>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import selectTree from "@/components/selectTree2/";

import request from "@/utils/request";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";
import InquireUnbind from "@/message/alertManage/warning/alert-unbindTable";
import alertUnbind from "@/message/alertManage/warning/alert-unbind";

export default {
  components: { selectTree },
  data() {
    return {
      devId:'',
      //表格
      loading:false,
      currentPage: 1,
      tableTotal:0,
      pageSize: getGlobalParams.get("PageSize"),
      tableData: [],
      //下拉框,目前无用
      brnoSpinner: [],
      deviceTypeSpinner: [],
      //请求，暂时用不到
      queryForm: {
        branchNo:"",
        alertType: [],
        strategyDes: "",
        devType: []
      }
    };
  },
  props: ["option", "currentSelect"],
  methods: {
    closeCallback(){
      this.devId='';
    },
    handleCurrentChange() {
      this.queryModel();
    },
    handleSizeChange() {
      this.queryModel();
    },
    //需要修改
    tableSelect(selection) {
       this.devId="";
       selection.forEach(element => {
         this.devId=this.devId+element.devId+",";
       });
       this.devId=this.devId.slice(0,this.devId.length-1);
    },
    openUnbind(){
       this.queryModel()
    },
    submit() {
      let resBody = new alertUnbind();//要改
      this.loading=true;
      resBody.data.policyId = this.currentSelect[0].policyId;
      resBody.data.devId = this.devId;
       request(resBody)
            .then(response => {
              this.devId='';
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading=false;                
                this.$message({
                  type: "success",
                  message: "预警策略解绑设备成功!"
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
    async queryModel() {
      this.loading = true;
      //请求表格  当然还要带上传入的机具ip还是id什么的balabala
      let resBody = new InquireUnbind();//要改
      resBody.data.policyId =this.currentSelect[0].policyId;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.resultSet;
        this.tableTotal = Number(response.RSP_BODY.total);
      } else {
        this.$message({
          type: "error",
          message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
        });
      }
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
