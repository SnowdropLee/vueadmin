<template>
  <div class="matrix">
    <!-- 这里的标签暂时用机具状态数据做全集 -->
    <div class="labelOption">
      <div class="labelOptionItem"  v-for="(item,index) in devStatuData" :key="index">
        <div class="label" :style="'background:'+(devRunStatuTrans[item.devRunningStatus]?devRunStatuTrans[item.devRunningStatus].devRunningStatusColor:'')+';'"></div>
        <span class="labelText">{{(devRunStatuTrans[item.devRunningStatus]?devRunStatuTrans[item.devRunningStatus].devRunningStatusName:"")}} - {{item.deviceCount}}台</span>
        <!-- <i :style="'background:'+item.devRunningStatusColor+';'"></i>
        <span>{{item.devRunningStatusName}}</span> -->
      </div>
      <div style="clear:both;"></div>
    </div>
    <div class="matrixPanelCtn">
      <div class="matrixPanel detailPanel" v-for="(item,index) in data" :key="index" @click="clickDetail(item)">
        <!-- devtype -->
        <p>{{item.devType}}</p>
        <!-- icon -->
        <svg-icon class="matrixIcon" :icon-class="'infoCollectIcon'" :add-style="'color:'+(devRunStatuTrans[item.devRunningStatus]?devRunStatuTrans[item.devRunningStatus].devRunningStatusColor:'')+';'"></svg-icon>
        <!-- name -->
        <p>{{item.devNum}}</p>
        <!-- statu -->
        <span>{{devStatuTrans[item.devState]?devStatuTrans[item.devState].devStateName:""}}--{{devRunStatuTrans[item.devRunningStatus]?devRunStatuTrans[item.devRunningStatus].devRunningStatusName:""}}</span>
        <!-- statuLabel -->
        <div class="panelLabelCtn">
          <!-- <div v-show="item.devModuleStatus!='x'">{{item.devModuleStatus}}</div>
          <div v-show="item.devConnectStatus!='x'">{{item.devConnectStatus}}</div>
          <div v-show="item.devCardBoxStatus!='x'">{{item.devCardBoxStatus}}</div>
          <div v-show="item.devCashBoxStatus!='x'">{{item.devCashBoxStatus}}</div> -->
          <el-popover
            placement="top-start"
            title="模块状态："
            trigger="hover"
            :content="((modelStatuTrans[item.devModuleStatus]=='x'||modelStatuTrans[item.devModuleStatus]==undefined)?'未知':modelStatuTrans[item.devModuleStatus].devModuleStatusName)">
            <div  slot="reference" :style="'background:'+((modelStatuTrans[item.devModuleStatus]=='x'||modelStatuTrans[item.devModuleStatus]==undefined)?'#dadada':modelStatuTrans[item.devModuleStatus].devModuleStatusColor)+';'"></div>
          </el-popover>
          <el-popover
            placement="top-start"
            title="连接状态："
            trigger="hover"
            :content="((connStatuTrans[item.devConnectStatus]=='x'||connStatuTrans[item.devConnectStatus]==undefined)?'未知':connStatuTrans[item.devConnectStatus].devConnectStatusName)">
            <div  slot="reference" :style="'background:'+((connStatuTrans[item.devConnectStatus]=='x'||connStatuTrans[item.devConnectStatus]==undefined)?'#dadada':connStatuTrans[item.devConnectStatus].devConnectStatusColor)+';'"></div>
          </el-popover>
          <el-popover
            placement="top-start"
            title="卡箱状态："
            trigger="hover"
            :content="((cardStatuTrans[item.devCardBoxStatus]=='x'||cardStatuTrans[item.devCardBoxStatus]==undefined)?'未知':cardStatuTrans[item.devCardBoxStatus].devCardBoxStatusName)">
            <div  slot="reference" :style="'background:'+((cardStatuTrans[item.devCardBoxStatus]=='x'||cardStatuTrans[item.devCardBoxStatus]==undefined)?'#dadada':cardStatuTrans[item.devCardBoxStatus].devCardBoxStatusColor)+';'"></div>
          </el-popover>
          <el-popover
            placement="top-start"
            title="钞箱状态："
            trigger="hover"
            :content="((cashStatuTrans[item.devCashBoxStatus]=='x'||cashStatuTrans[item.devCashBoxStatus]==undefined)?'未知':cashStatuTrans[item.devCashBoxStatus].devCashBoxStatusName)">
            <div  slot="reference" :style="'background:'+((cashStatuTrans[item.devCashBoxStatus]=='x'||cashStatuTrans[item.devCashBoxStatus]==undefined)?'#dadada':cashStatuTrans[item.devCashBoxStatus].devCashBoxStatusColor)+';'"></div>
          </el-popover>
        </div>
      </div>
      <div style="clear:both;"></div>
    </div>
    <!-- 点击增加设备的功能 暂时取消 -->
    <!-- <div class="matrixPanel addPanel" @click="clickAdd">
      <svg-icon class="matrixPlusIcon" :icon-class="'plus'"></svg-icon>
    </div> -->
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import toolBox from "@/utils/toolBox";

