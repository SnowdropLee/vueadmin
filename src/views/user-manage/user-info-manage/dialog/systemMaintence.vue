<template>
  <div v-loading="loading">
    <el-card>
      <tree-table  :data="data" ref="systemTable" 
      :expandAll="isExpandAll" 
      :columns="columns" border
      :toggleRow="toggleRow"
      :clearRow="option.clearRow"
      @returnData="returnData" height="400" >
      </tree-table>
    </el-card> 
    <el-row style="margin:20px;text-align:center">
      <el-button  size="mini" @click="cancleSystem">取消</el-button>
      <el-button type="primary" size="mini" @click="sureSystem">确定</el-button>    
    </el-row>  
  </div>
</template>
<script>
import treeTable from "@/components/TreeTable";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import userSystem from "@/message/userManage/user/user-system";
export default {
  components: { treeTable },
  props: { option: Object },
  data() {
    return {
      loading: false,
      toggleRow: undefined,
      isExpandAll: true, //展开表格
      columns: [//树形表格的表头项，不能删除
        {
          text: "系统类型",
          value: "systemName",
          width: 100
        },
        {
          text: "设备分类",
          value: "devAssortmentName",
          width: 120
        },
        {
          text: "设备型号",
          value: "devModel",
          width: 120
        },
        {
          text: "应用",
          value: "programList"
        }
      ],
      data: [], //树形表格的数据
      aums001: [], //网页C端的数据--------IDE
      CCabinet: [], //自助C端 柜式数据
      CPad: [], //自助C端 PAD数据
      aums002: [], //自助V端-------系统
      selectC: [], //选中的C端的数据
      selectV: [], //选中的V端的数据
      systemList: [] //所有系统列表
    };
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
  },
  methods: {
    returnData(selection, val) {//树形表格选中的数据
      this.selectC = [];
      let selection1 = Object.assign([], selection);
      for (let i = 0; i < selection1.length; i++) { //将自助C端和柜式PAD过滤掉
        if (
          selection1[i].hasOwnProperty("systemId") &&
          selection1[i].systemId === "aums001CId"
        ) {
          continue;
        }
        if (
          selection1[i].hasOwnProperty("systemName") &&
          selection1[i]._level != 1
        ) {
          continue;
        }
        this.selectC.push(selection1[i]);
      }
    },
    sureSystem() {//为用户关联所属系统
      let selectC = [];
      this.selectC.forEach(element => {
        selectC.push(element.systemId);
      });
      let resBody = new userSystem();
      this.loading = true;
      resBody.data.userId = this.option.userId;
      resBody.data.systemIdList = selectC;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.$message({
              type: "success",
              message: "用户关联系统成功!"
            });
            this.loading = false;
            this.isShow = false;
            this.$emit("systemEmit");
          } else {
            this.loading = false;
            this.$message({
              type: "info",
              message: "用户关联系统失败!"
            });
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    cancleSystem() {//点取消按钮后并把结果返回给创建用户的主窗口，以此来控制弹窗的关闭
      this.option.isShow = false;
      this.$emit("systemClose");
    },
    initSystemList() {//系统列表初始化
      this.loading = true;
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "system" }];
      request(resBody)
        .then(response => {
          // console.log('initSystemList:' , response)
          if (response.SYS_HEAD.ReturnCode == "000000") {
            let systemList = response.RSP_BODY.systemListSpinner;
            this.systemList = systemList;
            this.aums001 = this.systemList.aums001; //自助C端
            this.aums002 = this.systemList.aums002[0]; //自助V端
            this.data = [];
            this.data.push(this.aums002); //将自助V端的数据添加到树形表格
            let aums001C = {
              //将自助C端，柜式，PAD，按固定格式拼接到树形表格，因为这三项是页面展示，并不是后台返回的数据
              systemName: "IED权限",
              systemId: "aums001CId",
              isUser: false,
              // children: [
              //   {
              //     systemName: "柜式",
              //     devForm: "1",
              //     isUser: false,
              //     children: []
              //   },
              //   {
              //     systemName: "PAD",
              //     devForm: "2",
              //     isUser: false,
              //     children: []
              //   }
              // ]
            };
            this.data.push(aums001C); //将自助C端，柜式，PAD添加到树形表格
            for (let i = 0; i < this.aums001.length; i++) {
              //遍历自助C端的数据，
              let programList = [];//自助C端的应用
              this.aums001[i].programList.forEach(element => {
                programList.push(element.programName);
              });
              this.aums001[i].programList = programList.join(",");//将多个应用按“，”分割
              if (this.aums001[i].devForm == "1") {//按设备形式将数据划分 （1--柜式）
                this.CCabinet.push(this.aums001[i]);
                // let index = this.selectC.indexOf(this.aums001[i].systemId);
                // if (index > -1) {
                //   // this.$refs.CCabinet.toggleRowSelection(this.aums001[i])//默认选中当前行
                // }
              } else if (this.aums001[i].devForm == "2") {//（2--PAD）
                this.CPad.push(this.aums001[i]);
                // let index = this.selectC.indexOf(this.aums001[i].systemId);
                // if (index > -1) {
                //   // this.$refs.CPad.toggleRowSelection(this.aums001[i])//默认选中当前行
                // }
              }
            }
            let toggleRow = Object.assign([]);
            this.data.forEach(element => {              //将数据拆成表格需要的格式
              if (element.systemId) {//自助V回显数据
                if (
                  this.option.hasOwnProperty("system") &&
                  this.option.system.indexOf(element.systemId) > -1
                ) {
                  toggleRow.push(element);
                }
              }
              if (element.systemId === "aums001CId") {//将柜式和PAD都赋值给表格数据
                element.children.forEach(element1 => {
                  if (element1.devForm == "1") {
                    element1.children = this.CCabinet;
                  } else if (element1.devForm == "2") {
                    element1.children = this.CPad;
                  }
                  element1.children.forEach(elementCCabinet => {//自助C端回显数据
                    if (
                      this.option.hasOwnProperty("system") &&
                      this.option.system.indexOf(elementCCabinet.systemId) > -1
                    ) {
                      toggleRow.push(elementCCabinet);
                    }
                  });
                });
              }
            });
            setTimeout(() => {
              this.toggleRow = toggleRow;//回显数据
            }, 0);
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.error("查询错误", error);
        });
    }
  },
  watch: {
    option: {//监听返回的数据，当数据改变时设置回显数据
      handler: function(val, oldVal) {
        let toggleRow = Object.assign([]);
        this.data.forEach(element => {
          if (element.systemId) {
            if (
              this.option.hasOwnProperty("system") &&
              this.option.system.indexOf(element.systemId) > -1
            ) {
              toggleRow.push(element);
            }
          }
          if (element.systemId === "aums001CId") {
            element.children.forEach(element1 => {
              element1.children.forEach(elementCCabinet => {
                if (
                  this.option.hasOwnProperty("system") &&
                  this.option.system.indexOf(elementCCabinet.systemId) > -1
                ) {
                  toggleRow.push(elementCCabinet);
                }
              });
            });
          }
        });
        setTimeout(() => {
          this.toggleRow = toggleRow;
        }, 0);
      },
      deep: true
    }
  },
  created() {
    // if (this.option.system) {
    //   this.selectC = this.option.system;
    //   this.selectV = Object.assign([], this.option.system);
    // }
    //系统列表初始化
    this.initSystemList();
  }
};
</script>

<style  scoped lang="scss">
.CCbox {
  border: 1px solid #eee;
  padding: 5px;
}
.ccRow {
  width: 100%;
  border-bottom: 1px solid #eee;
}
.CCItem {
  display: inline-block;
  width: 30%;
  padding: 5px;
  text-align: center;
}
</style>
