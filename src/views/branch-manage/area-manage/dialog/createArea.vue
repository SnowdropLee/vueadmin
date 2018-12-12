<template>
  <div >
    <el-dialog :visible.sync="createArea.isShow" width="700px"  title='新增分组' 
    :close-on-click-modal="false"
    @open="openArea"
    @close="closeArea"
    >

    <el-card style='overflow:visible'>
      <el-form size="mini" ref="areaAdd" :model="areaAdd" inline :rules="rules" label-width="100px" label-position="left">
          <el-row :gutter="10">
            <el-col :span="12">
            <el-form-item label="分组名称：" prop="areaName">
                <el-input placeholder="请输入分组名称" v-model="areaAdd.areaName"></el-input>
            </el-form-item>
            </el-col>
            <el-col  :span="12">
                <el-form-item prop="branchId" label="机构:">
                <select-tree  v-model="areaAdd.branchId" style="width:170px;"
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
        <el-button size="mini" @click="createArea.isShow=false">取消</el-button>                        
        <el-button type="primary" size="mini" @click="addArea">确认</el-button>
    </el-row>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import selectTree from "@/components/selectTree2/";
import areaInfoQuery from "@/message/branchManage/areaManage/areaAdd";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  props: { createArea: Object },
  components: { selectTree },
  data() {
    return {
      // branchInfo: [],
      brno: [],
      areaAdd: {
        areaName: "",
        branchId: []
      },
      rules: {
        areaName: [
          { required: true, message: "分组名称必填！", trigger: "blur" }
        ],
        branchId: [{ required: true, message: "机构必填！", trigger: "change" }]
      }
    };
  },
  created() {},
  methods: {
    closeArea() {  //关闭弹窗清除校验和数据
      if (this.$refs.areaAdd) {
        this.$refs.areaAdd.resetFields();
        this.$refs.areaAdd.clearValidate();
      }
    },
    openArea() {  //打开弹窗初始化下拉框
      this.closeArea();
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
    addArea() {  //添加分组
      this.$refs["areaAdd"].validate(valid => {
        if (valid) {
          let resBody = new areaInfoQuery();
          resBody.data.branchAreaName = this.areaAdd.areaName;
          resBody.data.branchIdList = this.areaAdd.branchId;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.$message({
                  type: "success",
                  message: "分组创建成功!"
                });
                this.createArea.isShow = false;
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
