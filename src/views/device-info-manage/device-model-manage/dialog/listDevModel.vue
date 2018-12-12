<template>
   <div  visible.sync=true>
    <el-table  ref="modelInfoList" :data='modelInfoListPage'  border
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
         @selection-change="handleCurrentChangeTable"
      >  
          <el-table-column type="selection" width="40px"></el-table-column>
          <el-table-column prop='devModel' label='型号' width='160px' ></el-table-column>
          <el-table-column prop='devType' label='设备类型' width='160px'></el-table-column>
          <!-- <el-table-column prop='devForm' label='设备形式' :formatter="dataFormat" width='160px'></el-table-column> -->
          <el-table-column prop='DevAssortmentName' label='使用台数' width='160px'></el-table-column>
          <el-table-column prop='devModuleId' :formatter="moduleFormat" label='模块'></el-table-column>
    </el-table>
    <div  style="text-align:right;margin-top:20px">
      <el-pagination background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="modelInfoList.length"> 
      </el-pagination>
    </div>
   </div>
</template>
<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
export default {
  props:{optionModel:Object},
  data(){
    return{
      modelInfoList: [],
      pageSize:undefined,
      currentPage:1,
      checkedUser:undefined,
      isDisabledDel:undefined,
      enumModule: {
        // 1: "发卡器",
        // 2: "读卡器",
        // 3: "指纹仪",
        // 4: "扫码器",
        // 5: "身份证阅读器",
        // 6: "存折阅读器"
      },
    }
  },
  created() {
    this.pageSize=getGlobalParams.get("PageSize");
  },
   beforeUpdate() {
    //更新之前
    this.checkedUser=false,
    this.isDisabledDel=false,
    this.modelInfoList = this.optionModel.devModelList;
    this.enumModule=this.optionModel.enumModule
  },
  computed:{
    modelInfoListPage(){
      return this.modelInfoList.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
    }
  },
  methods:{
     moduleFormat(row, column, cellValue, index) {
      //格式化模块
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      let value = cellValue.split("|");
      let module1 = "";
      for (let i = 0; i < value.length; i++) {
        module1 = module1 + this.enumModule[value[i]] + ",";
      }
      return module1.slice(0,module1.length-1);
    },
    handleCurrentChangeTable(val) {
      this.$emit("rowDate",val )
      if (val.length == 1) {
        this.checkedUser = true;
        this.isDisabledDel = true;    
      } else if (val.length > 1) {
        this.checkedUser = false;
        this.isDisabledDel = true;      
      } else {
        this.checkedUser = false;
        this.isDisabledDel = false;       
      }
      this.$emit("isEnabled",this.checkedUser,this.isDisabledDel)
    },  
    handleCurrentChange(val) {
      this.currentPage=val
    },
  },
}
</script>
<style lang="sass" scoped>

</style>
