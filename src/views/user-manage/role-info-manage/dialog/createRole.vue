<template>
  <div>
    <el-dialog :visible.sync="isShow" title="新增角色"
      @close='closeRole'
      @open="openCreate" width="600px"
      :close-on-click-modal="false"
      center
    >
    <div v-loading="loading">
      <el-steps finish-status="success" :active='active' align-center>
        <el-step title='角色信息'></el-step>
        <el-step title='角色权限维护'></el-step>            
      </el-steps>
      <div  v-if="active==0">
        <el-card style="overflow:visible">
          <el-form ref="roleListAdd" :model="roleListAdd"  :rules="rulesRole"
            size="mini" label-width="120px" label-position="left">
              <el-row class="rowStyle" >
                <el-col :span="24">
                  <el-form-item label="角色名称:" prop="roleName">
                  <el-input v-model="roleListAdd.roleName" placeholder="请输入角色名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="rowStyle" >
              
                  <el-col :span="14">
                    <el-form-item label="适用机构:" prop="branchId">
                     <select-tree :single-check="true"  v-model="roleListAdd.branchId"
                      :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brnoList" :node-key="'branchId'" ></select-tree>
                     </el-form-item>
                  </el-col>
                                         
             
               <el-col :span="8" :offset="2">
                    <el-form-item prop="childBranchUseFlag" label="可否管理子机构:">
                                    <el-switch v-model="roleListAdd.childBranchUseFlag"></el-switch>
                                </el-form-item>
                      <!-- <el-checkbox v-model="roleListAdd.childBranchUseFlag">子机构是否可见</el-checkbox> -->
                  </el-col>    
              </el-row>
              <el-row class="rowStyle">
                <el-col :span="15">
                  <el-form-item label="所属渠道:" prop="aumsSystem">
                  <el-radio-group v-model="option.aumsSystem" disabled>
                      <el-radio  label="001">自助C端</el-radio>
                      <el-radio   label="002">自助V端</el-radio>
                  </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="rowStyle">
                  <el-form-item label="备注:" prop="remark">
                  <el-input type="textarea" :rows="1" v-model="roleListAdd.remark"></el-input>
                  </el-form-item>
              </el-row>
          </el-form> 
        </el-card>
        <el-row style="margin-top:20px;">
          <el-col :offset="10" :span="2">
            <el-button type="primary" size="mini" @click="addRole">完成并关联权限</el-button>
          </el-col>
        </el-row>   
      </div>
      <div   v-if="active==1">
        <el-card class="createRoleRelative">
          <el-tree
              :data="roleList"
              show-checkbox
              node-key="perssionId"
              ref="tree"
              highlight-current
              :props='{children: "perssionChild",label: "perssionName"}'>
          </el-tree>
          </el-card>
          <el-row style="margin-top:20px;">
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" @click="roleRelative">关联权限</el-button>                          
                </el-col>
          </el-row>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import roleCreate from "@/message/userManage/role/role-create";
import roleRelative from "@/message/userManage/role/role-relative";
export default {
  components: {selectTree },
  props: { option: Object },
  data() {
    return {
      loading:false,
      roleId: "",//创建成功后的角色ID，为了维护权限
      brnoList: [],//机构下拉框
      roleListAdd: {//表单数据
        roleName: "",
        branchId: [],
        childBranchUseFlag: false,
        aumsSystem: "",
        remark: ""
      },
      roleList: [],//权限列表
      roleListFirst:[],//权限列表，为筛选
      rulesRole: {//表单验证
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { max: 50, message: "角色名称少于50个字符", trigger: "blur" }
        ],
        branchId: [{ required: true, message: "请选择机构号", trigger: "change" }]
      }
    };
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(val) {
        this.option.isShow = val;
      }
    },
    active: {
      get() {
        return this.option.active;
      },
      set(val) {
        this.option.active = val;
      }
    }
  },
  methods: {
    closeRole() {//关闭弹窗清楚数据和表单验证
      if (this.$refs["roleListAdd"]!=undefined) {
        this.$refs["roleListAdd"].clearValidate()//清楚表单验证
        this.$refs["roleListAdd"].resetFields()//清楚表单验证
      }
    },
    openCreate() {//打开弹窗事件，初始化下拉列表
      this.closeRole() 
      let resBody = new devRunList();
      resBody.data.spinnerList = [
        { spinnerName: "permission" },
        { spinnerName: "branch" }
      ];
      request(resBody)
        .then(response => {
          this.roleListFirst=response.RSP_BODY.perssionTreeSpinner;
          this.roleList = Object.assign([],this.roleListFirst)
          // this.roleList.filter(function(val){
          //   console.log(val)
          //   console.log(this.option)
            
          //   // return val.roleSystem==this.option.aumsSystem
          // })
          this.brnoList = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },
    selRole(){//筛选不同角色权限的函数
      this.roleList=[];
      this.roleListFirst.forEach(element => {
        if (element.AUMSChannel==this.option.aumsSystem) {
          this.roleList.push(element)
        }
      });
    },
    addRole() {//添加角色
      this.$refs["roleListAdd"].validate(valid => {
        if (valid) {
          this.active = 1;
          this.loading=true;
          let resBody = new roleCreate();
          resBody.data.roleName = this.roleListAdd.roleName;
          resBody.data.branchId = this.roleListAdd.branchId[0];
          resBody.data.childBranchUseFlag = this.roleListAdd.childBranchUseFlag;
          resBody.data.aumsSystem = this.option.aumsSystem;
          resBody.data.remark = this.roleListAdd.remark;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading=false;                
                this.roleId = response.REQ_BODY.roleId;
                this.$message({
                  type: "success",
                  message: "角色创建成功!请为角色关联权限。"
                });
                //筛选不同角色的权限
                this.selRole()
                this.$emit("refreshTable");
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
      this.$refs["roleListAdd"].resetFields()
      this.$refs["roleListAdd"].clearValidate()      
    },
    roleRelative() {//为角色关联权限
      let resBody = new roleRelative();
      resBody.data.permissionIdList = this.$refs.tree.getCheckedKeys();
      resBody.data.roleId = this.roleId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.$message({
              type: "success",
              message: "角色关联成功!"
            });
            this.isShow = false;
            this.$emit("refreshTable");//刷新表格
          }
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: error
          });
        });
    }
  }
};
</script>
<style lang="scss">
.el-tree-node{
  text-align:left;
}
</style>

<style lang="scss"  scoped>

.rowStyle {
  margin-bottom: 10px;
}
.el-radio-group {
  padding: 0;
}
.createRoleRelative {
  height: 500px;
  overflow-y: auto;
}
.createRoleRelative::-webkit-scrollbar {
  //overflow 出现滚动条，将滚动条隐藏；
  display: none;
}
</style>
