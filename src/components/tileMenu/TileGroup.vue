<template>
  <div class="tile-group">
    <tile-group-header @moreClicked="showMore" @lessClicked="showLess" :tile-column-index="tileColumnIndex" :tile-group-index="tileGroupIndex" :title="tileGroupData.categoryName" :theme-color="tileGroupData.themeColor" :over-width="overWidth" :message="message" :icon-src="iconSrc" :is-show-more="isShowMore" v-if="isShow">
    </tile-group-header>
    <tile-list :tile-width="tileWidth" :tile-height="tileHeight" :tile-space="tileSpace" :tile-column-index="tileColumnIndex" :tile-group-index="tileGroupIndex" :tile-list-data="tileGroupData.items" :row="tileGroupData.layout[0]" :col="tileGroupData.layout[1]" :width="changeWidth" :height="(170*row)+'px'" @layoutFinished="receiveMsgFromChild" @itemClicked="onMenuItemClicked" v-if="isShow">
    </tile-list>
    <tile-block :tile-column-index="tileColumnIndex" :tile-group-index="tileGroupIndex" :theme-color="tileGroupData.themeColor" :tile-block-data="tileGroupData.items[0]" @itemClicked="onMenuItemClicked" v-else>
    </tile-block>
  </div>
</template>

<script>
import TileGroupHeader from "./TileGroupHeader";
import TileList from "./TileList";
import TileBlock from "./TileBlock";

export default {
  name: "tile-group",
  props: {
    tileGroupData: Object,
    isOnlyShowOne: Boolean,
    tileWidth: Number,
    tileHeight: Number,
    tileSpace: Number,
    tileColumnIndex: Number,
    tileGroupIndex: Number,
    isExpanded: Boolean
  },
  data() {
    return {
      row: this.tileGroupData.layout[0],
      col: this.tileGroupData.layout[1],
      message: "更多",
      iconSrc: require("!!url-loader?limit=100000!./images/more.png"),
      isShowMore: true,
      overCol: 0
    };
  },
  components: {
    TileGroupHeader,
    TileList,
    TileBlock
  },
  computed: {
    isShow: function() {
      return (
        this.tileGroupData.layout[0] !== 1 || this.tileGroupData.layout[1] !== 1
      );
    },
    overWidth: function() {
      return this.overCol !== 0;
    },
    changeWidth: function() {
      return (this.tileWidth + this.tileSpace) * this.col - this.tileSpace;
    }
  },
  watch: {
    isExpanded: function() {
      if (this.isOnlyShowOne) {
        if (this.isExpanded) {
          this.col = this.tileGroupData.layout[1] + this.overCol;
          this.message = "收起";
          this.iconSrc = require("!!url-loader?limit=100000!./images/less.png");
          this.isShowMore = false;
        } else {
          this.col = this.tileGroupData.layout[1];
          this.message = "更多";
          this.iconSrc = require("!!url-loader?limit=100000!./images/more.png");
          this.isShowMore = true;
        }
      }
    }
  },
  methods: {
    showMore: function(params) {
      this.$emit("showMore", params);
      if (!this.isOnlyShowOne) {
        this.col = this.tileGroupData.layout[1] + this.overCol;
        this.message = "收起";
        this.iconSrc = require("!!url-loader?limit=100000!./images/less.png");
        this.isShowMore = false;
      }
      // this.col = Math.ceil(this.tileGroupData.items.length / this.row);
    },
    showLess: function(params) {
      this.$emit("showLess", params);
      if (!this.isOnlyShowOne) {
        this.col = this.tileGroupData.layout[1];
        this.message = "更多";
        this.iconSrc = require("!!url-loader?limit=100000!./images/more.png");
        this.isShowMore = true;
      }
      // this.col = this.tileGroupData.layout[1];
    },
    receiveMsgFromChild: function(params) {
      this.overCol = params[0];
    },
    onMenuItemClicked: function(params) {
      this.$emit("itemClicked", params);
    }
  }
};
</script>
