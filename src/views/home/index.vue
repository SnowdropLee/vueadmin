<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="16">
        <el-card class="card_h">
          <div slot="header">
            <span>
              <i class="el-icon-info"></i> 待办事项</span>
            <el-button style="float: right; padding: 3px 0" @click="toDetail" type="text">更多</el-button>
          </div>
          <div class="coll_h">
            <el-scrollbar style="height:100%">
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    一致性 Consistency
                    <i class="header-icon el-icon-info"></i>
                  </template>
                  <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                  <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item title="反馈 Feedback">
                  <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                  <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
                <el-collapse-item title="效率 Efficiency">
                  <div>简化流程：设计简洁直观的操作流程；</div>
                  <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                  <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
                </el-collapse-item>
                <el-collapse-item title="可控 Controllability">
                  <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                  <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                </el-collapse-item>
                <el-collapse-item title="可控 Controllability">
                  <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                  <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                </el-collapse-item>
              </el-collapse>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card_h cal_h">
          <div slot="header">
            <span>
              <i class="el-icon-date v_date"></i> 日历
              <span class="c_tips">点击选中日期查看详情</span>
            </span>
          </div>
          <div>
            <vue-event-calendar :events="demoEvents" @day-changed="handleDayChanged" @month-changed="handleMonthChanged"></vue-event-calendar>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="16">
        <el-card class="card_h">
          <div slot="header">
            <span>
              <i class="el-icon-time"></i> 事项进度</span>
          </div>
          <div class="coll_h">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="发生日期" width="110">
              </el-table-column>
              <el-table-column prop="address" label="事项" min-width="200">
              </el-table-column>
              <el-table-column label="状态" width="80">
                <template slot-scope="scope">
                  <el-tag size="small">处理中</el-tag>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card_h">
          <div slot="header">
            <span>
              <i class="el-icon-bell"></i> 公告</span>
          </div>
          <el-tabs type="card">
            <el-tab-pane>
              <span slot="label">
                <svg-icon class="svgIcon" :icon-class="'user'"></svg-icon> 个人</span>
              <ul class="infoMsg">
                <li v-for="v in selfTodoList" :key="v.id">
                  <span>{{ v.desc }}</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i class="el-icon-setting"></i> 系统</span>
              <ul class="infoMsg">
                <li v-for="v in systemTodoList" :key="v.desc">
                  <span>{{ v.desc }}</span>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

    </el-row>
    <keep-alive>
      <component :is='dialogList.changepw' :option='dialogOptionChangepw'></component>
    </keep-alive>
  </div>
</template>

<script>
import changepw from "./component/changepw";
import { getMenu } from "@/utils/auth";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dialogList: {
        changepw
      },
      dialogOptionChangepw: {
        isShow: false
      },
      tableData: [
        {
          date: "2016-06-30",
          name: "处理中",
          address: "缺钞-沙江支行上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-06-25",
          name: "处理中",
          address: "读卡器损坏-三元桥支行北京市朝阳区三元桥街道"
        },
        {
          date: "2016-06-27",
          name: "处理中",
          address: "网络异常-来广营营业厅北京市朝阳区来广营西路 01 号"
        }
      ],
      selfTodoList: [
        {
          id: "1",
          desc: "系统监测到您首次登录，为了您的安全，请修改密码"
        }
      ],
      systemTodoList: [{ desc: "六月一日起将放假三天，请周知！" }],
      demoEvents: [
        {
          date: "2018/07/12", // 必填
          title: "Foo"
        },
        {
          date: "2018/07/15",
          title: "Bar",
          desc: "description",
          customClass: "disabled highlight" // 自定义日历单元格的Class，会加到对应的日历单元格上
        }
      ],
      value1: "",
    };
  },
  mounted() {
    if (this.$store.getters.isFirstLoginFLag==="0") {
            this.isFirstLogin();
    }
  },
  computed: {
    ...mapGetters([
      "isFirstLoginFLag"
    ])
  },
  watch:{
    isFirstLoginFLag() {  //在登录后数据都返回判断该用户是否为首次登录
      if (this.isFirstLoginFLag==="0") {
              this.isFirstLogin();
      }
    }
  },
  methods: {
    handleMonthChanged(month) {
      console.log(month);
    },
    handleDayChanged(day) {
      console.log(day);
      if (day.events.length === 1) {
        this.$router.push("/home/eventCalendar");
      }
    },
    toDetail() {
      this.$router.push("/parameterManage/parameterManage");
    },
    //首次登陆判断
    isFirstLogin() {
      console.log(this.isFirstLoginFLag,"isFirst")
      if (this.$store.getters.isFirstLoginFLag === "0") {
        this.$confirm("用户首次登陆,请修改密码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showCancelButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false
        })
          .then(() => {
            this.dialogOptionChangepw.isShow = true;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    }
  }
};
</script>

<style scoped>
.el-card {
  margin-bottom: 10px;
}
.el-card.card_h {
  height: 300px;
}
/* .v_date{
  color: #409EFF;
} */
.coll_h {
  height: 200px;
  overflow-y: auto;
  /* overflow-x: hidden; */
}
.coll_h::-webkit-scrollbar {
  display: none;
}
.infoMsg {
  font-size: 14px;
  color: #666666;
}
.infoMsg li {
  padding: 6px 0;
}
</style>
<style>
.cal_h .el-card__body {
  padding: 0; /* 调整el-card */
}
.cal_h .__vev_calendar-wrapper .events-wrapper {
  display: none; /* 隐藏右侧面板 */
}
.cal_h .__vev_calendar-wrapper .cal-wrapper {
  padding: 0;
  width: 100%; /* 左侧日历位置调整 */
}
.cal_h .__vev_calendar-wrapper .cal-wrapper .cal-header > div {
  line-height: 5px; /* 头部line高度下调 */
}
.cal_h .__vev_calendar-wrapper .arrow-left.icon,
.cal_h .__vev_calendar-wrapper .arrow-right.icon {
  margin-top: 5px; /* 左右箭头上调5px */
}
.cal_h .__vev_calendar-wrapper .cal-wrapper .cal-body .weeks .item {
  line-height: 40px; /* 星期调整 */
}
.cal_h .__vev_calendar-wrapper .cal-wrapper .date-num {
  line-height: 26px; /* 调整日历每天格子高度 */
}
.cal_h .__vev_calendar-wrapper .cal-wrapper .cal-header {
  /* height: 40px; */ /*  */
}
.__vev_calendar-wrapper .cal-wrapper .cal-body .dates .item .is-event {
  width: 30px;
  height: 30px;
  margin-left: -14px;
  margin-top: -16px;
}
.c_tips {
  color: #999;
  font-size: 14px;
  margin-left: 10px;
}
</style>

