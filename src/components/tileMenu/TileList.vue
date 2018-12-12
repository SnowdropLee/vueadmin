<template>
  <div class="tile-list" :style="{ width: width - 1 + 'px', height: parentHeight - 1 + 'px', marginTop: - tileSpace + 'px' }">
    <tile-item ref="items" v-for="(item,index) in tileListData" :key="index" @itemClicked="onMenuItemClicked(tileColumnIndex, tileGroupIndex, item)" :tile-width="tileWidth" :tile-height="tileHeight" :tile-space="tileSpace" :img-src="item.icon" :bgSrc="item.bg" :title="item.tradeName" :size="item.size" :is-enabled="item.isEnabled" :active-class-name="item.activeClass">
    </tile-item>
  </div>
</template>

<script>
import TileItem from "./TileItem";

export default {
  name: "tile-list",
  props: {
    tileListData: Array,
    width: Number,
    height: String,
    tileColumnIndex: Number,
    tileGroupIndex: Number,
    tileWidth: Number,
    tileHeight: Number,
    tileSpace: Number,
    row: Number,
    col: Number
  },
  data() {
    return {
      parentWidth: 0,
      parentHeight: 0,
      xValue: 0,
      yValue: 0,
      currentRow: 1,
      standardWeight: 4,
      normalWeight: 0,
      wideWeight: 0,
      smallWideWeight: 0,
      smallWeight: 0,
      countStage: 0,
      countSum: 0,
      weight: 0,
      page: 0,
      flag: true,
      overCol: 0
    };
  },
  components: {
    TileItem
  },
  created() {
    this.normalWeight = this.standardWeight;
    this.wideWeight = this.standardWeight * 2;
    this.smallWideWeight = this.standardWeight / 2;
    this.smallWeight = this.standardWeight / 4;
  },
  mounted() {
    this.$nextTick(function() {///////////
      let items = this.$refs.items;
      this.setParentSize();

      this.setItemPosition(items);

      this.sendMsgToParent();
    });
  },
  methods: {
    setParentSize() {
      this.parentWidth = (this.tileWidth + this.tileSpace) * this.col;
      this.parentHeight = (this.tileHeight + this.tileSpace) * this.row;
    },
    getItemWidth(item) {
      return parseInt(window.getComputedStyle(item).width);
    },
    getItemHeight(item) {
      return parseInt(window.getComputedStyle(item).height);
    },
    setItemWeight(item) {
      let sizeOfItem = item.$props.size;

      if (sizeOfItem === "normal") {
        this.weight = this.normalWeight;
      } else if (sizeOfItem === "wide") {
        this.weight = this.wideWeight;
      } else if (sizeOfItem === "smallWide") {
        this.weight = this.smallWideWeight;
      } else if (sizeOfItem === "small") {
        this.weight = this.smallWeight;
      } else if (Array.isArray(sizeOfItem)) {
        this.weight = sizeOfItem[0];
        this.parentHeight = sizeOfItem[1];
      }
    },
    setItemPosition(items) {       
      for (let i = 0; i < items.length; i++) {
        let item = items[i].$el;
        let widthOfCurrentItem = this.getItemWidth(item);
        let heightOfCurrentItem = this.getItemHeight(item);

        this.setItemWeight(items[i]);
       
        if (this.countStage === 0) {
          item.style.left = 0;
          item.style.top = this.tileSpace + "px";
          if (widthOfCurrentItem < this.tileWidth) {
            this.xValue = this.tileWidth;
          } else {
            this.xValue = widthOfCurrentItem;
          }
          this.countStage = this.weight;
          this.countSum = this.col * this.standardWeight;
        } else {
          let lastItem = items[i-1].$el;
          let widthOfLastItem = this.getItemWidth(lastItem);
          let heightOfLastItem = this.getItemHeight(lastItem);
          if (this.countStage + this.weight <= this.standardWeight) {
            if (this.countStage === 1) {
              if (this.weight === this.smallWeight) {
                item.style.left = this.xValue - widthOfCurrentItem + "px";
                item.style.top = this.yValue + this.tileSpace + "px";
                this.countStage += this.weight;
              } else if (this.weight === this.smallWideWeight) {
                item.style.left = this.xValue - widthOfCurrentItem + "px";
                item.style.top =
                  this.yValue +
                  this.tileSpace +
                  heightOfLastItem +
                  this.tileSpace +
                  "px";
                this.countStage = 4;
              }
            } else if (this.countStage === 2) {
              if (
                this.weight === this.smallWeight ||
                this.weight === this.smallWideWeight
              ) {
                item.style.left = this.xValue - widthOfLastItem + "px";
                item.style.top =
                  this.yValue +
                  this.tileSpace +
                  heightOfLastItem +
                  this.tileSpace +
                  "px";
                this.countStage += this.weight;
              }
            } else if (this.countStage === 3) {
              if (this.weight === this.smallWeight) {
                item.style.left = this.xValue - widthOfCurrentItem + "px";
                item.style.top =
                  this.yValue +
                  this.tileSpace +
                  heightOfCurrentItem +
                  this.tileSpace +
                  "px";
                this.countStage += this.weight;
              }
            }
            continue;
          }

          let wrapperWidth;
          if (this.overCol) {
            wrapperWidth = (this.tileWidth + this.tileSpace) * this.overCol;
          } else {
            wrapperWidth = this.parentWidth;
          }

          if (
            this.xValue -
              this.parentWidth * this.page +
              this.tileSpace +
              widthOfCurrentItem <=
            wrapperWidth
          ) {
            item.style.left = this.xValue + this.tileSpace + "px";
            item.style.top = this.yValue + this.tileSpace + "px";
            if (widthOfCurrentItem < this.tileWidth) {
              this.xValue += this.tileSpace + this.tileWidth;
            } else {
              this.xValue += this.tileSpace + widthOfCurrentItem;
            }
          } else {
            if (
              this.flag &&
              this.countSum >= this.row * this.col * this.standardWeight
            ) {
              this.flag = false;

              let weightTemp = this.weight;
              let countOver = 0;

              for (let j = i; j < items.length; j++) {
                this.setItemWeight(items[j]);
                countOver += this.weight;
              }
              this.overCol = Math.ceil(
                countOver / this.row / this.standardWeight
              );
              this.weight = weightTemp;
              this.page++;
              this.currentRow = 0;
            }
            if (this.flag) {
              item.style.left = 0;
            } else {
              item.style.left = this.parentWidth + "px";
            }
            item.style.top =
              this.tileHeight * this.currentRow +
              this.tileSpace * (this.currentRow + 1) +
              "px";

            if (widthOfCurrentItem < this.tileWidth) {
              this.xValue = this.parentWidth * this.page + this.tileWidth;
            } else {
              this.xValue = this.parentWidth * this.page + widthOfCurrentItem;
            }
            this.yValue = (this.tileSpace + this.tileHeight) * this.currentRow;
            this.currentRow++;
            this.countSum = this.col * this.standardWeight * this.currentRow;
          }
          this.countStage = this.weight;
        }
      }
      this.parentWidth -= this.tileSpace;
    },
    sendMsgToParent: function() {
      this.$emit("layoutFinished", [this.overCol]);
    },
    onMenuItemClicked: function(tileColumnIndex, tileGroupIndex, item) {
      this.$emit("itemClicked", [tileColumnIndex, tileGroupIndex, item]);
    }
  }
};
</script>
