<template>
  <div>
    <el-card>
      <el-row :gutter="10">
        <el-col :sm='5' :lg='5'>
          <el-input v-model="search" size="mini" suffix-icon="el-icon-search" placeholder="请输入查询信息检索"></el-input>
        </el-col>
        <el-button type="primary" size="mini"
        icon="el-icon-plus"
        @click="handleParameter('add')" v-if="btnPermission('Button_Parameter_Add')">新增参数</el-button>
    
        <el-button type="primary" size="mini" :disabled="editBtn"
        @click="handleParameter('edit')" icon="el-icon-edit" v-if="btnPermission('Button_Parameter_Edit')">编辑参数</el-button>
    
        <el-button type="danger" size="mini" 
        icon="el-icon-delete" :disabled="deleteBtn"
        @click="deleteParameter" v-if="btnPermission('Button_Parameter_Delete')">删除</el-button>

        <el-button type="primary" size="mini" :disabled="bindBtn"
        @click="handleBindingDevice" v-if="btnPermission('Button_Parameter_Bind')">参数关系设定</el-button>
        
        <el-button type="primary" size="mini" :disabled="setBtn"
        @click="handleUntieDevice" v-if="btnPermission('Button_Parameter_Unbind')">设定解除</el-button>

      </el-row>
      <el-table
        :data="tables.slice((currentPage-1)*10,currentPage*10)"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-radio :label="scope.row.paramID"
            @change.native="getParamID(scope, scope.row)"
            v-model="paramID">{{null}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
            prop="paramKey" label="参数名称" width="120">
        </el-table-column>
        <el-table-column
            prop="paramDesc" label="参数描述" width="150">
        </el-table-column>
        <el-table-column
            prop="paramValue" label="参数值" min-width="120">
        </el-table-column>
        <el-table-column
            prop="createTime" label="创建时间" width="160">
        </el-table-column>
        <el-table-column 
       align="center"
        width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini"
            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        layout="total, prev, pager, next, jumper"
        :total="ParamTableData.length">
      </el-pagination>
    </el-card>
    
    <!-- 弹框 -->
    <component ref="addPar" :is='dialogList.addParameter' :rowData="rowVal" :option='dialogParameter'></component>
    <component :is='dialogList.queryParameterDetail' :paramObj="rowObj" :option='dialogQueryParameter'></component>
    <component :is='dialogList.bindingDevice' :rowData="rowVal" :option='dialogBindingDevice'></component>
    <component :is='dialogList.untieDevice' :rowData="rowVal" :option='dialogUntieDevice'></component>

  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import {
  addParameter,
  queryParameterDetail,
  bindingDevice,
  untieDevice
} from "./dialog";
import spinnerDataQuery from '@/message/spinnerDataQuery/spinner-data-query';
import paramBaseinfoQuery from '@/message/parameterManage/param-baseinfo-query';
import paramDelete from '@/message/parameterManage/param-delete';
import toolBox from "@/utils/toolBox";

export default {
  data() {
    return {
      search: "",
      paramID: "",
      rowObj: null,
      cProgramSpinner: [],
      devFormSpinner: [],
      currentPage: 1,
      loading: false,
      deleteBtn: true,
      editBtn: true,
      bindBtn: true,
      setBtn:true,
      dialogList: {
        addParameter,
        queryParameterDetail,
        bindingDevice,
        untieDevice
      },
      dialogParameter: {
        isShow: false,
        isEdit: false
      },
      dialogQueryParameter: {
        isShow: false
      },
      dialogBindingDevice: {
        isShow: false
      },
      dialogUntieDevice: {
        isShow: false
      },

      rowVal: null,
      ParamTableData: []
    };
  },
  computed:{
    // 表格前端模糊查询
    tables: function(){
      var search=this.search;
      if(search){
        return  this.ParamTableData.filter(function(dataNews){
          return Object.keys(dataNews).some(function(key){
            return String(dataNews[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.ParamTableData
    }
  },
  created() {
    this.initSpinnerList()  //初始化下拉框
    this.queryInfoList() // 参数基础信息
  },
  methods: {    
    // 初始化下拉框
    initSpinnerList() {
      let resBody = new spinnerDataQuery();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "cProgram" }
      ];
      request(resBody)
        .then(response => {
          this.cProgramSpinner = response.RSP_BODY.cProgramSpinner;
          this.devFormSpinner = response.RSP_BODY.devFormSpinner
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfoList()
    },

    /**
     * @desc 参数列表中获取参数ID
     */
    getParamID(scope, val) {
      this.paramID = val.paramID
      this.rowVal = val
      if(val) {
        this.deleteBtn = false
        this.editBtn = false
        this.bindBtn = false
        this.setBtn = false
      }
    },

    /**
     * @desc 查询参数信息列表
     */
    queryInfoList() {
      this.loading = true
      let resBody = new paramBaseinfoQuery()
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.loading = false
          var ParamTableDataTemp = response.RSP_BODY.paramBaseInfoList   //拿到参数暂时存放
          for(let i =0;i<ParamTableDataTemp.length;i++){
            for(var index in ParamTableDataTemp[i]){
              if(index == "createTime"){
                var createTimeTemp = this.dateTimeFomat(ParamTableDataTemp[i][index]);//格式化之后的时间
                ParamTableDataTemp[i][index]=createTimeTemp;
              }
            }
          }
          this.ParamTableData = ParamTableDataTemp;//取值
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //后台取到日期进行格式化
    dateTimeFomat(str){
      return toolBox.timeFormat(str);
    },
    // 删除参数
    deleteParameter() {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        // 调用参数删除方法
        this.paramDelete()
        // 删除后选中框置灰
        this.deleteBtn = true
        this.editBtn = true
        this.bindBtn = true
        this.setBtn = true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    /**
     * @desc 删除参数方法
     */
    paramDelete() {
      let resBody = new paramDelete()
      resBody.data.paramID = this.paramID
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log(response)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.queryInfoList()
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        console.log("error", error);
      })
    },

    /**
     * @desc 判断是新增、编辑，来确定dialog的展示
     * @param val [String] add||edit
     */
    handleParameter(val) {
      this.dialogParameter.isShow = true;
      if (val === "add") {
        this.dialogParameter.isEdit = false;
      } else {
        this.dialogParameter.isEdit = true;
      }
    },

    // 查看当前行参数详情信息
    handleQueryParameter(index, row) {
      this.rowObj = row;
      this.dialogQueryParameter.isShow = true;
    },

    // 绑定设备弹框
    handleBindingDevice() {
      this.dialogBindingDevice.isShow = true;
    },
    // 设定解除
    handleUntieDevice() {
      this.dialogUntieDevice.isShow = true;
    }


  }
};
</script>

<style scope>

</style>