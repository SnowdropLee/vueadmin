<template>
  <div >
    <el-dialog :visible.sync="createArea.isShow" width="700px"  title='新增机构' 
    :close-on-click-modal="false"
    @close="closeBranch"
    @open="openBranch"
    >
    <div v-loading="loading">
      <el-card style='overflow:visible'>
        <el-form ref="branchform" :model="branch" size="mini" :rules="rules" label-width="90px" label-position="left">
          <el-row :gutter="60">
            <el-col :span="12">  
            <el-form-item label="上级机构:" v-if="fatherIdDisabled" prop="branchId">
              <!-- <el-input v-model="branch.branchFatherName" :disabled="fatherDisabled"  placeholder="请输入机构名称"></el-input> -->
              <select-tree v-model="branch.branchId"  style="width:190px;"
              :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno" :node-key="'branchId'" :single-check="true"></select-tree>
              </el-form-item>
            </el-col>
            <el-col :span="12"  v-if="fatherDisabled">  
            <el-form-item label="上级机构:" prop="branchFatherId">
              <el-input v-model="branch.branchFatherId" :disabled="fatherDisabled" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' >  
            <el-form-item label="机构名称:" prop="branchname">
              <el-input v-model="branch.branchname"  placeholder="请输入机构名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="60">
            <el-col :span='12' >  
            <el-form-item label="机构号:" prop="branchno">
              <el-input v-model="branch.branchno" ref='input1' placeholder="请输入机构号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>  
            <el-form-item label="机构电话:" prop="branchphone">
              <el-input v-model="branch.branchphone"   placeholder="请输入机构电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="60">
            <el-col :span='24'>  
            <el-form-item label="机构地址:" prop="branchaddress">
              <el-input type="textarea" :rows="1" v-model="branch.branchaddress" placeholder="请输入机构地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          </el-form>
      </el-card >
      <el-row style="margin:20px 0;text-align:right">
        <el-button size="mini" @click="createArea.isShow=false">取消</el-button>                        
        <el-button type="primary" size="mini" @click="addArea">确认</el-button>
      </el-row>
    </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import selectTree from "@/components/selectTree2/";
import areaInfoQuery from "@/message/branchManage/areaManage/areaAdd";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import addBranch from "@/message/branchManage/branch/branch-info-add";

export default {
  props: { createArea: Object },
  components: { selectTree },
  data() {
    var validatorPhone = (rule, value, callback) => {
      let regtel = /(^[1][3,4,5,7,8][0-9]{9}$)|(^[0]\d{2}[-]\d{7,8}$)/;
      let regPhone = /^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/;
      if (regtel.test(value) || regPhone.test(value)) {
        callback();
      } else {
        callback(new Error("请输入11位正确的联系电话"));
      }
    };
    return {
      loading: false, 
      fatherDisabled: false,  //是狗显示机构文本框
      fatherIdDisabled: true, //是否显示机构下拉框
      // branchInfo: [],
      brno: [],
      branch: {
        branchId: [],
        branchno: "",
        branchname: "",
        branchphone: "",
        branchaddress: "",
        branchFatherId: "",
        branchFatherName: ""
      },
      rules: {
        branchno: [
          { required: true, message: "机构号必填！", trigger: "change" }
        ],
        branchname: [
          { required: true, message: "机构名称必填！", trigger: "blur" }
        ],
        branchphone: [
          { required: true, message: "机构电话必填！", trigger: "blur" },
          { validator: validatorPhone, trigger: "blur" }
        ],
        branchaddress: [
          { required: true, message: "机构地址必填！", trigger: "blur" }
        ],
        branchFatherId: [
          { required: true, message: "父机构ID必填！", trigger: "change" }
        ],
        branchId: [
          { required: true, message: "上级机构必填！", trigger: "change" }
        ]
      }
    };
  },
  created() {},
  methods: {
    initList() {  //初始化机构
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
    openBranch() {
      if (this.$refs.branchform) {
        this.$refs.branchform.resetFields(); //清楚表单数据
        this.$refs.branchform.clearValidate(); //清楚表单验证
      }
      this.initList();
      if (this.createArea.flag == 0) {
        this.branch.branchFatherId = "";
        this.branch.branchId[0]=""  //清除已选中的机构
        this.fatherDisabled = false;
      } else {
        if (this.createArea.selection) {
          this.branch.branchFatherId = this.createArea.selection.branchname;
          this.branch.branchFatherName = this.createArea.selection.branchname;
          this.branch.branchId[0] = this.createArea.selection.branchid;
          (this.fatherDisabled = true), (this.fatherIdDisabled = false);
        }
      }
    },
    closeBranch() {
      this.$refs.branchform.resetFields(); //清楚表单数据
      this.$refs.branchform.clearValidate(); //清楚表单验证
      this.fatherDisabled = false;
      this.fatherIdDisabled = true;
    },
    addArea() {  //添加机构
      this.$refs["branchform"].validate(valid => {
        if (valid) {
          this.loading = true;
          let resBody = new addBranch();
          (resBody.data.branchFatherId = this.branch.branchId[0]),
            (resBody.data.branchName = this.branch.branchname),
            (resBody.data.branchNo = this.branch.branchno),
            (resBody.data.branchPhone = this.branch.branchphone),
            (resBody.data.branchAddress = this.branch.branchaddress),
            request(resBody)
              .then(response => {
                if (response.SYS_HEAD.ReturnCode === "000000") {
                  this.loading = false;
                  this.$message({
                    type: "success",
                    message: "机构添加成功!"
                  });
                  this.createArea.isShow = false;
                  this.$emit("refreshTable");
                } else {
                  this.loading = false;
                }
              })
              .catch(error => {
                this.loading = false;
                console.log(error);
              });
        }
      });
    }
  }
};
</script>
