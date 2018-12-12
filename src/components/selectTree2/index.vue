<template>
  <el-popover
    placement="bottom-start"
    min-width=""
    trigger="click"
    >
    <div style="min-width: 150px;
    min-height: 200px;
    max-height: 300px;
    overflow:auto;">
      <el-input v-model="keySearch" placeholder=""></el-input>
      <el-tree
        ref="tree"
        :data="treeData"
        :node-key="props.id"
        show-checkbox
        :filter-node-method="filterNode"
        check-strictly

        @check="checkBoxHandle"
        :expand-on-click-node=false
        :props="props"
        >
      </el-tree>
    </div>
      <el-input
        placeholder="请选择机构"
        v-model="selectedStr"
        slot="reference" trigger="focus"
        readonly
        >
      </el-input>
  </el-popover>
</template>

<script>
//依赖elementui
//目前将点选择设值为单个独立选择
export default {
  name: "selectTree",
  data() {
    return {
      keySearch:"",
      selectedStr: ""
      // tempSelectedAllArr: []
    };
  },
  props: ["checkedIds", "treeData", "props", "singleCheck"],
  methods: {
    //使用computed钩子会出现错误 所以定义方法在每一个节点自行调用
    arrToString() {
      let arr = this.$refs.tree.getCheckedNodes();
      let output = [];
      arr.map(
        function(item) {
          output.push(item[this.props.label]);
        }.bind(this)
      );
      this.selectedStr = output.join(",");
    },
    checkBoxHandle(data, b) {
      //当单选时
      if (this.singleCheck == true || this.singleCheck == "true") {
        this.$refs.tree.setCheckedNodes([data]);
      }
      this.$emit("checkKeys", this.$refs.tree.getCheckedKeys());
      this.$emit("select-check", this.$refs.tree.getCheckedNodes());
    },
    filterNode(value, data) {
      //在这里做筛选的配置 当前为查找（机构名称 机构号）
      if (!value) return true;
      return (data[this.props.label].indexOf(value) !== -1)||(data['branchNo']?data['branchNo'].indexOf(value) !== -1:false);
    },
    //选择所有子节点功能未完成
    // selectAllChildren(node) {
    //   if (node) {
    //     for (var k in node.children) {
    //       this.tempSelectedAllArr.push(node.children[k].id);
    //       this.selectAllChildren(node.children[k]);
    //     }
    //   } else {
    //     return;
    //   }
    // },
  },
  model: {
    prop: "checkedIds",
    event: "checkKeys"
  },
  watch: {
    keySearch(val) {
      this.$refs.tree.filter(val);
    },
    treeData(){
      this.$refs.tree.setCheckedKeys(this.checkedIds);
      this.arrToString();
    },
    checkedIds() {
      this.$refs.tree.setCheckedKeys(this.checkedIds);
      this.arrToString();
    },
    deep: true
  },
  mounted() {
    this.$refs.tree.setCheckedKeys(this.checkedIds);
    this.arrToString();
  },
  updated() {
    this.$refs.tree.setCheckedKeys(this.checkedIds);
    this.arrToString();
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-input /deep/.el-input__inner{
  cursor: pointer;
}
.el-popover /deep/.el-input__inner{
  cursor: text;
}
</style>
