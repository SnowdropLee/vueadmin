<template>
    <div>
        <el-dialog :visible.sync="isShow" width="890px" :close-on-click-modal="false" title="角色维护" >
            <keep-alive>
                <component :is="dialogList.userRole" :option="option"></component>
            </keep-alive>

           
        </el-dialog>
    </div>
</template>
<script>
import userRole from "./userRole";
import request from "@/utils/request";
import userRoleAssocial from "@/message/userManage/user/user-role-associal";
export default {
  props: { option: Object },
  data() {
    return {
      dialogList: { userRole }
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
    userRole() {
      console.log(this.option);
      let resBody = new userRoleAssocial();
      (resBody.data.userId = this.option.userId),
        (resBody.data.roleIdList = this.option.roleIdList),
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                type: "success",
                message: "用户创建成功!"
              });
            }
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: error
            });
          });
    }
  }
};
</script>
<style lang="sass" scoped>

</style>
