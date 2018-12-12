<template>
  <el-menu class="navbar headerNavbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-tooltip class="item" effect="dark" content="我的首页 " placement="bottom-end">
      <div class="homelogo" @click="homeJump">
        <svg t="1528880215203" class="icon user-avatar" style="" viewBox="0 0 1031 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3555" xmlns:xlink="http://www.w3.org/1999/xlink" width="64.4375" height="64"><defs></defs><path d="M843.51176 1024H707.69576c-41.736 0-75.68-33.144-75.68-73.856V709.656c0-15.6-12.616-28.312-28.168-28.312H422.35976c-15.544 0-28.192 12.712-28.192 28.312v240.488c0 40.72-33.128 73.856-73.832 73.856H186.51976c-40.704 0-73.832-33.144-73.832-73.856l0.192-448.16H30.54376a30.56 30.56 0 0 1-28.008-18.352 30.504 30.504 0 0 1 5.64-32.976l484.88-441.344c11.576-12.408 33.176-12.408 44.744 0l481.648 437.832a30.424 30.424 0 0 1 12.048 24.296 30.52 30.52 0 0 1-31.136 30.544h-82.328v448.16c-0.008 40.712-33.448 73.856-74.52 73.856zM422.35976 620.248h181.496c49.216 0 89.256 40.096 89.256 89.408v240.488c0 6.68 6.944 12.768 14.584 12.768h135.816c7.4 0 13.424-5.728 13.424-12.768V471.44a30.52 30.52 0 0 1 30.544-30.528h42.752L515.42376 74.96 100.67176 440.904h42.776a30.56 30.56 0 0 1 30.552 30.56l-0.208 478.704c0 7.008 5.712 12.736 12.736 12.736h133.816c7.024 0 12.736-5.728 12.736-12.768v-240.48c0-49.312 40.04-89.408 89.28-89.408z" fill="#8a8a8a" p-id="3556"></path></svg>
      </div>
    </el-tooltip>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <svg t="1528352909540" class="icon user-avatar" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1066" 
          xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs></defs>
          <path d="M393.846154 104.999385c108.544 0 196.923077 88.772923 196.923077 197.868307s-88.379077 197.868308-196.923077 197.868308-196.923077-88.772923-196.923077-197.868308 88.379077-197.868308 196.923077-197.868307m0-78.769231c-152.260923 0-275.692308 123.825231-275.692308 276.637538s123.431385 276.637538 275.692308 276.637539 275.692308-123.825231 275.692308-276.637539S546.107077 26.230154 393.846154 26.230154z" fill="#999999" p-id="1067"></path>
          <path d="M748.307692 1010.845538a39.384615 39.384615 0 0 1-39.384615-39.384615v-74.279385c0-174.473846-141.312-316.337231-315.076923-316.33723s-315.076923 141.863385-315.076923 316.33723v74.279385a39.384615 39.384615 0 0 1-78.769231 0v-74.279385c0-217.875692 176.679385-395.106462 393.846154-395.106461s393.846154 177.230769 393.846154 395.106461v74.279385a39.384615 39.384615 0 0 1-39.384616 39.384615zM776.349538 552.881231a39.384615 39.384615 0 0 1-6.774153-78.217846 119.020308 119.020308 0 0 0 47.261538-214.252308 117.681231 117.681231 0 0 0-88.221538-19.692308 39.384615 39.384615 0 0 1-13.784616-77.430154 194.875077 194.875077 0 0 1 147.219693 32.768 197.789538 197.789538 0 0 1-78.848 356.273231 50.254769 50.254769 0 0 1-6.852924 0.551385z" fill="#999999" p-id="1068"></path>
          <path d="M985.403077 876.465231a39.384615 39.384615 0 0 1-39.384615-39.384616v-56.004923a228.115692 228.115692 0 0 0-227.40677-228.27323 39.384615 39.384615 0 1 1 0-78.769231 306.963692 306.963692 0 0 1 306.176 307.042461v56.004923a39.384615 39.384615 0 0 1-39.384615 39.384616z" fill="#999999" p-id="1069"></path>
          </svg>
          <!-- <img class="user-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"> -->
          <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/monitor">
          <el-dropdown-item>
            监控台
          </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    homeJump(){
      this.$router.push({ path: "/home" });
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
        
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
 //新增header样式  header在顶部
  // position: fixed;
  // right: 0;
  // left: 0;
  // top:0;
  // z-index: 1001 !important;
  // background: #409eff;
  // border-bottom-color:#409eff;
  //新增header样式
  .homelogo{
    display:inline-block;
    position: absolute;
    right:100px;
    cursor: pointer;
    margin-top:5px;
    .user-avatar{
       width: 40px;
        height: 40px;
        border-radius: 10px;
    }
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

