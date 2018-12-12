<template>
  <div visible.sync="optons.isShow">
      <el-table  ref="dataTypeInfo" :data='dataTypeInfoPage' border   width='100%' style="min-height:392px"
          class="tableMarginTop"
          header-row-class-name="tableHeaderClass"
            highlight-current-row 
            @selection-change="handleCurrentChange"
            >
          <el-table-column type="selection" width="40px"></el-table-column>
          <el-table-column prop='devNum' label='设备编号' ></el-table-column>
          <el-table-column prop='branchNo' label='机构号'></el-table-column>
          <el-table-column prop='devAssortmentName' label='设备分类' ></el-table-column>
          <el-table-column prop='devType' label='设备类型' ></el-table-column>
          <el-table-column prop='devIp' label='设备IP' ></el-table-column>
          <el-table-column prop='brandName' label='品牌名称' ></el-table-column>
          <el-table-column prop='devState' label='设备使用状态' :formatter="dataFormat"></el-table-column>
          <el-table-column prop='devCreateDate' label='设备登记日期' :formatter="tableDateFormat"></el-table-column>
          <el-table-column prop='devCreateTime' label='设备登记时间' :formatter="dataFormatTime"></el-table-column>
    </el-table>
    <!-- :formatter="dataFormat" -->
    <div style="text-align:right;margin-top:20px;">
      <el-pagination background
          :page-size="pageSize"
          :current-page="currentPage"
          layout="total, prev, pager, next, jumper"
          :total="dataTypeInfo.length"
          @current-change="changePage"> 
      </el-pagination>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import toolBox from "@/utils/toolBox";

export default {
  props: {
    optons: Object
  },
  data() {
    return {
      dataTypeInfo: [],
      currentPage: 1,
      pageSize: undefined,
      deviceStatus:{},
      comDeviceStatuSpinner:{}
    };
  },
  beforeUpdate() {
    //更新之前
     this.dataTypeInfo = this.optons.devInfoList;
  },
  created() {
    this.pageSize=getGlobalParams.get("PageSize"); 
    let resBody = new devRunList();
    resBody.data.spinnerList = [
      { spinnerName: "devStatus" },    
    ];
    request(resBody)
      .then(response => {
        this.comDeviceStatuSpinner = toolBox.objArray2Hash(response.RSP_BODY.devRunningStatusSpinner.devStateList, "devState");        
     })
      .catch(error => {
        console.error("查询错误", error);
      });
  },
   computed: {
    dataTypeInfoPage() {
      return  this.dataTypeInfo? this.dataTypeInfo.slice((this.currentPage - 1) * this.pageSize,this.currentPage * this.pageSize):[];
    }
  },
  methods: {
    dataFormat(row, column) {
      //枚举设备形式
      if( this.comDeviceStatuSpinner[row[column.property]]!==undefined && this.comDeviceStatuSpinner[row[column.property]].devStateName!==undefined){
        return this.comDeviceStatuSpinner[row[column.property]].devStateName;
      }
    },
    tableDateFormat(row, column){
      return toolBox.timeFormat2Date(row[column.property])
    },
    dataFormatTime(row, column){
      return toolBox.timeFormat2Time(row[column.property])
    },
     changePage(val) {
      this.currentPage = val;
    },
    handleCurrentChange(val) {
      this.$emit("rowDate",val)
      if (val.length ==1) {
        this.$emit("isEnabled",true)
      } else {
        this.$emit("isEnabled",false)
        
      }
    },
  }
};
</script>
<style lang="scss" scoped>

</style>