import request from "@/utils/request";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

//要使用全局的颜色global
//引入状态文字的关系
//引入运行状态文字的关系
//要用全局的配色去对应两种状态叠加的颜色

export default {
  async beforeCreate() {
    //请求下拉列表数据
    let resBody = new spinnerList();
    resBody.data.spinnerList = [
      { spinnerName: "devStatus" }
    ];
    let response = await request(resBody);
    if (response.SYS_HEAD.ReturnCode == "000000") {
      //设备状态
      this.devStatuTrans = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devStateList,
        "devState"
      );
      //设备运行状态
      this.devRunStatuTrans = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devRunningStatusList,
        "devRunningStatus"
      );
      //模块状态
      this.modelStatuTrans = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devModuleStatusList,
        "devModuleStatus"
      );
      //连接状态
      this.connStatuTrans = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devConnectStatusList,
        "devConnectStatus"
      );
      //卡箱状态
      this.cardStatuTrans = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devCardBoxStatusList,
        "devCardBoxStatus"
      );
      //钞箱状态
      this.cashStatuTrans = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devCashBoxStatusList,
        "devCashBoxStatus"
      );
    } else {
      this.$message({
        type: "error",
        message:
          "请求失败，错误码:" +
          response.SYS_HEAD.ReturnCode +
          "，错误信息：" +
          response.SYS_HEAD.ReturnMessage
      });
    }
    // console.log(this.devStatuTrans);
    // console.log(this.devRunStatuTrans);
    // console.log(this.modelStatuTrans);
    // console.log(this.connStatuTrans);
    // console.log(this.cardStatuTrans);
    // console.log(this.cashStatuTrans);
  },
  data() {
    return {
      //状态对应文字
      devStatuTrans: {},
      //运行状态对应文字
      devRunStatuTrans: {},
      //模块状态对应文字
      modelStatuTrans: {},
      //连接状态对应文字
      connStatuTrans: {},
      //卡箱状态对应文字
      cardStatuTrans: {},
      //钞箱状态对应文字
      cashStatuTrans: {},

    };
  },
  watch: {
    // devStatuData(val){
    //   console.log(val);
    // }
  },
  methods: {
    clickDetail(item) {
      this.$emit("clickDetail", item, this.data);
    },
    clickAdd() {
      this.$emit("clickAdd");
    }
  },
  props: ["data","devStatuData"]
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.matrix{
  margin:16px 0 0;
}
.labelOption {
  // display: flex;
  // flex-flow: row wrap;
  margin: 0 0 10px 0;
  .labelOptionItem {
    // display: flex;
    // flex-flow: row wrap;
    // align-items: center;
    float: left;
    margin: 0 10px;
    .label {
      display: inline-block;
      border-radius: 3px;
      height: 6px;
      width: 10px;
      margin: 0 5px 0 0;
    }
    .labelText {
      font-size: 12px;
    }
  }
}
.matrixPanelCtn {
  // display: flex;
  // flex-flow: row wrap;
}
.matrixPanel {
  float: left;
  width: 159px;
  height: 156px;
  text-align: center;
  margin: 0 12px 10px 0;
  padding: 20px 0;
  cursor: pointer;
  border-radius: 5px;
  position: relative;
}
.matrixPanel > p {
  margin: 0;
  font-size: 12px;
  color: #888;
}
.matrixPanel > span {
  margin: 0;
  font-size: 12px;
  color: #aaa;
}
.matrixPanel.detailPanel {
  background: #fafafa;
}
.matrixPanel.detailPanel:hover {
  outline: 3px solid #08f;
}
.matrixIcon {
  height: 60px;
  width: 60px;
  color: #dadada;
  transition: 0.3s;
}
.matrixPanel.detailPanel:hover .matrixIcon {
  color: #08f;
}

.matrixPanel.addPanel {
  // background: #fafafa;
  border: 3px dashed #dadada;
  position: relative;
}
.matrixPlusIcon {
  height: 25px;
  width: 25px;
  color: #dadada;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  transition: 0.3s;
}
.matrixPanel.addPanel:hover .matrixPlusIcon {
  transform: scale(1.1);
  color: #888;
}
.panelLabelCtn {
  // position: absolute;
  // bottom: 0;
  // display: flex;
  // flex-flow: row nowrap;
  // justify-content: center;
  width: 65px;
  margin: 0 auto;
  div {
    float: left;
    height: 6px;
    width: 10px;
    border-radius: 3px;
    // background: #67c23a;
    margin: 4px 3px 0 3px;
  }
}
</style>
