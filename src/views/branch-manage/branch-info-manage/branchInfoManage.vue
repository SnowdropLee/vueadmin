<template>
  <div class='branch-manage'>
    <el-card v-loading="loading"
      element-loading-text="加载中。。。">
      <el-row style="margin-bottom:20px;">
        <el-col>
          <el-button type="primary" size="mini" icon='el-icon-plus' @click="addBranch" v-if="btnPermission('Button_BranchInfo_Add')">新增</el-button>          
          <el-button type="primary" size="mini" @click="dialogOptionsImport.isShow=true" v-if="btnPermission('Button_BranchInfo_Import')">导入</el-button>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="6" >
          <el-card style='height:800px;overflow:auto' shadow="never">
            <el-input v-model="filterText"
              suffix-icon="el-icon-search"
              placeholder="请输入机构号或机构名称" size='mini' style="width:80%" >
            </el-input>
            <el-tree style="margin-top:10px"
              ref="branchTree"
              class="filter-tree"
              node-key="branchid"
              :data="branchInfo"
              :props='{children: "child", label: "branchname", branchid: "branchid" }'
              :default-expand-all=true
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
              :expand-on-click-node=false
              :highlight-current=true
            >
            </el-tree>
          </el-card >
        </el-col>
        <el-col :span="18">
          <el-card style = "margin-left:10px;height:800px"  >   
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px;height:14.4px">
              <el-breadcrumb-item v-for="branchBread in pathlist" :key="branchBread.branch.branchid" @click.native="changeselect(branchBread.branch)">{{branchBread.branch.branchname}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <el-row>
                  <el-col :span="18">
                    <span>机构基本信息</span>
                  </el-col>
                  <el-col :span="6" style="text-align:right">
                    <a><i class="el-icon-edit" ref="BrandId" @click="editBranch" v-if="btnPermission('Button_BranchInfo_Edit')"></i></a>
                    <a><i class="el-icon-delete" ref="BrandId" @click="deleteBranch" v-if="btnPermission('Button_BranchInfo_Delete')"></i></a>                
                  </el-col>              
                </el-row>
              </div>
              <el-form ref="branchform" :model="branch" size="mini" :rules="rules" label-width="100px" label-position="left">
                <el-row :gutter="60">
                  <el-col :span='12' >  
                  <el-form-item label="机构号:" prop="branchno">
                    <el-input v-model="branch.branchno" :class="{'branchInfEeditClass':isClass}" :disabled="isClass"  ref='input1' placeholder="请输入机构号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12' >  
                  <el-form-item label="机构名称:" prop="branchname">
                    <el-input v-model="branch.branchname" :class="{'branchInfEeditClass':isClass}" :disabled="isClass" placeholder="请输入机构名称"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="60">
                  <el-col :span='12'>  
                  <el-form-item label="机构电话:" prop="branchphone">
                    <el-input v-model="branch.branchphone"  :class="{'branchInfEeditClass':isClass}" :disabled="isClass" placeholder="请输入机构电话"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12'>  
                  <el-form-item label="机构地址:" prop="branchaddress">
                    <el-input v-model="branch.branchaddress"  :class="{'branchInfEeditClass':isClass}" :disabled="isClass" placeholder="请输入机构地址"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row v-if="!editflag">
                  <el-col :span='6' :offset="5">  
                  <el-button type='danger' icon='el-icon-close' class='b-button' size="mini"
                              @click='deleteBranch'>删除机构</el-button>
                  </el-col>
                  <el-col :span='6' >  
                  <el-button type='primary' icon='el-icon-edit-outline' class='b-button' size="mini"
                              @click='editBranch'>编辑</el-button>
                  </el-col>
                </el-row> -->
                <el-row v-if="!isClass" style="margin-top:10px">
                    <el-col :span='6' :offset="8">  
                    <el-button  class='b-button' size="mini"
                                @click='editCancel'>取消</el-button>
                    </el-col>
                    <el-col :span='6' >  
                    <el-button type='primary'  class='b-button' size="mini"
                                @click='editCommit'>确定</el-button>
                    </el-col>
                </el-row>
              </el-form>
            </el-card >
          <!-- <el-card style = "margin-top :1% " shadow="never">
                <div slot="header" class="clearfix">
                        <span>机构设备信息</span>
                </div>
                  <el-row>
                  <el-col :span='10'>  
                      <span style="font-size:14px;">设备数量： {{devicecount}}台&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <el-button type='primary' icon='el-icon-edit-outline' class='b-button' size="mini" style="margin-bottom:10px;"
                          >查看明细</el-button>
                  </el-col>
                    <el-col :span='10' :offset="1">  
                      <span style="font-size:14px;">当日交易总量： {{tradecount}}笔&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <el-button type='primary' icon='el-icon-edit-outline' class='b-button' size="mini" style="margin-bottom:10px;"
                            >查看明细</el-button>
                  </el-col>
                  
              </el-row>
          </el-card > -->
            <el-card style = "margin-top:10px;height:510px;" >
              <div slot="header" class="clearfix">
                <span>子机构管理</span><span class="tip">（双击进入子机构页面）</span>
              </div>
              <el-row style="height:410px;overflow:auto">
                <el-col :span='4' v-for="childBranch in branch.chlidbranch" :key="childBranch.id" >
                  <el-card style = "margin-top :10px;margin-bottom:20px;height:100px;width:100px;overflow:hidden;text-align:center;text-align:center;
                    vertical-align: middle;" 
                    @dblclick.native="changeselect(childBranch)">
                    {{childBranch.branchno}}—{{childBranch.branchname}}
                  </el-card>
                </el-col>
                <el-col :span='4' >
                  <el-card shadow="hover" style = "margin-top :10px;margin-bottom:20px;height:100px;width:100px;text-align:center;line-height:50px;
                     vertical-align: middle;"  @dblclick.native="addBranchD"><i class="el-icon-plus"  ></i>
                  </el-card>
                </el-col>
              </el-row>
            </el-card >
          </el-card >
        </el-col>
      </el-row>
    </el-card>
    <keep-alive>
      <component :is='dialogList.createBrach' :createArea='dialogOptions' @refreshTable="refreshTable"></component>
    </keep-alive>
    <keep-alive>
      <component :is='dialogList.importBrach' :importBranch='dialogOptionsImport' @refreshTable="refreshTable"></component>
    </keep-alive>
  </div>
</template>

<script>
import request from "@/utils/request";
import BranchInfoQuery from "@/message/branchManage/branch/branch-info-query";
import modBranch from "@/message/branchManage/branch/branch-info-update";
import sureDel from "@/message/branchManage/branch/branch-info-del";
import createBrach from "./dialog/createBranch";
import importBrach from "./dialog/importBranch";

export default {
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
      dialogList: { createBrach, importBrach },
      dialogOptions: { isShow: false, flag: 0, selection: {} },
      dialogOptionsImport: { isShow: false },
      loading: false,
      rules: {
        //表单校验
        branchno: [
          { required: true, message: "机构号必填！", trigger: "blur" }
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
        ]
      },
      branchId: "",
      isClass: true,
      pathlist: [], //选择的机构路径
      // chlidbranchlist: [],
      // editflag: false,
      // devicecount: 10,
      // tradecount: 18,
      // path: "总行-1000",
      branch: {
        branchno: "",
        branchname: "",
        branchphone: "",
        branchaddress: "",
        childbranch: []
      },
      // changeable: false,
      branchInfo: [],
      filterText: "", //输入查询机构的条件
      selection: undefined //当前选中的机构
    };
  },
  created: function() {
    this.queryBranch();
  },
  watch: {
    filterText(val) {
      //过滤筛选满足条件的机构
      this.$refs.branchTree.filter(val);
    }
  },
  methods: {
    addBranch() {
      //通过新增按钮打开新增弹窗
      this.dialogOptions.isShow = true;
      this.dialogOptions.flag = 0;
    },
    refreshTable() {
      //添加修改删除机构号后刷新并清除之前选中的数据内容
      this.queryBranch();
      this.clearData();
    },
    clearData() {
      //清除数据
      (this.branch = {
        branchno: "",
        branchname: "",
        branchphone: "",
        branchaddress: "",
        childbranch: []
      }),
        (this.pathlist = []);
    },
    addBranchD() {
      //通过子机构模块打开新增机构对话框
      this.dialogOptions.isShow = true;
      this.dialogOptions.selection = this.selection; //将当前机构的数据保存，在此方式下添加的机构是当前机构为新建机构的父机构
      this.dialogOptions.flag = 1;
    },
    queryBranch() {
      //查询机构列表
      this.loading = true;
      let resBody = new BranchInfoQuery();
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.branchInfo = response.RSP_BODY.branchInfo;
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          // error handler
          console.error("查询错误", error);
          this.loading = false;
        });
    },
    editCancel() {
      //取消修改清除表单验证
      this.isClass = true;
      // this.$refs.branchform.resetFields() //清楚表单数据
      this.$refs.branchform.clearValidate(); //清楚表单验证
    },
    filterNode(value, data) {
      //搜索机构树
      if (!value) return true;
      return (
        data.branchno.indexOf(value) !== -1 ||
        data.branchname.indexOf(value) !== -1
      );
    },
    changeselect(data) {
      //面包屑目录切换，同事更新子机构管理内容
      this.selection = data;
      this.branchId = data.branchid;
      this.branch.branchno = data.branchno;
      this.branch.branchname = data.branchname;
      this.branch.branchphone = data.branchphone;
      this.branch.branchaddress = data.branchaddress;
      this.$options.methods.findchild(this.branchInfo, data.branchid, this);
      this.pathlist = [];
      this.$options.methods.getpath(this.branchInfo, data.branchid, this);
      this.pathlist.reverse();
    },
    dialogShow() {},
    // clearList(item) {
    //   for (var i = 0; i < this.devBrandList.length; i++) {
    //     if (this.devBrandList[i].id === item) {
    //       var list = this.devBrandList[i];
    //       var num = this.devBrandList.indexOf(list);
    //       this.devBrandList.splice(i, 1);
    //       break;
    //     }
    //   }
    // },
    handleNodeClick(data) {  //获取当前机构的数据
      this.selection = data;
      this.branchId = data.branchid;
      this.branch.branchno = data.branchno;
      this.branch.branchname = data.branchname;
      this.branch.branchphone = data.branchphone;
      this.branch.branchaddress = data.branchaddress;
      this.$options.methods.findchild(this.branchInfo, data.branchid, this);
      this.pathlist = [];
      this.$options.methods.getpath(this.branchInfo, data.branchid, this);
      this.pathlist.reverse();
    },
    editBranch() {  //判断当前是否有选中的机构
      if (this.selection) {
        this.isClass = false;
      } else {
        this.$message({
          type: "warning",
          message: "请选择机构！"
        });
      }
    },
    editCommit() {  //修改机构
      this.$refs["branchform"].validate(valid => {
        if (valid) {
          this.loading = true;
          let resBody = new modBranch();
          (resBody.data.branchId = this.branchId),
            (resBody.data.branchName = this.branch.branchname),
            (resBody.data.branchNo = this.branch.branchno),
            (resBody.data.branchPhone = this.branch.branchphone),
            (resBody.data.branchAddress = this.branch.branchaddress),
            request(resBody)
              .then(response => {
                if (response.SYS_HEAD.ReturnCode === "000000") {
                  this.$message({
                    type: "success",
                    message: "机构修改成功!"
                  });
                  this.isClass = true;
                  this.loading = false;
                  this.queryBranch();
                  this.clearData();
                } else {
                  this.loading = false;
                }
              })
              .catch(error => {
                this.loading = false;
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
    },
    sureDel() {
      //删除机构
      let resBody = new sureDel();
      this.loading = true;
      resBody.data.branchId = this.branchId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: "机构删除成功!"
            });
            this.queryBranch();
            this.clearData();
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
    },
    deleteBranch() {
      //删除弹窗
      if (this.selection) {
        this.$confirm("此操作将永久删除该机构, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.sureDel();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择机构！"
        });
      }
    },
    findchild(jsontree, id, root) {
      //查找当前机构的子机构
      if (
        typeof jsontree == "object" &&
        jsontree.constructor == Object.prototype.constructor
      ) {
        var arrey = [];
        arrey.push(jsontree);
      } else arrey = jsontree;
      for (var i = 0; i < arrey.length; i++) {
        var jn = arrey[i];
        if (jn.branchid == id) {
          root.branch.chlidbranch = jn.child;
          return;
        }
        if (jn.child && jn.child.length > 0) {
          root.$options.methods.findchild(jn.child, id, root);
        }
      }
    },

    getpath(jsontree, branchid, root) {
      //得到当前路劲
      if (
        typeof jsontree == "object" &&
        jsontree.constructor == Object.prototype.constructor
      ) {
        var arrey = [];
        arrey.push(jsontree);
      } else arrey = jsontree;
      for (var i = 0; i < arrey.length; i++) {
        var jn = arrey[i];
        if (jn.branchid == branchid) {
          root.pathlist.push({ branch: jn });
          if (jn.branchid == root.branchInfo[0].branchid) {
            return;
          } else {
            root.$options.methods.getpath(
              root.branchInfo,
              jn.fatherbranchid,
              root
            );
          }
        }
        if (jn.child && jn.child.length > 0) {
          root.$options.methods.getpath(jn.child, branchid, root);
        }
      }
    }
  }
};
</script>


<style  lang="scss" >
.branchInfEeditClass {
  //加上scope会影响样式设置
  input.el-input__inner {
    border: none;
    background: rgba(0, 0, 0, 0) !important;
  }
}
.tip {
  color: #999;
  font-size: 14px;
  margin-left: 10px;
}
</style>
