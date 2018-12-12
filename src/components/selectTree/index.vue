<template>
<!-- <div class="selectTree">
  <div class="selectTreeSel" @click="clickSel">
    <div class="selectTreeSelCtn">{{selectedStr}}</div>
  </div>
  <i class="fa" :class="ifShow?'fa-sort-up':'fa-sort-down'" @click="clickSel"></i>
  <div class="selectTreeCtn" :class="{show:!ifShow}">
      <simple-tree v-model="checkedIds" :tree-data="treeData" :options="options"></simple-tree>
  </div>
</div> -->



<el-popover
  placement="right"
  width="400"
  trigger="click">
  <!-- <aui-tree :tree-data="treeData"
              v-model="checkedIds"
              :options="options"></aui-tree>
  <el-cascader slot="reference" trigger="focus"></el-cascader> -->
</el-popover>

</template>

<script>
//没有aui库的组件
import simpleTree from "vue-simple-tree/src/components/VueTree.vue";
import "font-awesome/css/font-awesome.min.css";

export default {
  name: "selectTree",
  data() {
    return {
      selectedStr: "",
      ifShow: false //这里不能用vif控制显示隐藏 会重新刷新simpletree组件导致数据绑定出现问题(不显示时simpletree根本不存在)
    };
  },
  components: { simpleTree },
  props: ["checkedIds", "treeData","props", "options","singleCheck"],
  methods: {
    clickSel: function(e) {
      this.ifShow = this.ifShow == false ? true : false;
    }
  },
  watch: {
    checkedIds(curVal) {
      this.selectedStr = curVal.join(",");
      this.$emit("selectCheck", curVal);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.selectTree {
  width: 200px;
  position: relative;
}
.selectTreeSel {
  height: 25px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  line-height: 25px;
  padding: 0 10px;
}
.selectTreeSelCtn {
  margin: 0 12px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selectTreeCtn {
  white-space: nowrap;
  background: #fff;
  min-width: 100%;
  max-width: 200%;
  max-height: 800px;
  overflow: auto;
  border: 1px solid #ddd;
  position: absolute;
  left: 0;
  top: 24px;
  padding-right: 20px;
}
.show {
  display: none;
}
.fa {
  position: absolute;
  top: 0;
  right: 8px;
}
.fa-sort-up {
  top: 8px;
}
.fa-sort-down {
  top: 0;
}
</style>
