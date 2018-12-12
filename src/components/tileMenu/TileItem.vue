<template>
  <div class="tile-item" :class="[disableClass, wholeActiveClass]" :style="{ width: itemWidth + 'px', height: itemHeight + 'px', background: setBackground }" @click="clickItem">
    <div class="tile-item-inner-wrapper" :style="{ width: itemWidth + 'px', height: itemHeight - 32 + 'px' }">
      <div class="tile-item-active-wrapper" :class="[innerActiveClass]" :style="{ width: itemWidth - 32 + 'px', height: itemHeight - 32 + 'px' }" @click="clickItemInner">
        <div class="tile-item-content">
          <div class="tile-item-icon" :class="[typeIcon]" v-if="isShowImg">
            <img :src="imgSrc">
          </div>
          <div class="tile-item-text" :class="[typeText]">{{ title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tile-item",
  props: {
    imgSrc: String,
    bgSrc: String,
    title: String,
    isEnabled: Boolean,
    activeClassName: String,
    tileWidth: Number,
    tileHeight: Number,
    tileSpace: Number,
    size: String | Array
  },
  data() {
    return {
      itemWidth: undefined,
      itemHeight: undefined
    };
  },
  created() {
    if (this.size === "normal") {
      this.itemWidth = this.tileWidth;
      this.itemHeight = this.tileHeight;
    } else if (this.size === "wide") {
      this.itemWidth = this.tileWidth * 2 + this.tileSpace;
      this.itemHeight = this.tileHeight;
    } else if (this.size === "smallWide") {
      this.itemWidth = this.tileWidth;
      this.itemHeight = (this.tileHeight - this.tileSpace) / 2;
    } else if (this.size === "small") {
      this.itemWidth = (this.tileWidth - this.tileSpace) / 2;
      this.itemHeight = (this.tileHeight - this.tileSpace) / 2;
    } else if (Array.isArray(this.size)) {
      this.itemWidth = this.size[0];
      this.itemHeight = this.size[1];
    }
  },
  computed: {
    isShowImg() {
      return !(this.size === "smallWide" || this.size === "small");
    },
    typeIcon() {
      return this.size + '-tile-item-icon';
    },
    typeText() {
      return this.size + '-tile-item-text';
    },
    setBackground() {
      if(this.bgSrc) {
        return `url(${this.bgSrc})`;
      } else {
        return undefined;
      }
    },
    disableClass() {
      if(this.isEnabled) {
        return '';
      } else {
        return 'tile-item-disable';
      }
    },
    wholeActiveClass() {
      if(this.tileSpace) {
        if(this.activeClassName) {
          return this.activeClassName;
        } else {
          if(this.isEnabled) {
            return 'item-with-active';
          } else {
            return '';
          }
        }
      } else {
        return '';
      }
    },
    innerActiveClass() {
      if(!this.tileSpace) {
        if(this.activeClassName) {
          return this.activeClassName;
        } else {
          if(this.isEnabled) {
            return 'item-with-active';
          } else {
            return ''
          }
        }
      } else {
        return '';
      }
    },
  },
  methods: {
    clickItemInner: function() {
      if (this.isEnabled) {
        if (!this.tileSpace) {
          this.$emit("itemClicked");
        }
      }
    },
    clickItem: function() {
      if (this.isEnabled && this.tileSpace) {
        this.$emit("itemClicked");
      }
    }
  }
};
</script>
