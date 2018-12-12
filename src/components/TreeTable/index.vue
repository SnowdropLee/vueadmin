<template>
  <div>
  <el-table :data="formatData" :toggleRow="toggleRow" :row-style="showRow" ref="tableSystem"
   v-bind="$attrs"  @select="tableSelect" @select-all="selectionAll"
   :clearRow="clearRow">
    <el-table-column type="selection" :selectable="selectable" ></el-table-column>
    <el-table-column v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index,scope)                                                            ">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.row[column.value]}}
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from "./eval";
export default {
  name: "treeTable",
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false //是否全展开
    },
    toggleRow:{
      type:Array,
      default: () => []
    },
  },
  data(){
    return{
      isSelectC:false,
      isSelectGS:false,
      isSelectPad:false,
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;
      
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return func.apply(null, args);
    },
  },
  watch: {
    toggleRow: {
      handler: function(val, oldVal) {
        this.clearRow()
        this.recursionData(this.data,false)
        for (let i = 0; i < this.toggleRow.length; i++) {
          this.$refs.tableSystem.toggleRowSelection(this.toggleRow[i]); //默认选中当前行
          this.toggleRow[i]._isSelected=true
          this.isParent(this.toggleRow[i].parent,true)
        }
      },
      // deep: true
    }
  },
  methods: {
    selectable(row,index){
      if (row.hasOwnProperty("isUser") && row.isUser) {
        return false
      }else{
        return true
      }
    },
    clearRow(){
      this.$refs.tableSystem.clearSelection()      
    },
    recursionData(data,status){//递归解析数据
      for (let i = 0; i < data.length; i++) {
        this.$set(data[i],'_isSelected',status)    
        if (data[i].hasOwnProperty("children")) {
          this.recursionData(data[i].children,status)
        }
      }    
    },
    selectionAll(selection){  //整个表格全选
      for (let i = 0; i < selection.length; i++) {
        this.$set(selection[i],'_isSelected',true)
      }
      if (selection.length===0) {
        this.recursionData(this.data,false)
      }
    },
    isParent(parent,isSelected){//子元素选中父元素是否选中
       if (parent) {
         let count=0;
        for (let j = 0; j < parent.children.length; j++) {
          if (parent.children[j]._isSelected) {
            count++
          }
        }
        if (count==parent.children.length) {//判断是否所有子元素都被选中
          this.$refs.tableSystem.toggleRowSelection(parent); //默认选中当前行    
          this.$set(parent,'_isSelected',true)//向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。            
          if(parent.hasOwnProperty("parent")){
            this.isParent(parent.parent,true)            
          }
        }else{
          this.$refs.tableSystem.toggleRowSelection(parent,false); //默认选中当前行    
          this.$set(parent,'_isSelected',false)//向响
          if(parent.hasOwnProperty("parent")){
            this.isParent(parent.parent,false)            
          }                     
        }
      }
    },
    isSelAllData(val,isSelected,parent){//实现表格局部全选功能
      this.isParent(parent,isSelected)      
      for (let i = 0; i < val.length; i++) {
        this.$set(val[i],'_isSelected',isSelected)//向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。
        this.$refs.tableSystem.toggleRowSelection(val[i],isSelected); //默认选中当前行 
        if (val[i].hasOwnProperty("children")) {
          this.isSelAllData(val[i].children,isSelected)
        }  
      }
    },
    tableSelect(selection, val) {      
      if (val.hasOwnProperty("children")) {//调用全选
        if (!val._isSelected) {
          this.isSelAllData(val.children,true,val.parent)
        }else{
          this.isSelAllData(val.children,false,val.parent)
        }
      }
      val._isSelected=!val._isSelected  //不能换位置
      if (val.hasOwnProperty("parent")) {//子控制父
        if (!val._isSelected) {
          this.isParent(val.parent,true)
        }else{
          this.isParent(val.parent,false)
        }
      }
      this.$emit("returnData", selection, val);//将选中行的数据返回给父元素
    },
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex,scope) {
      const record = this.formatData[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow(index, record) {      
      
      return index === 0 && record.children && record.children.length > 0;
    }
  }
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>
