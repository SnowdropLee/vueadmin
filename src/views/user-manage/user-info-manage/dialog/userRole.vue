<template>
  <div  v-loading="loading">
    <!-- IDE -->
    <el-card :visible.sync="isShow" >
      <div slot="header" class="clearfix">
        <span>IDE角色</span>
      </div>
      <el-row>
        <div  class="userRoleContent">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-table :data="roleListC" ref="roleListC" border class="tableMarginTop" height="288"
                highlight-current-row
                @selection-change="handleCurrentChangeC"
                header-row-class-name="tableHeaderClass">
                  <el-table-column type="selection" width="40px"></el-table-column>
                  <el-table-column prop="roleName" 
                                  label="用户角色">
                  </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
                <div class="role">
                  <div class="roleHeader">
                      角色权限列表
                  </div>
                  <div class="roleContent">
                    <el-scrollbar style="height:100%">
                      <ul>
                        <li v-for="item in permissionIdListC" :key="item.id">{{item}}</li>
                      </ul>
                    </el-scrollbar>
                  </div>
                </div> 
            </el-col>
          </el-row>
        </div>             
      </el-row>
    </el-card>
    <!-- 系统 -->
     <el-card :visible.sync="isShow" style="margin-top:10px" >
       <div slot="header" class="clearfix">
          <span>系统角色</span>
        </div>
         <div  class="userRoleContent">
           <el-row :gutter="20">
            <el-col :span="12">
                <el-table :data="roleListV" ref="roleListV" border class="tableMarginTop" height="288"
                    highlight-current-row
                     @selection-change="handleCurrentChangeV"
                      header-row-class-name="tableHeaderClass">
                      <el-table-column type="selection" width="40px"></el-table-column>
                      <el-table-column prop="roleName" 
                                      label="用户角色">
                      </el-table-column>
                  </el-table>
                <!-- <el-transfer
                filterable
                v-model="roleItems"
                :props="{
                key: 'roleId',
                label: 'roleName'
                }"
                :data="roleListV"
                :titles="['角色列表','用户角色']">
                    </el-transfer> -->
            </el-col>
            <el-col :span="12">
                <div class="role">
                  <div class="roleHeader">
                      角色权限列表
                  </div>
                  <div class="roleContent">
                    <el-scrollbar style="height:100%">
                      <ul>
                        <li v-for="item in permissionIdListV" :key="item.id">{{item}}</li>
                      </ul>
                    </el-scrollbar>
                  </div>
                </div>
            </el-col>
           </el-row>
        </div>  
    </el-card>
    <el-row style="margin:20px; text-align:center">
        <el-button  size="mini" @click="cancleRole">取消</el-button>
        <el-button type="primary" size="mini" @click="sureRole">确定</el-button>      
    </el-row>
  </div>
</template>
<script>
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import userRoleAssocial from "@/message/userManage/user/user-role-associal";

