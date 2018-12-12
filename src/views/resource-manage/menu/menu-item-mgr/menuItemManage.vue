<template>
     <div  v-loading="loading"
             element-loading-text="加载中。。。">
         <el-card >
            <el-row>
              <el-col :lg="2" :md="3">
                    <el-button type="primary" size="mini" @click="dialogOptionsAdd.isShow=true" icon="el-icon-plus" v-if="btnPermission('Button_MenuTrade_Add')">添加</el-button>
              </el-col>
              <el-col :lg="2" :md="3">
                    <el-button type="primary" size="mini" @click="dialogOptionsUpdate.isShow=true" :disabled="!isDisabledDel" icon="el-icon-edit" v-if="btnPermission('Button_MenuTrade_Edit')">修改</el-button>
              </el-col>
              <el-col :lg="2" :md="3">
                    <el-button type="primary" size="mini"  @click="dialogOptionsUpload.isShow=true" v-if="btnPermission('Button_MenuTrade_Import')">导入</el-button>
              </el-col>
              <el-col :lg="2" :md="3">
                    <el-button type="danger" size="mini" icon="el-icon-delete"  @click="delBut" :disabled="selection.length<1" v-if="btnPermission('Button_MenuTrade_Delete')">删除</el-button>
              </el-col>
              <el-col :lg="2" :md="3">
                    <el-button type="primary" size="mini" @click="dialogOptions.isShow=true" :disabled="!isDisabledDel" v-if="btnPermission('Button_MenuTrade_Detail')">查看详情</el-button>
              </el-col>
            </el-row>
            <el-table  ref="menuItemList" :data='menuItemList' border
              class="tableMarginTop"
              header-row-class-name="tableHeaderClass" 
              @selection-change="selectList"
            >
               <el-table-column type="selection" width="40px"></el-table-column>
               <el-table-column prop='tradeName' label='标题' min-width="125px" fixed></el-table-column>
               <el-table-column prop='icon' label='图标' min-width="385px">
                  <template slot-scope="scope">
                       <el-button size="mini" type="text" @click="detailInfo(scope.row.icon)">{{scope.row.icon}}</el-button>
                   </template>
               </el-table-column>
               <el-table-column prop='menuSize' label='大小'  :formatter="dataFormatSize"></el-table-column>
               <el-table-column prop='isEnabled' label='是否启用' :formatter="dataFormat"></el-table-column>
               <el-table-column prop='isHasChild' label='二级菜单' :formatter="dataFormat" ></el-table-column>
               <el-table-column prop='tradeCode' label='交易码'></el-table-column>
               <el-table-column prop='bg' label='背景图片'  min-width="385px">
                 <template slot-scope="scope">
                       <el-button size="mini" type="text" @click="detailInfo(scope.row.bg)">{{scope.row.bg}}</el-button>
                   </template>
               </el-table-column>
            </el-table>
            <div  style="text-align:right;margin-top:10px">
                    <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="10"
                        layout="total, prev, pager, next, jumper"
                        :total="total"> 
                    </el-pagination>
            </div>
        </el-card>
        <!-- 弹窗 -->
         <component :is='dialogList.menuItmeAdd' :option='dialogOptionsAdd'  @refreshTable="queryDeal"></component>
         <component :is='dialogList.menuItmeDetail' :option='dialogOptions'></component>
         <component :is='dialogList.menuItemUpdate' :option='dialogOptionsUpdate' @refreshTable="queryDeal"></component>
        <keep-alive>
          <component :is='dialogList.importTemplate' :option='dialogOptionsUpload'></component>
        </keep-alive>
     </div>
</template>

<script>
import menuItmeDetail from "./dialog/menuItemDetail";
import menuItmeAdd from "./dialog/menuItemAdd";
import menuItemUpdate from "./dialog/menuItemUpdate";
import importTemplate from "./dialog/menuItemUpload";
import getGlobalParams from "@/utils/getGlobalParams";
import request from "@/utils/request";
import queryDeal from "@/message/resourceManage/menu/menuItem/menuItem-query";
import delDeal from "@/message/resourceManage/menu/menuItem/menu-item-del";
export default {
  data() {
    return {
      loading: false,
      menuId: "", //交易id
      menuItemList: [], //交易表格数据
      selection: [], //选中表格数据
      total: undefined, //表格总条数
      currentPage: 1,
      pageSize: undefined,
      dialogList: {
        menuItmeDetail,
        menuItmeAdd,
        menuItemUpdate,
        importTemplate
      },
      dialogOptions: { isShow: false, currentRow: {} },
      dialogOptionsAdd: { isShow: false },
      dialogOptionsUpdate: { isShow: false, currentRow: {} },
      dialogOptionsUpload: { isShow: false },
      isDisabledDel: false,
      enum: {
        "1": "否",
        "0": "是"
      },
      enumSize: {  //大小列表
        normal: "正常",
        wide: "宽",
        smallWide: "小宽",
        small: "小",
        "4": "自定义"
      }
    };
  },
  created() {
    this.pageSize = getGlobalParams.get("PageSize");
    this.queryDeal();
  },
  methods: {
    itemDel() {  //删除交易
      this.loading = true;
      let resBody = new delDeal();
      resBody.data.menu_Id = this.menuId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            let message = "";
            for (let i = 0; i < response.RSP_BODY.resultSet.length; i++) {
              message += response.RSP_BODY.resultSet[i].alertMessage;
            }
            this.$message({
              type: "success",
              message: message
            });
            this.queryDeal();
          } else {
            this.loading = false;
            this.$message({
              type: "success",
              message: "菜单删除失败!"
            });
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    delBut() {  //删除弹窗
      this.$confirm("此操作将永久删除该交易, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.itemDel();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    detailInfo(val) {  //打开图标和背景图片
      window.open(val);
    },
    queryDeal() { //查询交易
      this.selection = [];
      this.isDisabledDel = false;
      this.loading = true;
      // this.loading=true
      let resBody = new queryDeal();
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            if (response.RSP_BODY) {
              this.menuItemList = response.RSP_BODY.resultSet;
              this.total = response.RSP_BODY.total;
            } else {
              this.loading = false;
              this.$message({
                type: "warning",
                message: "没有满足条件得记录!"
              });
            }
          } else {
            this.loading = false;
            this.$message({
              type: "error",
              message:
                "请求失败，错误码:" +
                response.SYS_HEAD.ReturnCode +
                "，错误信息：" +
                response.SYS_HEAD.ReturnMessage
            });
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    dataFormat(row, column) {
      //格式化表格数据
      return this.enum[row[column.property]];
    },
    dataFormatSize(row, column) {
      //格式化表格数据
      return row[column.property].indexOf(",") == -1
        ? this.enumSize[row[column.property]]
        : row[column.property];
    },
    handleSizeChange() {
      this.queryDeal();
    },
    handleCurrentChange() {
      this.queryDeal();
    },
    selectList(selection, val) {
      this.menuId = "";
      selection.forEach(element => {
        this.menuId = this.menuId + element.menu_Id + ",";
      });
      this.menuId = this.menuId.slice(0, this.menuId.length - 1);

      this.selection = selection;
      this.dialogOptionsUpdate.currentRow = selection[0];
      this.dialogOptions.currentRow = selection[0];
      //控制按钮是否禁用
      // this.delRow = [];
      if (selection.length == 1) {
        this.isDisabledDel = true;
      } else {
        this.isDisabledDel = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
</style>
