 <template>
  <div v-if="businesData.isShow" v-loading="loading"
    element-loading-text="加载中。。。">
    <el-row :gutter="10" class="heightPencenter">
      <el-col :lg="16" :sm="13" class="heightPencenter" style="margin-bottom:10px">
        <el-card class="businesModel1">
            <el-button size="mini" type="primary" icon='el-icon-plus'  @click="dialogOptions.isShow=true" v-if="btnPermission('Button_MenuGroup_Add')">添加</el-button>
            <el-table  ref="menuGroupList" :data='tableDataPage' border
              class="tableMarginTop"
              header-row-class-name="tableHeaderClass"
              highlight-current-row
              @row-click="rowClick"
              @selection-change="selectChange"
            >
            <!-- businesData.isShowChecked  控制表格是否显示复选框-->
              <el-table-column type="selection" v-if="businesData.isShowChecked" 
              :selectable="isSelected" width="40px"
              :reserve-selection="true"></el-table-column>
              <!-- :reserve-selection="true"保留选中状态 -->
              <el-table-column prop='categoryName' label='业务模块标题' min-width='107px'></el-table-column>
              <el-table-column prop='themeColor' label='背景颜色' min-width='107px'></el-table-column>
              <el-table-column prop='layout' label='布局(行,列)' :formatter="formatLayout" min-width='107px'></el-table-column>
              <el-table-column prop='items' label='操作' width="100">
                <template slot-scope="scope">
                  <a><i class="el-icon-edit" @click="dialogOptionsUpdate.isShow=true" v-if="btnPermission('Button_MenuGroup_Edit')"></i></a>
                  <a><i class="el-icon-circle-close-outline" @click="delBusiness" v-if="btnPermission('Button_MenuGroup_Delete')"></i></a>
                </template>
              </el-table-column>
          </el-table>
           <div  style="text-align:right;margin-top:10px;">
               <!-- @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                @next-click="nextClick(currentPage,5)"
                :current-page="currentPage"
                :page-size="10" -->
            <el-pagination 
              :current-page="currentPage" 
              background
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              @current-change="changePage"
              :total="businesData.tileMenuData.length"> 
            </el-pagination>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="8" :sm="11" class="heightPencenter">
        <el-card class="businesModel1">
          <div slot="header" style="color:#606266;"><span>预览业务模块</span></div>
          <div v-if="isShow" style="background:#eee;height:100%">
            <aui-tele-menu ref="businessMode" :tileMenuData="tileMenuDataItem" :tileMenuConfig="tileMenuConfig"></aui-tele-menu>
          </div>
        </el-card>
      </el-col>           
    </el-row>
    <component :is='dialogList.menuGroupAdd' :option='dialogOptions' @refreshTable="queryBusiness"  @modelRefreshTable="modelRefreshTable"></component>
    <component :is='dialogList.menuGroupUpdate' :option='dialogOptionsUpdate'  @refreshTable="queryBusiness" @modelRefreshTable="modelRefreshTable"></component>
  </div>
</template>

<script>
import tileMenuConfig from "../../../../../static/tile-menu-config.json"; //导入配置文件
import auiTeleMenu from "@/components/tileMenu/TileMenu";
import menuGroupAdd from "./dialog/menuGroupAdd";
import menuGroupUpdate from "./dialog/menuGroupUpdate";
import request from "@/utils/request";
import menuGroupDel from "@/message/resourceManage/menu/menuGroup/menu-group-del";
import getGlobalParams from "@/utils/getGlobalParams";

