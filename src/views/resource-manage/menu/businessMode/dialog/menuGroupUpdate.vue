<template>
  <div>
    <el-dialog title='修改业务模块' :visible.sync='isShow'  width="720px" @close="closeGroupMod"
            :close-on-click-modal=false  @open="openGroup">
      <div v-loading="loading">
        <el-card>
            <el-form ref='menuItemUpdate' :model='menuItemUpdate' :rules="rules" size="mini"  label-width="110px" label-position="left">
            <el-row :gutter="10">
                <el-col :span='12'>
                  <el-form-item label="业务模块标题:" prop='menuGroupTitle'>
                        <el-input v-model="menuItemUpdate.menuGroupTitle" placeholder="请输入菜单项标题"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="背景颜色:" prop='defaultColor'>
                          <el-color-picker size="small"
                          v-model="menuItemUpdate.defaultColor"
                          :predefine="predefineColors">
                          </el-color-picker>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span='12'>
                  <el-form-item label="业务模块行数:" prop='menuGroupRow'>
                        <el-input v-model="menuItemUpdate.menuGroupRow" placeholder="请输入菜单组行数"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label="业务模块列数:" prop='menuGroupCol'>
                        <el-input v-model="menuItemUpdate.menuGroupCol"  placeholder="请输入菜单组列数"></el-input>
                  </el-form-item>
                </el-col>
            </el-row>

            <el-row class="dealRow" :gutter="10">
              <el-col :span='24' >
                  <el-form-item label="交易:" prop='menuGroupDeal' style="width：100%">
                
                      <el-select v-model="menuItemUpdate.menuGroupDeal" 
                      multiple placeholder="请选择交易" >
                          <el-option
                          v-for="item in menuGroupDeal"
                          :key="item.value"
                          :label="item.TRADENAME"
                          :value="item.MENU_ID"
                          :disabled="item.disabled">
                          </el-option>
                      </el-select>
                  
              
                </el-form-item>
                  </el-col>
                <el-col :span="12"></el-col>
            </el-row>               
          </el-form>
        </el-card>
        <el-row style="margin:20px 0;text-align:right">
            <el-button size='mini' @click="isShow=false">返回</el-button>
            <el-button type='primary' size='mini' @click="updateMenuGroup">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import menuGroupUpdate from "@/message/resourceManage/menu/menuGroup/menu-group-update";
import tradeList from "@/message/resourceManage/menu/tradeList";
import getGlobalParams from "@/utils/getGlobalParams";

export default {
  props: { option: Object },
  data() {
    let validatorNumRow = (rule, value, callback) => {
      if (value != "") {
        let reg = /^[0-9]+$/;
        if (reg.test(value)&&value<4) {
          callback();
        } else {
          callback(new Error("请输入小于等于3的数字"));
        }
      } else {
        callback();
      }
    };
    let validatorNum = (rule, value, callback) => {
      if (value != "") {
        let reg = /^[0-9]+$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入小于等于3的数字"));
        }
      } else {
        callback();
      }
    };
    return {
      loading:false,
      menuItemUpdate: {
        menuGroupTitle: "",
        menuGroupRow: "",
        menuGroupCol: "",
				defaultColor: "#409EFF",
				menuGroupDeal:[]
      },
      defaultColor: "#409EFF",
      predefineColors: [],
      menuGroupDeal: [],
      rules: {
         defaultColor:[
           { required: true, message: "请选择背景颜色", trigger: "change" }          
        ],
        menuGroupTitle: [
           { required: true, message: "请输入标题", trigger: "blur" }
        ],
        menuGroupSize: [
           { required: true, message: "请选择大小", trigger: "blur" }
        ],
        menuGroupRow: [
           { required: true, message: "请输入行", trigger: "blur" },          
          { required: false, validator: validatorNumRow, trigger: "blur" }
        ],
        menuGroupCol: [
           { required: true, message: "请输入列", trigger: "blur" },          
          { required: false, validator: validatorNum, trigger: "blur" }
        ],
        menuGroupDeal:[
           { required: true, message: "请选择交易", trigger: "change" }
        ]
      }
    };
  },
  created(){
    this.predefineColors=getGlobalParams.get("predefineColors");
  },
  methods: {
    openGroup() {
      this.loading=true;
      let resBody = new tradeList();  //交易下拉框
      request(resBody)
      .then(response => {
        if (response.SYS_HEAD.ReturnCode === "000000") {
          this.loading=false;          
          this.menuGroupDeal=response.RSP_BODY.resultSet
          this.menuItemUpdate.menuGroupDeal=deal.length!=0?deal:undefined///////////////多选回显数组
        }else{
          this.loading=false;          
        }
      })
      .catch(error => {
        this.loading=false;                  
        console.log(error);
      });
      //数据回显
      this.menuItemUpdate.menuGroupTitle = this.option.currentRow.categoryName;
      this.menuItemUpdate.menuGroupRow = this.option.currentRow.layout[0];
      this.menuItemUpdate.menuGroupCol = this.option.currentRow.layout[1];
      this.menuItemUpdate.defaultColor = this.option.currentRow.themeColor;
      let deal=[]
      for (let i = 0; i <this.option.currentRow.items.length; i++) {
        deal[i]=this.option.currentRow.items[i].menu_Id
      }
      
    },
    closeGroupMod(){
      this.$refs["menuItemUpdate"].clearValidate(); //清楚表单验证
    },
    updateMenuGroup() {  //修改业务模块
      this.$refs["menuItemUpdate"].validate(valid => {
        if (valid) {
          this.loading=true;
          let resBody = new menuGroupUpdate();
					resBody.data.menuArr = this.menuItemUpdate.menuGroupDeal.join(",");
          resBody.data.categoryName = this.menuItemUpdate.menuGroupTitle;
          resBody.data.themeColor = this.menuItemUpdate.defaultColor;
          resBody.data.layoutRow = this.menuItemUpdate.menuGroupRow;
          resBody.data.layoutCol = this.menuItemUpdate.menuGroupCol;
          resBody.data.group_Id = this.option.currentRow.gid;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading=false;
                this.$message({
                  type: "success",
                  message: "业务模块修改成功!"
                });
                this.isShow = false;
                this.$emit("refreshTable");
                this.$emit("modelRefreshTable");                
              }else{
                this.loading=false;
              }
            })
            .catch(error => {
              this.loading=false;
              console.log(error);
            });
        } else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      });
    }
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(val) {
        this.option.isShow = val;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dealRow {
  .el-form-item.el-form-item--mini{
    width:100%;
    .el-form-item__content{
        width:78% !important;
      }
  }
}

</style>
