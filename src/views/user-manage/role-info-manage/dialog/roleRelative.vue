<template>
  <div>
    <el-dialog :visible.sync="isShow" title="权限关联" @open="openRelative" width="600px" :close-on-click-modal=false>
      <div v-loading="loading">
        <el-card class="coll_h">
          <el-tree
            :data="roleList"
            :props='{id: "perssionId",children: "perssionChild",label: "perssionName"}'
            show-checkbox
            ref="tree"
            node-key="perssionId"
            :default-checked-keys='optionRelative.selectItem'
            highlight-current
            >
          </el-tree>
        </el-card>
        <el-row>
          <div style="margin:20px 0;text-align:center">
            <el-button  size="mini" @click="isShow=false">取消</el-button>                  
            <el-button type="primary" size="mini" style="margin-top:10px;" @click="sureRoleRelative">确定</el-button>
          </div>
        </el-row> 
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import roleRelative from "@/message/userManage/role/role-relative";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
export default {
  props: { optionRelative: Object },
  data() {
    return {
      loading: false,
      roleList: [] //权限列表
    };
  },
  computed: {
    isShow: {
      get() {
        return this.optionRelative.isShow;
      },
      set(value) {
        this.optionRelative.isShow = value;
      }
    }
  },
  methods: {
    openRelative() {//打开权限弹窗
      //权限初始化
      this.loading = true;
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "permission" }];
      request(resBody)
        .then(response => {
          // console.log(response)
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.roleList = [];
            let temp = response.RSP_BODY.perssionTreeSpinner;
            // console.log(response)
            for (let i = 0; i < temp.length; i++) {
              if (
                temp[i].AUMSChannel ==
                this.optionRelative.currentRowList.roleSystem
              ) {
                this.roleList.push(temp[i]);
              }
            }
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.error("查询错误", error);
        });
      this.$nextTick(() => {
        //如果想要真正地在DOM加载完成后拿到数据，就需要调用VUE的全局api
        //设置权限回显
        let selectItem = [];
        if (
          this.optionRelative.currentRowList.hasOwnProperty("rolePerssionTree")
        ) {
          this.optionRelative.currentRowList.rolePerssionTree.forEach(
            element => {
              //设置
              if (element.hasOwnProperty("perssionChild")) {
                element.perssionChild.forEach(element1 => {
                  selectItem.push(element1.perssionId);
                });
              } else {
                selectItem.push(element.perssionId);
              }
            }
          );
          this.$refs.tree.setCheckedKeys(selectItem);
        }
      });
    },
    sureRoleRelative() {//关联权限
      this.loading = true;
      let resBody = new roleRelative();
      resBody.data.roleId = this.optionRelative.currentRowList.roleId;
      let permissionIdList = this.$refs.tree.getHalfCheckedNodes();
      let permissionId = [];
      let permission = [];
      for (let i = 0; i < permissionIdList.length; i++) {
        permissionId.push(permissionIdList[i].perssionId);
      }
      resBody.data.permissionIdList = permission.concat(
        this.$refs.tree.getCheckedKeys(),
        permissionId
      );
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.isShow = false;
            this.$message({
              type: "success",
              message: "角色关联成功!"
            });
            this.$emit("refreshTable");
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
    }
  }
};
</script>

<style lang="scss" scoped>
.coll_h {
  height: 400px;
  overflow-y: auto;
}
// .coll_h::-webkit-scrollbar {
//   //overflow 出现滚动条，将滚动条隐藏；
//   display: none;
// }
</style>
