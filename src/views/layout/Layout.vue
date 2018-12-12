<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <!-- 解决外边距溢出问题 -->
    <table></table>
    <header-bar @open-pwd="dialogChangepw"></header-bar>
    <sidebar class="sidebar-container" ref="sidebar"></sidebar>
    <div class="main-container">
      <!-- <navbar></navbar> -->
      <tags-view></tags-view>    
      <app-main></app-main>
    </div>
    <changepw :option='dialogOptionChangepw'></changepw>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView ,HeaderBar,changepw } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    HeaderBar,
    changepw
  },
  data(){
    return{
      dialogOptionChangepw:{
        isShow:false
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  methods:{
    dialogChangepw(){
      this.dialogOptionChangepw.isShow=true;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
} 
</style>
