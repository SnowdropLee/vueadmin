<template>
  <!-- <scroll-bar> -->
  <!-- <el-scrollbar :style="'height:'+H+'px;'" ref="scroll"> -->
  <el-scrollbar ref="scroll" :style="'height:'+H+'px;'">
    <!-- <button @click="toggleSideBar">收起</button> -->
    <div class="toggleMenu" @click="toggleSideBar">
      <span v-if="sidebar.opened">隐藏菜单</span>
      <i class="el-icon-d-arrow-right" :class="{openStatu:sidebar.opened}"></i>
      <div style="clear:both"></div>
    </div>
    <el-menu mode="vertical" :menu-trigger="'click'" :collapse-transition="false" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#404040" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
  <!-- </scroll-bar> -->
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
// import ScrollBar from "@/components/ScrollBar";

export default {
  data(){
    return{
      H:""
    }
  },
  components: { 
    SidebarItem, 
    // ScrollBar 
    },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    }
  },
  computed: {
    ...mapGetters(['permission_routers', "sidebar", "avatar"]),
    routes() {
      return this.$router.options.routes;
      console.log(this.$router.options.routes);
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created(){
    var that=this;
    this.H=window.innerHeight-60;
    window.addEventListener("resize",function(e){
      if (that.$refs.scroll) {
        that.$refs.scroll.$el.style.height=(window.innerHeight-60)+"px";
      }      
    });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

