<template>
  <div v-show='isShow'>
      <el-card style="min-height:600px;background:#eee;overflow-x:auto;"> 
        <aui-tele-menu 
          :tileMenuData="tileMenuData" 
          :tileMenuConfig="tileMenuConfig" v-if="isShowPreview"
          ></aui-tele-menu>
      </el-card>
      <div class="returnMenuDetail el-icon-back" @click="isShow=false;">
      </div>
      <!-- <el-row style="margin:20px 0;text-align:right">
        <el-button type="primary" size='mini' @click="isShow=false;">返回</el-button>
      </el-row> -->
  </div>
</template>

<script>
import tileMenuConfig from "../../../../../../static/tile-menu-config.json"; //配置文件
import auiTeleMenu from "@/components/tileMenu/TileMenu";

export default {
   props:{option:Object},
     components: { auiTeleMenu },

   data(){
       return{
          tileMenuConfig: undefined, //创建数据
          tileMenuData:[],
          isShowPreview:false,
       }
   },
   methods:{
     openDialog(){
      this.isShowPreview=false;
      let tileMenuData=this.option.menuList
      tileMenuData= JSON.parse(JSON.stringify(tileMenuData).replace(/menuSize/g,"size"));
      for (let i = 0; i < tileMenuData.length; i++) {  
        for (let k = 0; k <  tileMenuData[i].length; k++) {
           for (let j = 0; j <tileMenuData[i][k].items.length; j++) {//将isEnabled改为boolearn类型
              if(tileMenuData[i][k].items[j].isEnabled=="1"){
                tileMenuData[i][k].items[j].isEnabled=true
              }else if(tileMenuData[i][k].items[j].isEnabled=="0"){
                tileMenuData[i][k].items[j].isEnabled=false
              }
            
            } 
          
        }
       
      }
      this.tileMenuData=Object.assign([],tileMenuData)
      setTimeout(() => {
       this.isShowPreview=true;        
      }, 0);
     },
      
   },
   watch:{
    option: {
      handler: function (val, oldVal) {
       if (this.option.hasOwnProperty("menuList")) {
        this.openDialog()
      }
      },
      deep: true
    }
  },
  computed:{
      isShow:{
         get:function(){
            return this.option.isShow;
         },
         set:function(newValue){
           this.option.isShow=newValue;
         }
      }
  },
  mounted(){
    this.tileMenuConfig = tileMenuConfig;//配置文件
  }
}
</script>

<style lang="scss" scoped>
.returnMenuDetail{
  width:50px;
  height:60px;
  background:#000;
  opacity:.1;
  position:fixed;
  top:50%;
  right:20px;
  border-radius: 3px;
  text-align:center;
  padding-top:20px;
  color:#fff;
}
.returnMenuDetail:hover{
   opacity:.5;
   cursor:pointer;
}
</style>
