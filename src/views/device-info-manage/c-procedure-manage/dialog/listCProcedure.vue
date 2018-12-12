<template>
  <div :visible.sync="isShow">
    <el-table  ref="CProcedureInfoList" :data='InfoList'
      class="tableMarginTop" border
      header-row-class-name="tableHeaderClass"
      @selection-change="currentChange">
        <el-table-column type="selection" width="40px"> </el-table-column>
        <el-table-column prop='cProgramName' label='C端程序名称' min-width='107px'></el-table-column>
        <el-table-column prop='cProgramBasicName' label='C端基版程序名称' min-width='107px'></el-table-column>
        <el-table-column prop='installEnvironment' label='运行环境' min-width='107px'></el-table-column>
        <el-table-column prop='serviceProvider' label='厂商' min-width='107px'></el-table-column>
    </el-table>
    <div style="text-align:right;margin-top:20px;">
      <el-pagination background
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="InfoList.length"> 
      </el-pagination>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
export default {
  props: {
    optons: Object
  },
  data() {
    return {
      deviceFormEnum: {},
      currentRow: "",
      InfoList: [],
      currentRow: [],
      loading: false,
      currentPage: 1,
      checkedUser: false,  
      isDisabledDel: false
    };
  },
  beforeUpdate() {
    //更新之前
    this.InfoList = this.optons.CProcedureInfoList; //显示父组件传过来的数据
  },
  // created() {
  //   this.deviceFormEnum = getGlobalParams.get("deviceForm");
  // },
  computed: {
    isShow: {
      get: function() {
        return this.optons.isShow;
      },
      set: function(newValue) {
        this.optons.isShow = newValue;
      }
    }
  },
  methods: {
    // dataFormat(row, column) {
    //   //枚举设备形式
    //   return this.deviceFormEnum[row[column.property]];
    // },
    currentChange(val) {  //返回该表格选中的数据，并且返回该表格是否可以修改和删除
      this.currentRow = val;
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
  }
};
</script>
<style lang="scss" scoped>
.headerClass {
  background: #f7f7f7 !important;
}
</style>
