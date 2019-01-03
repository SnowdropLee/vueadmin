<template>
  <div>
    <el-dialog title="版本详情" :close-on-click-modal=false :lock-scroll=false :visible.sync="detailIsShow" width="900px" @open="getVersionDetailList">
      <code>
        <div>版本编号：
          <span v-text="versionCode"></span>
        </div>
        <div>版本描述：
          <span v-text="adDescription"></span>
        </div>
      </code>
      <el-card>
        <el-table :data="gridData" border header-row-class-name="tableHeaderClass">
          <!-- <el-table-column property="fileId" label="文件ID" width="100"></el-table-column> -->
          <el-table-column property="fileName" label="文件名称" width="120"></el-table-column>
          <el-table-column property="filePath" label="文件路径" min-width="200"></el-table-column>
          <el-table-column property="fileType" label="文件类型" width="80"></el-table-column>
          <el-table-column property="fileSize" label="文件大小" width="80"></el-table-column>
          <el-table-column property="createTime" label="创建时间" width="160"></el-table-column>
        </el-table>

        <el-pagination style="text-align: right; margin-top:20px;" @current-change="handleCurrentChange" :current-page.sync="currentPage" background layout="total, prev, pager, next, jumper" :total="gridData.length">
        </el-pagination>

      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="detailIsShow = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import versionDetailList from "@/message/version/versionFileUpload/version-detail-list";
export default {
  props: {
    option: Object
  },
  data() {
    return {
      gridData: [], // 表格数据
      currentPage: 1
    };
  },
  computed: {
    detailIsShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newVlaue) {
        this.option.isShow = newVlaue;
      }
    },
    versionCode: function() {
      return this.option.versionCode;
    },
    adDescription: function() {
      return this.option.adDescription;
    }
  },
  methods: {
    /**
     * 当前页变化后请求版本详情方法
     */
    handleCurrentChange(val) {
      this.getVersionDetailList()
    },

    /**
     * 查看当前版本详情信息方法
     */
    getVersionDetailList() {
      let resBody = new versionDetailList();
      
      resBody.data.versionCode = this.option.zipFileId;
      resBody.data.fileName = this.option.fileName;
      resBody.data.zipFileId = this.option.zipFileId;
      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;

      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.gridData = response.RSP_BODY.verDetailInfoList;
          } else {
            this.$message({
              message: response.SYS_HEAD.ReturnMessage,
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
code {
  background: #eef1f6;
  padding: 15px 16px;
  margin-bottom: 0px;
  display: block;
  line-height: 36px;
  font-size: 15px;
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
}
</style>
