<template>
  <div class="photoWall">
    <div class="photoWallItem" ref="tempDataArr" :class="{selected:item.selectedFlag}" v-for="(item,index) in tempDataArr" :key="index+''+Math.random()" >
      <img :src="item[filePathStr]" @click="clickPanel($event,item)" alt="">
    </div>
  </div>
</template>

<script>
export default {
  created() {
    
  },
  beforeMount(){
  },
  mounted(){
    this.init();
  },
  data() {
    return {
      tempDataArr:{}
    }
  },
  watch: {
    // data(){
    //   this.init();
    // },
    selection(){
      this.refreshSelection();
    },
    tempDataArr(){},
    deep:true
  },
  methods: {
    //初始化
    //深复制data用作组件数据
    init(){
      this.tempDataArr=JSON.parse(JSON.stringify(this.data));
        for(var i=0;i<this.tempDataArr.length;i++){
          this.tempDataArr[i].selectedFlag=false;
        }
      this.refreshSelection();
    },
    //循环selection选中数据
    refreshSelection(){
        //循环selection并给每一个对应的对象添加选中属性
      if(this.selection&&this.selection.length!=0){
        for(var i=0;i<this.selection.length;i++){
          for(var k=0;k<this.tempDataArr.length;k++){
            if(this.tempDataArr[k][this.idStr]==this.selection[i]){
              this.tempDataArr[k].selectedFlag=true;
              // var tempObj=JSON.parse(JSON.stringify(this.tempDataArr[k]));
              // this.tempDataArr[k]=tempObj;
              break;
            }
          }
        }
      }
      //刷新整个组件
      // this.tempDataArr=JSON.parse(JSON.stringify(this.tempDataArr));
    },
    //根据已选返回已选数组对象
    returnSelectedArr(){
      var output=[];
      for(var i=0;i<this.tempDataArr.length;i++){
        if(this.tempDataArr[i].selectedFlag==true){
          output.push(this.data[i]);
        }
      }
      return output
    },
    //点击panel
    clickPanel(e,item){
      // console.log(e.target.parentNode.classList.add("selected"));
      // item.selectedFlag=!item.selectedFlag;
      // item=JSON.parse(JSON.stringify(item));

      // this.$set(this.tempDataArr[index],'selectedFlag',!item.selectedFlag);
      // this.$set(item.selectedFlag,!item.selectedFlag);
      // var id=item.[this.idStr];
      //对老子就是疯了怎么的
      if(item.selectedFlag==true){
        item.selectedFlag=false;
        e.target.classList.remove("selected");
      }
      else if (item.selectedFlag==false){
        item.selectedFlag=true;
        e.target.classList.add("selected");
      }
      var outputItem={};
      // 返回对象
      for(var i=0;i<this.data.length;i++){
        if(this.data[i][this.idStr]==item[this.idStr]){
          outputItem=this.data[i];
          break
        }
      }
      // 将选中的对象数组返回
      var selected=this.returnSelectedArr();
      // 将选中的id数组返回
      this.$emit('clickPanel',outputItem,selected);
    }
  },
  props:['idStr','filePathStr','data','selection']
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.photoWall{
  // border: 1px solid #000;
  display:flex;
  align-items:center;
  flex-flow:row wrap;
  .photoWallItem{
    max-width:220px;
    img{
      cursor: pointer;
      width:100%;
      border:2px solid  transparent;
      &.selected{
        border:2px solid  #08f;
      }
    }
  }
}
</style>
