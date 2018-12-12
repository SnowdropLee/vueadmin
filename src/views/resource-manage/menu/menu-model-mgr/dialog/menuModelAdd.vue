<template>
  <div  v-if="isShow" v-loading="loading"
    element-loading-text="加载中。。。">
    <div v-if="!(isShowAdd || isShowMod)">
      <el-card>
        <el-form ref='menuModelAdd' :model='menuModelAdd' :rules="rules" size="mini" inline label-width="90px" label-position="left">
          <el-row>
            <el-col :span='6' >
              <el-form-item label="菜单名称:" prop='modelName'>
                <el-input placeholder="请输入菜单名称" v-model="menuModelAdd.modelName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card style="margin-top:10px;">
        <el-row :gutter="10">
          <el-col :lg="8" :md="24" style="margin-bottom:20px">
            <el-card class="modelStyle" >
                <el-button type="primary" size="mini" icon='el-icon-plus' @click="addCols">新增列</el-button>
                <!-- 列表 -->
                  <div class="businessBox">
                    <el-card v-for="item in businesList" :key="item.id" shadow="hover" style="margin-top:5px;">
                      <el-row>
                        <el-col :span="20">
                          <el-form label-position="left" inline class="demo-table-expand" label-width="115px">
                            <el-row>
                              <el-col :span="21">
                                <el-form-item label="菜单列号:">
                                  <span>{{item.id}}</span>
                                </el-form-item>
                              </el-col>  
                              <el-col>
                                <el-form-item label="业务模块:">
                                    <span>{{item.businesModelText.join(',')}}</span>
                                </el-form-item>
                              </el-col> 
                            </el-row>
                          </el-form>
                        </el-col>
                        <el-col :span="4">
                          <div class="listEdit">
                            <a @click="modBusList(item)"><i class="el-icon-edit" ></i></a>
                            <a @click="delBusList(item)"><i class="el-icon-circle-close-outline"></i></a>
                          </div> 
                        </el-col>
                      </el-row>
                    </el-card>
                  </div>
            </el-card>
          </el-col>
          <el-col :lg="16" :md="24" >
            <el-card  class="modelStyle" >
              <div slot="header" style="color:#606266;"><span>预览菜单</span></div>
              <aui-tele-menu :tileMenuData="tileMenuData" :tileMenuConfig="tileMenuConfig" v-if="isShowPreview"></aui-tele-menu>
            </el-card>
          </el-col>
        </el-row>
        <el-row> 
          <el-col :span='6' :offset="8"><el-button size='mini' @click="clearDate">返回</el-button></el-col>                         
          <el-col :span='6' ><el-button type='primary' size='mini' @click="addBusines">确定</el-button></el-col>    
        </el-row>
      </el-card>
    </div>    
    
    <!-- 新增 -->
    <transition name="el-zoom-in-center">
      <div v-if="isShowAdd" class="businessModel">
        <component :is='dialogList.businessMode' :businesData='businesDataMode' @businesData="returnData" @refreshTable="getDate" @refreshModel="refreshModel"></component>
        <el-row style="margin:10px 0;text-align:center">
          <el-col :span="4" :offset="8">
            <el-button size="mini" @click=" isShowAdd=false;selBusines=[]">取消</el-button>
          </el-col>
          <el-col :span="4" >
            <el-button size="mini" type="primary" @click="addBusModel">确定</el-button>
          </el-col>
        </el-row>
        
      </div>
    </transition> 
    <!-- 修改  -->
    <transition name="el-zoom-in-center">
      <div v-if="isShowMod" class="businessModel">
        <component :is='dialogList.businessMode' :businesData='businesDataMode' @businesData="returnData"  @refreshTable="getDate" @refreshModel="refreshModel"></component>
        <el-row style="margin:10px 0;">
          <el-col :span="4" :offset="8">
            <el-button size="mini" @click="modCancle">取消</el-button>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-button size="mini" type="primary" @click="modBusModel">确定</el-button>
          </el-col>
        </el-row>
        
      </div>
    </transition> 
  </div> 
</template>

<script>
import tileMenuConfig from "../../../../../../static/tile-menu-config.json"; //配置文件
import auiTeleMenu from "@/components/tileMenu/TileMenu";
import businessMode from "../../businessMode/businessMode";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import menuModelUser from "@/message/resourceManage/menu/menuModel/menu-model-user-query";
import queryGroup from "@/message/resourceManage/menu/menuGroup/menu-group-query";
import AddMenuModel from "@/message/resourceManage/menu/menuModel/menu-model-add";
import toolBox from "@/utils/toolBox";

