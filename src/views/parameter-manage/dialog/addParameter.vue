<template>
  <div>
    <el-dialog :title="isEdit" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="800px">
      <el-form :model="temp" ref="tempRules" :rules="tempRules"  size="mini" label-position="left" label-width="80px" >
        <el-card style="margin-bottom:10px;">
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="参数名称" prop="paramKey">
                <el-input v-model="temp.paramKey"
                @blur="paramkeyIsexist" :disabled="inputDisabled"
                placeholder="请输入参数名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="参数描述" prop="paramDesc">
                <el-input v-model="temp.paramDesc" placeholder="请输入参数描述"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card>
          <el-button size="mini" type="primary" plain @click="handleCreate">新增参数值</el-button>
          <div class="dragTable">
            <el-table
              :rules="tempRules"
              ref="tempRules" class="tableMarginTop"
              :data="paramValue" border
              :class="{ mouseDrag : moveClass }"
              :show-header=false>
              <el-table-column 
                prop="data"
                align="center">
              </el-table-column>
              <el-table-column 
                width="100"
                label="操作">
                <template slot-scope="scope">
                  <div @mouseover="getList">
                    <el-tooltip class="item" effect="dark" content="修改" placement="top">
                      <el-button icon="el-icon-edit" type="text" size="mini"
                    @click="handleUpdata(scope.row)"></el-button>
                    </el-tooltip>

                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <el-button icon="el-icon-delete" type="text" size="mini"
                    @click="dialogDelete(scope.row)"></el-button>
                    </el-tooltip>

                    <el-tooltip class="item" effect="dark" content="拖拽改变顺序" placement="top">
                      <el-button icon="el-icon-rank" type="text" size="mini"
                    class="mouseDrag"></el-button>
                    </el-tooltip>

                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isShow = false">取 消</el-button>
        <el-button size="mini" type="primary"
        v-if="isEdit === '新增参数'" @click="paramAdd('tempRules')">确 定</el-button>
        <el-button size="mini" type="primary"
        v-else @click="paramEdit">确 定</el-button>
      </div>

      <el-dialog
        width="500px" :lock-scroll=false
        :title="titleVal"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form :model="temp" :rules="tempRules" ref="tempRules">
          <el-form-item prop="data">
            <el-input size="mini"
            type="textarea"
            v-model="temp.data"
            placeholder="请输入您要设定的值"></el-input>
          </el-form-item>
          <el-form-item>
            <div slot-scope="footer" class="dialog-footer slotFooter">
              <el-button size="mini" @click="innerVisible = false">取 消</el-button>
              <el-button size="mini" type="primary" 
              v-if="dialogStatus == 'create'" @click="createData('tempRules')">确 定</el-button>
              <el-button size="mini" type="primary" 
              v-else @click="updateData('tempRules')">确 定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import getGuid from "@/utils/getGuid";
import Sortable from "sortablejs";

