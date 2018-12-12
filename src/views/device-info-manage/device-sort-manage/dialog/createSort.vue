<template>
   <el-dialog title='新增设备分类' :visible.sync='isShow' width='450px'  @open="openDevShortAdd"
               :close-on-click-modal=false  @close='clearForm'>
    <div v-loading="loading">
      <el-card>
        <el-form ref='addShort' :model='addShort' label-width="110px" :rules="rules" size='mini' label-position='left'>
          <el-row class='devAddHeight'>
            <el-col >
                <el-form-item label="设备分类名称:" prop="devAssortmentName">
                  <el-input v-model="addShort.devAssortmentName" placeholder="请输入设备分类名称" name="devAssortmentName" ></el-input>
                </el-form-item>
            </el-col>
            </el-row>
            <el-row class='devAddHeight'>
              <el-col >
                <el-form-item label='设备形式:' prop='devForm'>
                  <el-radio-group size='mini' v-model='addShort.devForm' @change="devFormChange" disabled>
                    <el-radio v-for="item in devForm" :key="item.id" :label='item.devForm' border>{{item.devFormName}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
              <el-row class='devAddHeight'>
                <el-col >
                  <el-form-item label="设备型号:" prop="devModelId">
                    <el-cascader v-model="addShort.devModelId" name="devModelId" change-on-select 
                      :options="devModel"
                      @change="devModelChange"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="C端程序:" prop="cProgramIdList">
                      <el-cascader v-model="addShort.cProgramIdList" name="cProgramIdList"  :options="cprogram"
                      :props="{value:'cProgramID',label:'cProgramName'}"></el-cascader>
                  </el-form-item>
                </el-col>   
            </el-row>
          </el-form>
      </el-card>
      <el-row style="margin:20px 0;text-align:right">
          <el-button  size="mini" @click="isShow=false">取消</el-button>                        
          <el-button type="primary" size="mini" @click="devShorAdd">确认</el-button>
      </el-row>
    </div>
   </el-dialog>
</template>

<script>
import request from "@/utils/request";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import devShortAdd from "@/message/deviceInfoManage/short/dev-short-add";
export default {
  data() {
    return {
      loading:false,
      devForm: [],
      addShort: {
        devForm: [],
        cProgramIdList: [],
        devAssortmentName: "",
        devModelId: []
      },
      devType: [],
      checkList: [], //模块
      devBox: [], //设备箱
      devModel: [], //设备型号
      devModelList: [],
      cprogram: [], //C端程序
      cprogramList: [],
      devModelId: "",
      rules: {
        devForm: [
          // {required:true,message:"设备形式必填！",trigger:"blur"}
        ],
        cProgramIdList: [
          // {required:true,message:"C端程序必填！",trigger:"blur"}
        ],
        devAssortmentName: [
          {
            max: 100,
            message: "设备分类名称必须少于100个字符！",
            trigger: "blur"
          },
          {required:true,message:"设备分类名称必填！",trigger:"blur"}
        ],
        devModelId: [
          // {required:true,message:"设备型号必填！",trigger:"blur"}
        ]
      }
    };
  },
  created() {},
  methods: {
    selFirst(val) {
      //选中级联下拉列表的第一个
      this.addShort.devModelId.push(val.value);
      if (val.hasOwnProperty("children")) {
        this.selFirst(val.children[0]);
      }
    },
    openDevShortAdd() {
      //初始化设备形式
      let resBody = new devRunList();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "devModelGroup" },
        { spinnerName: "cProgram" }
      ];
      this.loading=true;
      request(resBody)
        .then(response => {
          this.loading=false;
          this.devForm = response.RSP_BODY.devFormSpinner;
          this.devModel = response.RSP_BODY.devModelGroupSpinner;
          this.devModelList = Object.assign([], this.devModel);
          this.cprogram = response.RSP_BODY.cProgramSpinner;
          this.cprogramList = Object.assign([], this.cprogram);
          // this.selFirst(this.devModel[0]);
          this.devModelId=this.addShort.devModelId[2];
          this.addShort.devForm=this.createModel.devForm;
          this.devFormChange(this.addShort.devForm)
        })
        .catch(error => {
          this.loading=false;
          console.error("错误信息", error);
        });
    },
    devModelChange(val) {
      if (val.length == 3) {
        this.devModelId = val[val.length - 1];
      }
      
    },
    devFormChange(val) {
      //设备形式值改变事件
      if (val.length > 0) {
        this.cprogram = [];
        this.devModel = [];
        for (let i = 0; i < this.cprogramList.length; i++) {
          if (val == this.cprogramList[i].devForm) {
            this.cprogram.push(this.cprogramList[i]);
          }
        }
        //根据设备形式筛选设备型号下拉框
        for (let i = 0; i < this.devModelList.length; i++) {
          if (this.devModelList[i].hasOwnProperty("children")) {
            let devModelListTemp=Object.assign({},this.devModelList[i])
            this.devModel.push(devModelListTemp);
            let index=this.devModel.length-1;
            this.devModel[index].children=Object.assign([]);
            let tag=0;
            for (let j = 0; j < this.devModelList[i].children.length; j++) {
              if (val == this.devModelList[i].children[j].devForm) {
                tag=1;
                this.devModel[index].children.push(this.devModelList[i].children[j])
              }
            }
            if (tag===0) {
              this.devModel.pop()
            }
          }
        }
      }
    },
    devShorAdd() {
      this.$refs["addShort"].validate(valid => {
        if (valid) {
          this.loading=true;
          let resBody = new devShortAdd();
          resBody.data.devAssortmentName = this.addShort.devAssortmentName;
          resBody.data.devForm = this.addShort.devForm[0];
          resBody.data.cProgramIdList = this.addShort.cProgramIdList;
          resBody.data.devModelId = this.devModelId;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
               this.loading=false;                
                this.$message({
                  type: "success",
                  message: "设备分类创建成功!"
                });
                this.isShow = false;
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
    },
    clearForm(firstList, ...lists) {
      //重置表单数据
      this.addShort = {
        devForm: [],
        cProgramIdList: [],
        devAssortmentName: "",
        devModelId: []
      };
      this.$refs["addShort"].clearValidate()//清楚表单验证

    }
  },
  props: {
    createModel: Object
  },
  computed: {
    isShow: {
      get: function() {
        return this.createModel.isShow;
      },
      set: function(newValue) {
        this.createModel.isShow = newValue;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 0;
}
.el-radio--mini {
  margin-right: 10px;
}
</style>


