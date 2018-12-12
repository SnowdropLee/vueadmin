<template>
  <div >
    <el-dialog :visible.sync="updateArea.isShow" width="700px"  title='修改分组' 
    :close-on-click-modal="false"
    @open="areaOpen"
    @close="closeArea"
    >
    <el-card style='overflow:visible'>
      <el-form size="mini" ref="areaUpdateForm" :model="areaUpdateForm" inline :rules="rules" label-width="100px" label-position="left">
        <el-row :gutter="10">
          <el-col :span="12">
          <el-form-item label="分组名称：" prop="areaName">
            <el-input placeholder="请输入分组名称" v-model="areaUpdateForm.areaName"></el-input>
          </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item prop="branchId" label="机构:" >
              <select-tree  v-model="areaUpdateForm.branchId" style="width:170px;"
              :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno" :node-key="'branchId'" ></select-tree>
            </el-form-item> 
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="5">
            分组下机构：
          </el-col>
          <el-col>
            <el-tree
                  ref="branchTree"
                  class="filter-tree"
                  node-key="branchid"
                  :data="branchInfo"
                  :default-expand-all=true
                  :expand-on-click-node=false
                  :highlight-current=true
                    >
              </el-tree>
          </el-col>
        </el-row> -->
      </el-form>
    </el-card >
    <el-row style="margin:20px 0;text-align:right">
      <el-button size="mini" @click="updateArea.isShow=false">取消</el-button>                        
      <el-button type="primary" size="mini" @click="updateAreaSure">确认</el-button>
    </el-row>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import selectTree from "@/components/selectTree2/";
import branchAreaUpdate from "@/message/branchManage/areaManage/areaUpdate";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  props: { updateArea: Object },
  components: { selectTree },
  data() {
    return {
      brno: [],
      // branchInfo: [],
      areaUpdateForm: {
        areaName: "",
        branchId: []
      },
      rules: {
        areaName: [
          { required: true, message: "分组名称必填！", trigger: "blur" }
        ],
        branchId: [{ required: true, message: "机构必填！", trigger: blur }]
      }
    };
  },
  created() {},
  methods: {
    closeArea() {
      this.$refs.areaUpdateForm.resetFields();
      this.$refs.areaUpdateForm.clearValidate();
    },
    areaOpen() {
      this.areaUpdateForm.areaName = this.updateArea.currnetRow.branchAreaName;
      this.areaUpdateForm.branchId = Object.assign([]);
      this.updateArea.currnetRow.branchObjectList.forEach(element => {
      this.areaUpdateForm.branchId.push(element.branchId);
      });
      this.initList();
    },
    initList() {
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brno = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("错误信息", error);
        });
    },
    updateAreaSure() {
      this.$refs["areaUpdateForm"].validate(valid => {
        if (valid) {
          let resBody = new branchAreaUpdate();
          resBody.data.branchAreaName = this.areaUpdateForm.areaName;
          resBody.data.branchIdList = this.areaUpdateForm.branchId;
          resBody.data.branchAreaId = this.updateArea.currnetRow.branchAreaId;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.$message({
                  type: "success",
                  message: "分组修改成功!"
                });
                this.updateArea.isShow = false;
                this.$emit("refreshTable");
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    }
  }
};
</script>