import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
import paramAdd from "@/message/parameterManage/param-add";
import paramEdit from "@/message/parameterManage/param-edit";
import paramkeyIsexist from "@/message/parameterManage/paramkey-isexist";
export default {
  props: {
    option: Object,
    rowData: Object
  },
  data() {
    //对参数名称进行逻辑判断（要求英文或数字）
    var checkparamKey = (rule, value, callback) => {
      var re = /^[0-9a-zA-Z]*$/g;
      if (!value) {
        callback(new Error("请输入参数名称"));
      } else {
        if (!re.test(value)) {
          callback(new Error("请输入数字值或英文"));
        } else {
          callback();
        }
      }
    };
    var checkparamDesc = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入参数描述"));
      } else {
        callback();
      }
    };
    return {
      paramExist:'',//参数是否存在标志
      cProgramSpinner: [],
      devFormSpinner: [],

      paramValue: [], // 表格中的数据
      paramData: null, // 需要传输到后台的参数字符串，用下划线拼接的字符串“_”
      dialogStatus: "",
      innerVisible: false,
      moveClass: false,
      inputDisabled: false,
      temp: {
        data: "",
        id: "",
        paramKey: "",
        paramDesc: ""
      },
      // dataRules: {},
      tempRules: {
        data: [
          { required: true, message: "请输入您要设定的值", trigger: "blur" }
        ],
        paramKey: [{ validator: checkparamKey, trigger: "blur" }],
        paramDesc: [{ validator: checkparamDesc, trigger: "blur" }]
      },
      titleVal: "",
      sortable: null,
      oldList: [],
      newList: []
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newVal) {
        this.option.isShow = newVal;
      }
    },
    isEdit: function() {
      if (this.option.isEdit) {
        return (this.option.isEdit = "编辑参数");
      } else {
        return (this.option.isEdit = "新增参数");
      }
    },
    tableDataRow: function() {
      return this.rowData;
    }
  },
  created() {},
  methods: {
    
    /**
     * @desc 打开dialog回调函数
     */
    openCollback() {
      this.initSpinnerList();
      if (this.option.isEdit === "编辑参数") {
        this.inputDisabled = true;
        this.temp.paramKey = this.tableDataRow.paramKey;
        this.temp.paramDesc = this.tableDataRow.paramDesc;
        let paramAll = this.tableDataRow.paramValue.split(";");
        this.paramValue = [];
        paramAll.map(item => {
          this.paramValue.push({ data: item, id: getGuid() });
        });
      } else {
        this.inputDisabled = false;
        this.temp.paramKey = "";
        this.temp.paramDesc = "";
        this.paramValue = [];
      }
    },
    //关闭弹窗时清空temp数据
    closeDialog() {
      this.temp = {}; //清空数据
      this.$nextTick(() => {
        this.$refs["tempRules"].clearValidate();
      });
    },

    /**
     * @desc 初始化下拉列表
     */
    initSpinnerList() {
      let resBody = new spinnerDataQuery();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "cProgram" }
      ];
      request(resBody)
        .then(response => {
          this.cProgramSpinner = response.RSP_BODY.cProgramSpinner;
          this.devFormSpinner = response.RSP_BODY.devFormSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    // 获取参数值的数据
    getParamData() {
      let paramArr = [];
      this.paramValue.map(function(item) {
        paramArr.push(item.data);
      });
      this.paramData = paramArr.join(";");
    },
    // 添加参数信息
    paramAdd(formName) {
      //判断参数值是否存在
      if(!this.paramExist){
              this.$refs[formName].validate(valid => {
        // 判断data是否为空
        if (this.temp.data === "") {
          console.log("data is null.");
          this.$message({
            message: "参数值不能为空",
            type: "warning"
          });
        } else {
          var re = /^[0-9a-zA-Z]*$/g;
          if (!re.test(this.temp.paramKey)) {
            this.$message({
              message: "参数名称必须为英文字母或数字",
              type: "warning"
            });
          } else {
            if (valid) {
              //校验完成后判断paramkey/paramDesc是否为空
              if (this.temp.paramKey === "" || this.temp.paramDesc === "") {
                console.log("param is null.");
                this.$message({
                  message: "参数名称或参数描述不能为空",
                  type: "warning"
                });
              } else {
                this.getParamData();
                let resBody = new paramAdd();
                resBody.data.paramKey = this.temp.paramKey;
                resBody.data.paramDesc = this.temp.paramDesc;
                resBody.data.paramValue = this.paramData;
                // console.log(this.temp.paramKey);
                // console.log(this.temp.paramDesc);
                // console.log(this.paramData);
                request(resBody)
                  .then(response => {
                    if (response.SYS_HEAD.ReturnCode === "000000") {
                      this.$parent.queryInfoList();
                      this.isShow = false;
                      this.$message({
                        type: "success",
                        message: "新增参数成功!"
                      });
                    } else {
                      console.log(response);
                    }
                  })
                  .catch(error => {
                    console.log("error", error);
                  });
              }
            } else {
              console.log("error submit!!");
              return false;
            }
          }
        }
      });
      }else{
         this.$message({
            message: "该参数名称已存在",
            type: "warning"
        });
      }
    },
    // 编辑参数信息
    paramEdit() {
      if (this.temp.paramDesc !== "" && this.paramValue.length !== 0) {
        this.getParamData();
        let resBody = new paramEdit();
        resBody.data.paramKey = this.temp.paramKey;
        resBody.data.paramDesc = this.temp.paramDesc;
        resBody.data.paramValue = this.paramData;
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              console.log(response);
              this.$parent.queryInfoList();
              this.isShow = false;
              this.$message({
                        type: "success",
                        message: "修改参数成功!"
                      });
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            console.log("error", error);
          });
        console.log("error submit!!");
        return false;
      } else {
        console.log("data is null.");
        this.$message({
          message: "参数值或参数描述不能为空",
          type: "warning"
        });
      }
    },

    // 校验参数可以是否存在
    paramkeyIsexist() {
      let resBody = new paramkeyIsexist();
      resBody.data.paramKey = this.temp.paramKey;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.paramExist = false;      //添加标志
            // console.log(response,"if");   //正常
          } else {
            this.paramExist = true;      //添加标志
            // console.log(response,"else");     //出现重名参数
            this.$message({
            message: "该参数名称已存在",
            type: "warning"
        });
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    resetTemp() {
      this.temp = {
        data: "",
        id: undefined,
        paramKey: this.temp.paramKey,
        paramDesc: this.temp.paramDesc
      };
    },

    // 点击新增参数值dialog显示
    handleCreate() {
      console.log(this.paramValue);
      this.resetTemp();
      this.dialogStatus = "create";
      this.titleVal = "新增参数值";
      this.innerVisible = true;
      this.$nextTick(() => {
        this.$refs["tempRules"].clearValidate();
      });
    },

    // 修改保存按钮
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (const v of this.paramValue) {
            if (v.id == this.temp.id) {
              const index = this.paramValue.indexOf(v);
              this.paramValue.splice(index, 1, this.temp); //删除当前下标的一个元素
              this.innerVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                offset: 60,
                duration: 2000
              });
            }
          }
        }
      });
    },
    // 参数值添加
    createData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.temp.id = getGuid(); //生成全局统一的标识符
          this.paramValue.unshift(this.temp); //向数组开头添加元素
          this.innerVisible = false;
          this.$notify({
            // title: "成功",
            message: "参数值添加成功！",
            type: "success",
            offset: 60,
            duration: 2000
          });
        }
      });
    },
    // 参数值修改
    handleUpdata(row) {
      // console.log(this.temp.paramKey);
      //临时暂存paramKey/paramDesc的值；
      var paramKey1 = this.temp.paramKey;
      var paramDesc1 = this.temp.paramDesc;
      this.temp = Object.assign({}, row);
      //浅拷贝后覆盖原值需重新传参
      this.temp.paramKey = paramKey1;
      this.temp.paramDesc = paramDesc1;
      this.dialogStatus = "update";
      this.titleVal = "编辑";
      this.innerVisible = true;
      this.$nextTick(() => {
        this.$refs["tempRules"].clearValidate();
      });
    },
    // 参数值的删除
    dialogDelete(row) {
      const index = this.paramValue.indexOf(row);
      this.paramValue.splice(index, 1);
      this.temp.data = "";
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        offset: 60,
        duration: 2000
      });
    },

    upMove(col) {
      for (let i = 0; i < this.paramValue.length; i++) {
        if (this.paramValue[i].id == col.id) {
          let index = this.paramValue.indexOf(this.paramValue[i]); //获取当前对象在该数组的索引
          if (index == 0) {
            return;
          }
          let tempOption = this.paramValue[index - 1]; //存储前一个
          this.$set(this.paramValue, index - 1, this.paramValue[index]);
          this.$set(this.paramValue, index, tempOption);
        }
      }
    },

    // 获取参数值的数据
    getList() {
      this.moveClass = true;
      this.oldList = this.paramValue.map(v => v.id);
      this.newList = this.oldList.slice();
      this.$nextTick(() => {
        this.setSort();
      });
    },
    // sortable
    setSort() {
      const el = document.querySelectorAll(
        ".dragTable .el-table__body-wrapper > table > tbody"
      )[0];
      let self = this;
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost", // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          let clonedItems = self.paramValue.filter(function(item) {
            return item;
          });
          const targetRow = clonedItems.splice(evt.oldIndex, 1)[0];
          clonedItems.splice(evt.newIndex, 0, targetRow);
          self.paramValue = [];
          self.$nextTick(() => {
            self.paramValue = clonedItems;
          });

          // for show the changes, you can delete in you code
          // const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
          // this.newList.splice(evt.newIndex, 0, tempIndex);
          // console.log(self.paramValue)
        }
      });
    }
  }
};
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.mouseDrag {
  cursor: move;
}
.slotFooter {
  text-align: right;
}
</style>
