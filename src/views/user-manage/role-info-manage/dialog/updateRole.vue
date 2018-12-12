<template>
  <div>
    <el-dialog :visible.sync="isShow" title="修改角色"  width="650px"  :close-on-click-modal="false"
      @open="openRole" 
      @close="closeRole">
      <div v-loading="loading">
        <el-card style="overflow:visible">
          <el-form ref="roleListUpdate" :model="currentRowList"  :rules="rulesRole"
            size="mini"  label-width="120px" label-position="left">
              <el-row class="rowStyle">
                  <el-col :span="24">
                  <el-form-item label="角色名称:" prop="roleName">
                  <el-input v-model="currentRowList.roleName" placeholder="请输入角色名称"></el-input>
                  </el-form-item>
                  </el-col>
              </el-row>
              <el-row class="rowStyle" :gutter="40">
                <el-col :span="12">
                  <el-form-item label="适用机构:" prop="branchId">
                    <select-tree :single-check="true"  v-model="currentRowList.branchId"
                      :props='{id:"branchId",label: "branchName",children: "childBranch"}' 
                      :tree-data="brnoList" :node-key="'branchId'" >
                    </select-tree>                         
                  </el-form-item> 
                </el-col> 
                <el-col :span="12"  prop="childuseable">
                      <el-form-item prop="childuseable" label="可否管理子机构:">
                          <el-switch v-model="currentRowList.childuseable"></el-switch>
                      </el-form-item>
                </el-col> 
              </el-row>
              <el-row class="rowStyle">
                  <el-col>
                  <el-form-item label="角色状态:" prop="roleState">
                      <!-- <el-cascader v-model='option.currentRowList.roleState'
                      placeholder="请选择角色状态" :options='roleState' filterable></el-cascader> -->
                        <el-radio-group v-model="currentRowList.roleState">
                          <el-radio label="0">失效</el-radio>
                          <el-radio label="1">正常</el-radio>
                          <el-radio label="2">锁定</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  </el-col>
              </el-row>
              <el-row class="rowStyle">
                  <el-form-item label="备注:" prop="remark">
                  <el-input type="textarea" :rows="1" v-model="currentRowList.remark"></el-input>
                  </el-form-item>
              </el-row>
          </el-form> 
        </el-card>
        <el-row style="margin:20px 0;text-align:right">
                <el-button  size="mini" @click="isShow=false">取消</el-button>
                <el-button type="primary" size="mini" @click="updateRole">确认</el-button>
        </el-row>   
      </div>
      </el-dialog>
  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import roleUpdate from "@/message/userManage/role/role-update";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  components: { selectTree },
  props: { option: Object },
  data() {
    return {
      loading: false,
      roleListUpdate: {},//表单数据
      currentRowList: {},//当前行数据
      roleState: [//状态
        { label: "失效", value: "0" },
        { label: "正常", value: "1" },
        { label: "锁定", value: "2" }
      ],
      brnoList: [],//机构
      rulesRole: {//表单验证
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { max: 50, message: "角色名称少于50个字符", trigger: "blur" }
        ],
        branchId: [
          { required: true, message: "请选择机构号", trigger: "change" }
        ]
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
    }
  },
  methods: {
    closeRole() {//关闭弹窗时，清除表单验证
      this.$refs.roleListUpdate.clearValidate();
    },
    openRole() {//打开弹窗，初始化下拉列表并设置回显数据
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brnoList = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("错误信息", error);
        });
      this.currentRowList = Object.assign({}, this.option.currentRowList);
      this.currentRowList.hasOwnProperty("branchId")
        ? (this.currentRowList.branchId = [this.currentRowList.branchId])
        : "";
    },
    updateRole() {//修改角色
      this.$refs["roleListUpdate"].validate(valid => {
        if (valid) {
          this.loading = true;
          let resBody = new roleUpdate();
          resBody.data.roleId = this.currentRowList.roleId;
          resBody.data.roleName = this.currentRowList.roleName;
          resBody.data.branchId = this.currentRowList.branchId[0];
          resBody.data.childBranchUseFlag = this.currentRowList.childuseable;
          resBody.data.roleState = this.currentRowList.roleState;
          resBody.data.remark = this.currentRowList.remark;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "角色修改成功!"
                });
                this.option.isShow = false;
                this.$emit("refreshTable");
              } else {
                this.loading = false;
              }
            })
            .catch(error => {
              this.loading = false;
              this.$message({
                type: "info",
                message: error
              });
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
  }
};
</script>

<style lang="scss"  scoped>
.rowStyle {
  margin-bottom: 10px;
}
</style>