export default {
  props: { option: Object },
  data() {
    return {
      loading:false,
      permissionIdListC: [],//C端角色权限列表
      permissionIdListV: [],//v端角色权限列表
      roleListV: [],//V端角色
      roleListC: [],//C端角色
      roleItemsC: [],//V端角色ID列表
      roleItemsV: [],//C端角色ID列表
      roleItems: [],//角色ID列表,
      // aumsSystem:'002'
    };
  },
  methods: {
    roleChange() {//角色权限列表数据
      this.permissionIdListC = [] //Object.assign([]);  解决不兼容IE9，导致角色权限列表回显失败
      this.permissionIdListV = [] //Object.assign([]);
      this.roleListC.forEach(element => {//c角色权限列表
        if (this.roleItems) {
          if (this.roleItems.indexOf(element.roleId) > -1) {
            this.$refs.roleListC.toggleRowSelection(element)
            element.permissionIdList.forEach(element1 => {
              this.permissionIdListC.push(element1);
            });
          }
        }
      });
      this.roleListV.forEach(element => {//v角色权限列表
        if (this.roleItems) {
          if (this.roleItems.indexOf(element.roleId) > -1) {
            this.$refs.roleListV.toggleRowSelection(element)            
            element.permissionIdList.forEach(element1 => {
              this.permissionIdListV.push(element1);
            });
          }
        }
      });
    },
    cancleRole() {////点取消按钮后并把结果返回给创建用户的主窗口，以此来控制弹窗的关闭
      this.option.isShow = false;
      this.$emit("systemClose");
    },
    handleCurrentChangeV(selection,val){//V端角色表格选中后，将有权限的数据显示再角色权限中
      this.permissionIdListV=[]
      this.roleItemsV=[]
      selection.forEach(element => {
        this.roleItemsV.push(element.roleId)
        if(element.hasOwnProperty("permissionIdList")){
          this.permissionIdListV=this.permissionIdListV.concat(element.permissionIdList)
        }
      });
    } ,   
    handleCurrentChangeC(selection,val){//C端角色表格选中后，将有权限的数据显示再角色权限中
      this.permissionIdListC=[]
      this.roleItemsC=[]      
      selection.forEach(element => {
        this.roleItemsC.push(element.roleId)        
        if(element.hasOwnProperty("permissionIdList")){
          this.permissionIdListC=this.permissionIdListC.concat(element.permissionIdList)
        }
      });
    } , 
    sureRole() {//设定角色权限
      this.loading=true;
      this.roleItems=this.roleItemsC.concat(this.roleItemsV)
      let resBody = new userRoleAssocial();
      (resBody.data.userId = this.option.userId),
      (resBody.data.roleIdList = this.roleItems),
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              this.loading=false;
              this.isShow = false;
              this.$emit("systemClose");
              this.$message({
                type: "success",
                message: "用户关联角色成功!"
              });
            }else{
              this.loading=false;
            }
          })
          .catch(error => {
            this.loading=false;
            this.$message({
              type: "info",
              message: error
            });
          });
    }
  },
  watch: {
    option: {//监听返回数据，设置角色权限回显
      handler: function (val, oldVal) {
       this.option.hasOwnProperty("roleIdList")
      ? (this.roleItems = this.option.roleIdList)
      : "";
      this.roleChange();
        },
        deep: true
    }
  },
  created() {
    // console.log(this.option)
    this.option.hasOwnProperty("roleIdList")
      ? (this.roleItems = this.option.roleIdList)
      : "";
    //角色列表初始化
    this.loading=true;
    let resBody = new devRunList();
    resBody.data.spinnerList = [{ spinnerName: "role" }];
    request(resBody)
      .then(response => {
        this.loading=false
        let roleList = response.RSP_BODY.roleListSpinner;
        for (let i = 0; i < roleList.length; i++) {
          if (roleList[i].aumsSystem === "004") {
            this.roleListC.push(roleList[i]);
          } else if (roleList[i].aumsSystem === "002") {
            this.roleListV.push(roleList[i]);
          }
        }
        this.roleChange();
      })
      .catch(error => {
        console.error("查询错误", error);
      });
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(value) {
        this.option.isShow = value;
      }
    }
    // roleItems: {
    //   get() {
    //     if(this.option.hasOwnProperty("roleIdList")){
    //       return this.option.roleIdList;
    //     }
    //     else{
    //       return [];
    //     }
    //   },
    //   set(value) {
    //     this.option.roleIdList = value;
    //   }
    // }
  }
};
</script>

<style scoped lang="scss"  scoped>
.userRoleContent {
  width: 100%;
  height: 300px;
  .userRoleBox {
    width: 592px;
    float: left;
  }
  .role {
    margin-top:20px;
    display: inline-block;
    height: 288px;
    width: 100%;
    border: 1px solid #ebeef5;
    .roleHeader {
      height: 50px;
      line-height: 40px;
      background: #f7f7f7;
      padding-left: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ebeef5;
    }
    .roleContent {
      height: 236px;
      overflow: auto;
    }
    .roleContent::-webkit-scrollbar {
      display: none;
    }
  }
}
.header {
  padding: 10px;
  font-size: 20px;
}
.el-transfer-panel__body {
  height: 200px;
}

.el-dialog__body {
  padding-top: 10px;
}
li {
  list-style: none;
}
</style>
