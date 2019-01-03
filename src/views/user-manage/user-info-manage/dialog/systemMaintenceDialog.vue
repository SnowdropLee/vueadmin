<template>
    <div>
        <el-dialog :visible.sync="isShow" width="716px" 
        :close-on-click-modal="false" title="所属系统维护" @close="closeSystem">
            <keep-alive>
                <component :is="dialogList.systemMaintence" :option="option" @systemEmit="systemEmit"></component>
            </keep-alive>
            
        </el-dialog>
    </div>
</template>
<script>
import systemMaintence from "./systemMaintence";
export default {
  props: { option: Object },
  data() {
    return {
      dialogList: { systemMaintence }
    };
  },
  methods: {
    systemEmit(){
      this.$emit("systemEmit");
    },
    closeSystem() {
			// this.$emit("refreshTable")
		}
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
  }
};
</script>
<style lang="sass"  scoped>

</style>