export default {
  props: { option: Object },
  components: { auiTeleMenu },
  data() {
    return {
      loading:false,
      businesModelMod: undefined,
      isShowPreview: true,
      tileMenuData: [], //创建数据
      tileMenuConfig: undefined, //创建数据
      maxLength: 2, //最多选择的业务模块
      businesid: "", //当前修改删除元素的id
      selBusines: [], //当前选中元素
      dialogList: { businessMode },
      businesDataMode: {
        isShowChecked: true,
        isShow: true,
        tileMenuData: [],
        selRows: []
      },
      busineTtileMenuData: [
      ], //业务模块表格数据
      busineTtileMenuDataCopy:[],
      menuModelAdd: {
        modelName: "",
        menuGroupId:""
      },
      businessBox: [],
      menuItemClickEffact: [],
      isShowAdd: false,
      isShowMod: false,
      businesList: [],//添加的菜单数据
      cols: 0,
      isEdit: false,
      isItem: "",
      removeItems: "",
      currentPage: 1,
      pageSize: undefined,
      rules:{
        modelName:[
          { required: true, message: "菜单名称必填！", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.pageSize = getGlobalParams.get("PageSize");
    
  },
  methods: {
      // 清空数据，添加完或者直接返回
    clearDate(){
      this.businesList=[];
      this.tileMenuData=[];
      this.cols=0;
      this.selBusines=[];
      this.isShow=false;
      this.menuModelAdd.modelName=""
      // console.log(this.busineTtileMenuDataCopy)
      // if(this.busineTtileMenuDataCopy.length>0){
      //   this.busineTtileMenuData=Object.assign([],this.busineTtileMenuDataCopy)
      // }
      this.getDate()
    },
    refreshModel(){
      this.isShowAdd=false;
      this.isShowMod=false;
      this.clearDate()
      this.isShow=true;
    },
    addCols(){//新增列按钮单击事件
      this.businesDataMode.selRows=[];
      this.isShowAdd=true;
      this.selBusines=[];
    },
    modCancle() {//修改列得业务模块的单击事件
      this.isShowMod = false;
      this.isRemove();
    },
    isRemove() {//是否从表格移除一项数据，及是否被其他列已经选择
      for (let j = 0; j < this.businesModelMod.length; j++) {
        for (let i = 0; i < this.busineTtileMenuData.length; i++) {
          if (this.busineTtileMenuData[i].gid == this.businesModelMod[j].gid) {
            this.busineTtileMenuData.splice(i, 1);
            break;
          }
        }
      }
    },
    returnData(data) {//业务模块组件返回的已经选中的数据
      this.selBusines = data;
    },
    addBusines() {//添加菜单 调后台服务
     this.$refs["menuModelAdd"].validate(valid => {
        if (valid) {
          if (this.businesList.length>0) {
            this.menuModelAdd.menuGroupId=[]
            for (let i = 0; i <this.businesList.length; i++) {
              let menuGroupId="";
              for (let j = 0; j < this.businesList[i].businesModel.length; j++) {
                menuGroupId+=this.businesList[i].businesModel[j].gid+","
              }
              menuGroupId= menuGroupId.slice(0, menuGroupId.length-1)
              this.menuModelAdd.menuGroupId[i]=menuGroupId
            }
            this.loading=true
            let resBody = new AddMenuModel();
            resBody.data.group_Ids = this.menuModelAdd.menuGroupId;
            resBody.data.modelName = this.menuModelAdd.modelName;
            resBody.data.createTime = toolBox.getNowTime(0);
            resBody.data.groupFields = this.menuModelAdd.menuGroupCol;
            request(resBody)
              .then(response => {
                if (response.SYS_HEAD.ReturnCode === "000000") {
                  this.loading=false         
                  this.$message({
                    type: "success",
                    message: "菜单创建成功!"
                  });
                  this.isShow = false;
                  this.$emit("refreshTable");
                  this.clearDate();
                }else{
                   this.loading=false                     
                }
              })
              .catch(error => {
                this.loading=false                   
                console.log(error);
              });
          }
          else{
            this.$message({
              type: "warning",
              message: "请选择业务模块!"
            });
          }
        }else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
        })
    },
    addBusModel() {//将选中的业务模块添加到某一列
     if (this.selBusines.length>0) {
        this.isShowAdd = false;
        let selBusinesText = [];      
        for (let i = 0; i < this.selBusines.length; i++) {
          //this.selBusines 也就是不可再选中的数据
          for (let k = 0; k < this.busineTtileMenuData.length; k++) {
            if (this.busineTtileMenuData[k].gid == this.selBusines[i].gid) {
              this.busineTtileMenuData.splice(k, 1);
              break;
            }
          }
          selBusinesText.push(this.selBusines[i].categoryName); //取到要显示的每列的业务模块名称
        }
        this.businesList.push({
          //将添加的业务模块添加到businesList
          id: ++this.cols,
          businesModel: this.selBusines,
          businesModelText: selBusinesText //显示的文字
        });
        this.listBusines();
     }else{
      this.$message({
        type: "warning",
        message: "请选择业务模块!"
      });
     }
      
    },
    listBusines() {//取到用于预览菜单的数据
      let tileMenuDataLet = [];
      this.tileMenuData = [];
      for (let i = 0; i < this.businesList.length; i++) {
        tileMenuDataLet = []; //保存每列的业务模块数据用于展示
        for (let j = 0; j < this.businesList[i].businesModel.length; j++) {
          tileMenuDataLet.push(this.businesList[i].businesModel[j]);
        }
        this.$set(this.tileMenuData, i, tileMenuDataLet); //this.tileMenuData 展示的菜单数据
      }
      this.isShowPreview = false;
      setTimeout(() => {
        this.isShowPreview = true;
      }, 0);
    },
    modBusModel() {//修改选择的业务模块
      if (this.selBusines.length>0) {
        this.isShowMod = false;
        let selBusinesText = [];
        let tileMenuDataLet = [];
        for (let i = 0; i < this.selBusines.length; i++) {
          //this.selBusines 也就是不可再选中的数据
          for (let k = 0; k < this.busineTtileMenuData.length; k++) {
            if (this.busineTtileMenuData[k].gid == this.selBusines[i].gid) {
              this.busineTtileMenuData.splice(k, 1);
              break;
            }
          }
          selBusinesText.push(this.selBusines[i].categoryName); //取到要显示的每列的业务模块名称
        }
        for (var i = 0; i < this.businesList.length; i++) {
          if (this.businesList[i].id === this.businesid) {
            this.businesList[i].businesModel = Object.assign([], this.selBusines);
            this.businesList[i].businesModelText = selBusinesText;
            break;
          }
        }
        this.listBusines();
      }else{
        this.$message({
          type: "warning",
          message: "请选择业务模块!"
        });
      }
      
    },
    modBusList(item) {//回显修改数据
      this.businesid = item.id; //当前选中的列
      // this.businesGid=item.gid
      this.businesModelMod = item.businesModel;
      for (let i = 0; i < item.businesModel.length; i++) {
        this.busineTtileMenuData.unshift(item.businesModel[i]);
      }
      this.businesDataMode.selRows = item.businesModel;
      this.isShowMod = true;
    },
    delBusList(item) {
      for (var i = 0; i < this.businesList.length; i++) {
        if (this.businesList[i].id === item.id) {
          this.businesList[i].businesModel.forEach(element => {
            this.busineTtileMenuData.push(element);
          });
          this.businesList.splice(i, 1);
          for (let j = i; j < this.businesList.length; j++) {
            this.businesList[j].id = j + 1;
          }
          // this.businesList.splice(i, 1);
          this.cols--;
          this.listBusines();
          break;
        }
      }
    },
    initTableData(){ //格式化预览窗口数据
        this.busineTtileMenuData = JSON.parse(JSON.stringify( this.busineTtileMenuData).replace(/menuSize/g,"size"));
        this.businesDataMode.tileMenuData=this.busineTtileMenuData
        for (let i = 0; i < this.businesDataMode.tileMenuData.length; i++) { 
          for (let j = 0; j <this.businesDataMode.tileMenuData[i].items.length; j++) {//将isEnabled改为boolearn类型
            if(this.businesDataMode.tileMenuData[i].items[j].isEnabled=="1"){
              this.businesDataMode.tileMenuData[i].items[j].isEnabled=true
            }else if(this.businesDataMode.tileMenuData[i].items[j].isEnabled=="0"){
              this.businesDataMode.tileMenuData[i].items[j].isEnabled=false
            }
          
          } 
        }
    },
    getDate() {
      let resBody = new queryGroup();
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            if (response.RSP_BODY) {
              this.busineTtileMenuData = response.RSP_BODY.resultSet; //表格数据，业务模块
              this.initTableData()
              // this.busineTtileMenuDataCopy=Object.assign([],this.busineTtileMenuData)
            } else {
              this.$message({
                type: "warning",
                message: "没有满足条件得记录!"
              });
            }
          }
        })
        .catch(error => {
            this.loading = false;          
          console.log(error);
        });
    }
  },
  watch: {
    busineTtileMenuData: function() {
      this.businesDataMode.tileMenuData =this.busineTtileMenuData//JSON.parse(JSON.stringify( this.busineTtileMenuData).replace(/menuSize/g,"size"));
    }
  },
  mounted() {
    // 在需要使用本组件的文件中创建数据和配置
    // this.tileMenuData=tileMenuData
    // this.businesDataMode.tileMenuData=this.busineTtileMenuData
    this.getDate();
    this.tileMenuConfig = tileMenuConfig;
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
  }
};
</script>

<style lang="scss" scoped>
.modelStyle::-webkit-scrollbar {
  display: none;
}
.modelStyle {
  height: 630px;
  overflow-y: auto;
  background: #eee;
  opacity: 0.8;
}
.v-modal {
  z-index: 2000 !important;
}
.businessModel {
  // position: fixed;
  // top: 50px;
  // left: 0;
  // // bottom: 0;
  // width: 100%;
  // height: 100%;
  // z-index: 5000;
  // background: #eee;
  // // opacity: 0.9;
  // padding: 20px;

  .el-form-item__label {
    // color:#fff;
    margin-left: 8px;
  }
  .el-checkbox-button,.el-checkbox-button__inner {
    margin: 5px;
  }
  .el-checkbox-button:first-child.el-checkbox-button__inner {
    border-left: none;
    border-radius: 0px;
  }
  .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 0px;
  }
  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border-radius: 0px;
  }
}
</style>
