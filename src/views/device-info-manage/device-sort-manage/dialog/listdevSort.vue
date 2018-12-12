<template>
   <div  visible.sync=true>
      <el-table  ref="shortInfoList" :data='shortInfoList'  border style="min-height:390px"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
          @selection-change="handleCurrentChangeTable"
      >  
          <el-table-column type="selection" width="40px"></el-table-column>
          <el-table-column prop='devAssortmentName' label='设备分类' ></el-table-column>
          <el-table-column prop='devModel' label='设备型号' ></el-table-column>
          <el-table-column label='C端应用'>
          <template slot-scope="scope">
              <span  v-for="item in scope.row.cProgramList" :key="item.id">{{cProgramGroup(item.cProgramName)}}</span>
          </template>
          </el-table-column>
      </el-table>
      <div  style="text-align:right;margin-top:20px">
              <el-pagination background
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="10"
                  layout="total, prev, pager, next, jumper"
                  :total="shortInfoList.length"> 
              </el-pagination>
      </div>
   </div>
</template>
<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
export default {
  props:{optionSort:Object},
  data(){
    return{
      shortInfoList: [],
      pageSize:undefined,
      currentPage:1,
      checkedUser:undefined,
      isDisabledDel:undefined,
    }
  },
  created() {
    this.pageSize=getGlobalParams.get("PageSize");
  },
   beforeUpdate() {
    //更新之前
    this.checkedUser=false,
    this.isDisabledDel=false,
    this.shortInfoList = this.optionSort.devSortList;
  },
  computed:{
    modelInfoListPage(){
      return this.modelInfoList.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
    }
  },
  methods:{
     cProgramGroup(val){//去掉C端应用的","
      if(val){
        val+=","
      }
      val=val.slice(0,val.length-1)
      return val
    },
     handleCurrentChangeTable(val) {
       this.currentRow = val[0];
       this.$emit("rowDate",this.currentRow )
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
<style lang="scss" scoped>

</style>
