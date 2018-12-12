<template>
  <div class="share-dropdown-menu" :class="{active:isActive}">
    <div class="share-dropdown-menu-wrapper">
      <span class="share-dropdown-menu-title" @click.self="clickTitle">{{title}}</span>
      <div class="dropdownBody">
           <div class="share-dropdown-menu-item" v-for="(item,index) of items" :key='index'  @click="dropdownItems(item.envents)">
          <!-- <div v-if="item.href" >{{item.title}}</div> -->
          <button class="share-dropdown-menu-item-but" :disabled="enabled">{{item.title}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown-menu",
  props: {
    items: {
      type: Array
    },
    enabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "vue"
    }
  },
  data() {
    return {
      isActive: false
    };
  },
  created() {
    let body = document.querySelector("body");
    body.addEventListener("click", e => {
      if (e.target.className !== "share-dropdown-menu-title") {
        this.isActive = false;
      }
    });
  },
  methods: {
    clickTitle(e) {
      this.isActive = !this.isActive;
    },
    dropdownItems(events) {
      this.$emit("dropClick", events);
      this.isActive = !this.isActive;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
$n: 10; //和items.length 相同
$t: 0.1s;
.dropdownBody {
  // min-height: 30px;
  position: absolute;
  top: 27px;
  // overflow: hidden;
  width: 100px;
  // background: #eee;
}
.share-dropdown-menu {
  width: 100px;
  position: relative;
  z-index: 1;
  &-title {
    width: 100px;
    display: block;
    cursor: pointer;
    background: #409eff;
    color: white;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    text-align: center;
    border-radius: 2px;
    z-index: 1000;
    transform: translate3d(0, 0, 0);
  }
  &-wrapper {
    position: relative;
  }
  &-item {
    text-align: center;
    position: absolute;
    width: 100%;
    background: #e0e0e0;
    line-height: 28px;
    height: 28px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 2px;
    opacity: 0.9;
    transition: transform 0.2s ease;
    &:hover {
      background: #409eff;
      color: white;
    }
    @for $i from 1 through $n {
      &:nth-of-type(#{$i}) {
        z-index: -1;
        transition-delay: $i * $t;
        transform: translate3d(0, -27px, 0);
      }
    }
  }
  &.active {
    .share-dropdown-menu-wrapper {
      z-index: 1;
    }
    .share-dropdown-menu-item {
      // background:#e0e0e0;
      overflow: hidden;
      @for $i from 1 through $n {
        &:nth-of-type(#{$i}) {
          transition-delay: ($n - $i) * $t;
          transform: translate3d(0, ($i - 1) * 27px, 0);
        }
      }
      .share-dropdown-menu-item-but {
        border: none;
        background: none;
      }
    }
  }
}
.share-dropdown-menu-item-but {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
}
</style>
