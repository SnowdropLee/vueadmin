<template>
   <div>
    <el-dialog title='新增业务模块' :visible.sync='isShow'  width="700px"
            :close-on-click-modal=false  @close="closeMenuGroup" @open="openGroupAdd">
      <div v-loading="loading">
          <el-card>
              <el-form ref='menuGroupAdd' :model='menuGroupAdd' :rules="rules" size="mini"  label-width="110px" label-position="left">
              <el-row :gutter="10">
                  <el-col :span='12'>
                    <el-form-item label="业务模块标题:" prop='menuGroupTitle'>
                          <el-input v-model="menuGroupAdd.menuGroupTitle" placeholder="请输入菜单项标题"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12'>
                    <el-form-item label="背景颜色:" prop='defaultColor'>
                            <el-color-picker size="small"
                            v-model="menuGroupAdd.defaultColor"
                            :predefine="predefineColors">
                            </el-color-picker>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="10">
                  <el-col :span='12'>
                    <el-form-item label="业务模块行数:" prop='menuGroupRow'>
                          <el-input v-model="menuGroupAdd.menuGroupRow" placeholder="请输入菜单组行数"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12'>
                    <el-form-item label="业务模块列数:" prop='menuGroupCol'>
                          <el-input v-model="menuGroupAdd.menuGroupCol"  placeholder="请输入菜单组列数"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>

              <el-row :gutter="10">
                  <el-col>
                    <el-form-item label="交易:" prop='menuGroupDeal'>
                      <el-select v-model="menuGroupAdd.menuGroupDeal" name="menuGroupDeal" multiple placeholder="请选择交易">
                        <el-option 
                          v-for="item in menuGroupDeal"
                          :key="item.value"
                          :label="item.TRADENAME"
                          :value="item.MENU_ID">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
              </el-row>               
           </el-form>
          </el-card>
          <el-row style="margin:20px 0;text-align:right">
            <el-button size='mini' @click="isShow=false">返回</el-button>
            <el-button type='primary' size='mini' @click="addMenuGroup">确定</el-button>
          </el-row>
      </div>
    </el-dialog>
   </div>
</template>

<script>
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import menuGroupAdd from "@/message/resourceManage/menu/menuGroup/menu-group-add";
import tradeList from "@/message/resourceManage/menu/tradeList";
import getGlobalParams from "@/utils/getGlobalParams";

export default {
  props: { option: Object },
  data() {
    //自定义验证方法
    let validatorNumRow = (rule, value, callback) => {
      if (value != "") {
        let reg = /^[0-9]+$/;
        if (reg.test(value) && value < 4) {
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
          callback(new Error("请输入数字"));
        }
      } else {
        callback();
      }
    };
    return {
      loading: false,
      menuGroupAdd: {
        //表单数据
        menuGroupTitle: "",
        menuGroupRow: "",
        menuGroupCol: "",
        defaultColor: "#409EFF",
        menuGroupDeal: []
      },
      predefineColors: [], //背景颜色的 备选颜色 通过再globalParams.json 得 ”predefineColors“进行配置
      menuGroupDeal: [], //交易下拉框数据
      rules: {
        //表单校验
        defaultColor: [
          { required: true, message: "请选择背景颜色", trigger: "change" }
        ],
        menuGroupTitle: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        menuGroupRow: [
          { required: true, message: "请输入行", trigger: "blur" },
          { required: false, validator: validatorNumRow, trigger: "blur" }
        ],
        menuGroupCol: [
          { required: true, message: "请输入列", trigger: "blur" },
          { required: false, validator: validatorNum, trigger: "blur" }
        ],
        menuGroupDeal: [
          { required: true, message: "请选择交易", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.predefineColors = getGlobalParams.get("predefineColors"); //获取背景颜色配置项
  },
  methods: {
    openGroupAdd() {  //刷新下拉框
      let resBody = new tradeList();
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.menuGroupDeal = response.RSP_BODY.resultSet;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeMenuGroup() {
      this.$refs.menuGroupAdd.resetFields(); //清楚表单验证
      this.$refs.menuGroupAdd.clearValidate(); //清楚表单验证
    },
    addMenuGroup() {  //添加业务模块
      this.$refs["menuGroupAdd"].validate(valid => {
        if (valid) {
          this.loading = true;
          let resBody = new menuGroupAdd();
          resBody.data.menuArr = this.menuGroupAdd.menuGroupDeal.join(",");
          resBody.data.categoryName = this.menuGroupAdd.menuGroupTitle;
          resBody.data.themeColor = this.menuGroupAdd.defaultColor;
          resBody.data.layoutRow = this.menuGroupAdd.menuGroupRow;
          resBody.data.layoutCol = this.menuGroupAdd.menuGroupCol;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "业务模块创建成功!"
                });
                this.isShow = false;
                this.$emit("refreshTable");
                this.$emit("modelRefreshTable");
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

<style lang="scss">
</style>
