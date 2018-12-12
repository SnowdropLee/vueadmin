<template>
  <div v-loading="loading"
             element-loading-text="加载中。。。">
    <el-dialog title="广告详情" :visible.sync="isShow" width="900px" :lock-scroll=false>
      <el-form :model="form" size="mini" label-position='top'>
        <el-row :gutter="10">
          <el-col :md="8" :lg="6">
            <el-form-item label="是否在交易中">
                <el-select prop="ifInTrade" v-model="form.ifInTrade" placeholder="请选择是否在交易当中">
                    <el-option label="是" :value=true></el-option>
                    <el-option label="否" :value=false></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :lg="6">
            <el-form-item label="是否播放默认">
                <el-select prop="ifDefault" v-model="form.ifDefault" placeholder="请选择是否播放默认广告">
                    <el-option label="是" :value=true></el-option>
                    <el-option label="否" :value=false></el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
        <el-carousel indicator-position="outside">
            <el-carousel-item v-for="item in showArr" :key="item.id" style="text-align: center;">
            <!-- <h3>{{ item+" 广告图片" }}</h3> -->
              <img :src="item.path" alt="" style="height:100%;">
            </el-carousel-item>
        </el-carousel>

      <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="isShow = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    option: Object,
    showData: Object
  },
  data() {
    return {
      loading: false,
      showArr:[],
      form:{
        ifInTrade:true,
        ifDefault:false
      }
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.advertisingDetailIsShow;
      },
      set: function(newVal) {
        this.option.advertisingDetailIsShow = newVal;
      }
    },
    //为了解决：src的加载问题
    // computedImgSrc(src){
    //   console.log(src);
    //   // var temp=require("http://192.9.200.225:8023/be096b63f6246b60af0c2394e9f81a4c500fa2d4.jpg");
    //   return src
    // }
  },
  methods: {
    itemSrc(val){
      // return require(val);
      // var temp=require(val);
      // console.log(temp);
      // var temp=require("http://192.9.200.225:8023/be096b63f6246b60af0c2394e9f81a4c500fa2d4.jpg");
      return val;
    },
    changeHandel(){
      this.putDataInArr();
    },
    //根据选项分类数据并填入showArr
    putDataInArr(){
      var keyWord='';
      if(this.form.ifInTrade){
        if(this.form.ifDefault){
          keyWord="TRANSDEFAULT";
        }
        else{
          keyWord="TRANSTIMELIMIT";
        }
      }
      else{
        if(this.form.ifDefault){
          keyWord="IDLEDEFAULT";
        }
        else{
          keyWord="IDLETIMELIMIT";
        }
      }
      this.showArr=[];
      this.showArr=JSON.parse(JSON.stringify(this.showData[keyWord]));
      console.log(this.showArr);
    }
  },
  watch:{
    showData(){
      this.putDataInArr();
    },
    "form.ifInTrade"(){
      this.putDataInArr();
    },
    "form.ifDefault"(){
      this.putDataInArr();
    },
    deep:true
  }
};
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