export default {
  name: "business-mode",
  components: { auiTeleMenu },
  props: { businesData: Object }, 
  data() {
    return {
      indexCol: undefined,  //表格被置灰项 要求菜单的行数不能超过3
      rowLayout: undefined,  
      currentRows: 0,  //当前选中行的行数
      currentDatas: [],  //表格选中行
      isShow: false,  //预览窗口的菜单组件是否显示
      tileMenuDataItem: [],  //预览窗口的数据
      tileMenuConfig: undefined, //菜单配置文件
      tileMenuData: [], //菜单组数据
      loading: false,
      currentPage: 1,
      pageSize: undefined,
      dialogList: { menuGroupAdd, menuGroupUpdate },
      dialogOptions: { isShow: false },
      dialogOptionsUpdate: { isShow: false, currentRow: {} },
      group_Id: undefined //当前选中的数据id
    };
  },
  created() {
    this.tileMenuConfig = tileMenuConfig; //获取预览业务模块的配置文件
    this.pageSize = getGlobalParams.get("PageSize");
  },
  computed: {
    tableDataPage() { //表格数据，实现前端分页
      return this.businesData.tileMenuData.slice( //this.businesData.tileMenuData 所有表格数据，由父级传过来
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    }
  },
  mounted() {
    for (let i = 0; i < this.businesData.selRows.length; i++) {  //this.businesData.selRows 选中的数据
      this.$refs.menuGroupList.toggleRowSelection(
        this.businesData.selRows[i],
        true
      ); //修改设置回显数据
    }
  },
  methods: {
    modelRefreshTable() {  //添加菜单模板时添加或者修改或者删除后刷新表格
      this.$emit("refreshModel");
    },
    changePage(val) {
      this.currentPage = val;  //切换表格当前页
    },
    formatLayout(row, column) {  //格式化表格 布局列
      return row.layout[0] + "行" + row.layout[1] + "列";
    },
    menuGroupDel() { //删除业务模块
      this.loading = true;
      let resBody = new menuGroupDel();
      resBody.data.group_Id = this.group_Id;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.$message({
              type: "success",
              message: response.RSP_BODY.resultSet[0].alertMsg
            });
            this.isShow=false;
            this.$emit("refreshTable");
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    delBusiness() {  //弹出删除业务模块弹窗
      this.$confirm("此操作将永久删除该业务模块, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.menuGroupDel();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    queryBusiness() {
      this.isShow=false; //添加修改删除后刷新预览窗口
      this.$emit("refreshTable");  //刷新表格
    },
    selectChange(selection, val) {
      //表格选中行
      this.$emit("businesData", selection); //将表格选中的行返回给父元素
      this.indexCol = undefined;
      this.currentRows = 0;
      this.currentDatas = selection; //返回数据格式不正确会报错，根据行数判断可以选择的业务模块
      selection.forEach(element => {
        if (element.layout[0] == 3) { 
          this.disabledRows(element.gid, 3);
          return;
        } else if (element.layout[0] == 2) {
          this.disabledRows(element.gid, 2);
        } else if (element.layout[0] == 1) {
          this.disabledRows(element.gid, 1);
        }
      });
    },
    isSelected(row, index) {  //判断是否可选
      for (let index = 0; index < this.currentDatas.length; index++) {
        if (row.gid == this.currentDatas[index].gid) {
          return 1;
        }
      }
      if (this.indexCol == undefined) {
        return 1;
      } else {
        if (this.rowLayout == 3) {
          if (row.gid != this.indexCol) {  //保证不是当前选中的行
            return 0;
          } else {
            return 1;
          }
        } else if (this.rowLayout == 2 || this.rowLayout == 1) {
          if (this.indexCol.indexOf(row.gid) > -1) {
            return 0;
          } else {
            return 1;
          }
        }
      }
    },
    disabledRows(gid, row) {  //判断可配合选中的项
      this.indexCol = undefined;
      this.rowLayout = row;
      for (let i = 0; i < this.businesData.tileMenuData.length; i++) {
        if (row == "3") {  //如果当前选中行为3
          if (this.businesData.tileMenuData[i].gid == gid) {
            this.indexCol = gid;
            this.currentRows += this.businesData.tileMenuData[i].layout[0];
            return;
          }
        } else if (
          (row == "2" || row == "1") &&
          this.businesData.tileMenuData[i].gid == gid
        ) {
          let tileMenuData2 = Object.assign([], this.businesData.tileMenuData);
          tileMenuData2.splice(i, 1);
          this.indexCol = [];
          this.currentRows += this.businesData.tileMenuData[i].layout[0];
          tileMenuData2.forEach(element => {
            if (this.currentRows + element.layout[0] > 3) {
              this.indexCol.push(element.gid); //被置灰项
            }
          });
          return;
        }
      }
    },
    rowClick(currenRow, oldCurrentRow) {  //控制预览数据
      this.dialogOptionsUpdate.currentRow = currenRow;
      this.group_Id = currenRow.gid;
      this.isShow = false;
      setTimeout(() => {
        this.$set(this.tileMenuDataItem, 0, [currenRow]);
        this.isShow = true;
      }, 0);
    }
  }
};
</script>

<style lang="scss">
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
.heightPencenter {
  height: 100%;
}
.businesModel1 {
  // height: 100%;
  min-height: 630px;
  // overflow-y: auto;
  .el-table .has-gutter .el-checkbox__inner {
    display: none !important;
  }
}
.businesModel1::-webkit-scrollbar {
  display: none;
}
.businesItems {
  display: inline-block;
  padding: 5px 10px;
  .el-checkbox-button,
  .el-checkbox-button__inner {
    margin: 5px;
  }
  .el-checkbox-button:first-child.el-checkbox-button__inner {
    border-left: none;
    border-radius: 0px;
  }
  .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 0px;
  }
  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border-radius: 0px;
  }
}
</style>
