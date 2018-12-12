<template>
  <div style="height:100%" v-loading="loading"
    element-loading-text="加载中。。。">
    <component :is='dialogList.businessMode' :businesData='businesDataMode' @refreshTable="queryMengGroup"></component>
    <!-- <business-mode :option="businessData"></business-mode> -->
  </div>
</template>

<script>
import businessMode from "../businessMode/businessMode";
import getGlobalParams from "@/utils/getGlobalParams";
import request from "@/utils/request";
import queryGroup from '@/message/resourceManage/menu/menuGroup/menu-group-query'
export default {
  data() {
    return {
      loading:false,
      dialogList: { businessMode },
      currentPage: 1,
      pageSize:undefined,
      businesDataMode: {  //业务模块得数据及配置
        isShowChecked: false,//是否显示复选框
        isShow: true,  //是否显示
        tileMenuData: [], //表格数据
        selRows: []  //选中得表格数据
      },
    };
  },
  mounted(){
    this.pageSize=getGlobalParams.get('PageSize')
    this.queryMengGroup()
  },
  methods:{
    queryMengGroup(){//查询业务模块表格数据
      this.businesDataMode.tileMenuData=[]
      this.loading=true;
      let resBody = new queryGroup();
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
         if (response.SYS_HEAD.ReturnCode === "000000") {
             this.loading=false
           if( response.RSP_BODY){
              // 先将json对象转为json字符串，再替换你要替换的属性名，（因为预览模块需要得数据格式是统一得 size）最后再转为json对象 
            this.businesDataMode.tileMenuData = JSON.parse(JSON.stringify(response.RSP_BODY.resultSet).replace(/menuSize/g,"size"));
            for (let i = 0; i < this.businesDataMode.tileMenuData.length; i++) {           
              for (let j = 0; j <this.businesDataMode.tileMenuData[i].items.length; j++) {//将isEnabled改为boolearn类型
                if(this.businesDataMode.tileMenuData[i].items[j].isEnabled=="1"){
                  this.businesDataMode.tileMenuData[i].items[j].isEnabled=true
                }else if(this.businesDataMode.tileMenuData[i].items[j].isEnabled=="0"){
                  this.businesDataMode.tileMenuData[i].items[j].isEnabled=false
                }
              
              } 
            }
          }else{
               this.$message({
                type: "warning",
                message: "没有满足条件得记录!"
              });
           }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
};
</script>

<style lang="scss">
</style>
