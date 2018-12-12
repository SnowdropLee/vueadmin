<template>
  <div ref="tileMenu" class="tile-menu">
    <div class="tile-menu-wrapper" ref="tileMenuWrapper">
      <div class="before-animation" ref="beforeAnimation"></div>
      <tile-column ref="tileColumns"
                   v-for="(item,index) in tileMenuData"
                   :key="index"
                   :is-only-show-one="isOnlyShowOne"
                   :tile-width="tileWidth"
                   :tile-height="tileHeight"
                   :tile-space="tileSpace"
                   :tile-column-data="item"
                   :tile-column-index="index"
                    @itemClicked="onMenuItemClicked"
                    @widthChanged="moveIntoView"
                   :is-expanded="index === currentColumnIndex">
      </tile-column>
      <!--   -->
       <!-- -->
      <div class="after-animation" ref="afterAnimation"></div>
    </div>
  </div>
</template>

<script>
import TileColumn from "./TileColumn";
import TileDialog from "./TileDialog";
// import { Dialog } from "../dialog";

export default {
  name: "aui-tile-menu",
  props: {
    tileMenuData: Array,
    tileMenuConfig: Array
  },
  data() {
    return {
      result: undefined,
      currentColumnIndex: undefined,
      isOnlyShowOne: this.tileMenuConfig[0].isOnlyShowOne,
      tileWidth: this.tileMenuConfig[0].tileWidth,
      tileHeight: this.tileMenuConfig[0].tileHeight,
      tileSpace: this.tileMenuConfig[0].tileSpace,
      tileMenuWrapperLeft: undefined,
      tileMenuWrapperPaddingRight: undefined,
      bounceFlag: false,
      numA: 0,
      numB: 0
    };
  },
  components: {
    TileColumn
  },
//   watch: {  
//     tileMenuData:function(newValue, oldValue) {  
//       console.log(newValue,"newValue")
// // 　　　return newValue
// 　　}  
  // }  , 
  mounted() {
    let tileMenuWrapperElement = this.$refs.tileMenuWrapper;
    this.tileMenuWrapperLeft = parseInt(window.getComputedStyle(tileMenuWrapperElement).left);
    this.tileMenuWrapperPaddingRight = parseInt(window.getComputedStyle(tileMenuWrapperElement).paddingRight);
    // this.$refs.tileMenu.addEventListener('wheel', this.handleWheel);
    // this.$refs.tileMenu.addEventListener('touchmove', this.handleTouchMove);
    // this.$refs.tileMenu.addEventListener('touchend', this.handleTouchEnd);
    
  },

  methods: {
    handleWheel(event) {
      this.$refs.tileMenu.scrollLeft = this.$refs.tileMenu.scrollLeft + event.deltaY / 100 * 10;
    },
    handleTouchMove() {
      this.numA = 0;
      this.munB = 0;
      let tileMenuElement = this.$refs.tileMenu;
      let tileMenuWrapperElement = this.$refs.tileMenuWrapper;
      let tileMenuWidth = $(".tile-menu").width();
      let tileMenuWrapperWidth = Number(parseFloat($(".tile-menu .tile-menu-wrapper").css('width')).toFixed(2));
      let tileMenuWrapperLeft = parseFloat($(".tile-menu .tile-menu-wrapper").css('left'));
      // let tileMenuWrapperPaddingRight = parseInt(window.getComputedStyle(tileMenuWrapperElement).paddingRight);
      if(this.$refs.tileMenu.scrollLeft === 0) {
        this.$refs.beforeAnimation.style.width = "60px";
        this.bounceFlag = true;
        // if(!this.bounceFlag) {
        //   tileMenuWrapperElement.style.left = tileMenuWrapperLeft + 40 + 'px';
        //   this.bounceFlag = true;
        // }
      } else if(parseInt(this.$refs.tileMenu.scrollLeft) === parseInt(tileMenuWrapperWidth + tileMenuWrapperLeft - tileMenuWidth)) {
        this.$refs.afterAnimation.style.width = "60px";
        let timer = setTimeout(function() {
          this.bounceFlag = true;
          // console.log('test');
        }, 600);
        // if(!this.bounceFlag) {
        //   console.log('test1');
        //   tileMenuWrapperElement.style.paddingRight = tileMenuWrapperPaddingRight + 40 + 'px';
        //   this.bounceFlag = true;
        // }
      } else {
        if(this.bounceFlag) {
          this.$refs.beforeAnimation.style.width = "0px";
          this.$refs.afterAnimation.style.width = "0px";
          this.bounceFlag = false;
        }
        // console.log('test2');
        // console.log(tileMenuWrapperWidth);
        // console.log(this.$refs.tileMenu.scrollLeft);
        // tileMenuWrapperElement.style.left = this.tileMenuWrapperLeft + 'px';
        // tileMenuWrapperElement.style.paddingRight = this.tileMenuWrapperPaddingRight + 'px';
        // this.bounceFlag = false;
      }
    },
    handleTouchEnd() {
      // if(!this.bounceFlag) {
      //   if(this.$refs.tileMenu.scrollLeft === 0) {
      //     this.$refs.beforeAnimation.style.width = "40px";
      //   } else if(this.$refs.tileMenu.scrollLeft === tileMenuWrapperWidth + tileMenuWrapperLeft - tileMenuWidth) {
      //     this.$refs.afterAnimation.style.width = "40px";
      //   }
      // }
      this.munB = 1;
      if (this.munB == 1) {
        $(".tile-menu").scroll(() => {
          let tileMenuElement = this.$refs.tileMenu;
          let tileMenuWrapperElement = this.$refs.tileMenuWrapper;
          let tileMenuWidth = $(".tile-menu").width();
          let tileMenuWrapperWidth = Number(parseFloat($(".tile-menu .tile-menu-wrapper").css('width')).toFixed(2));
          let tileMenuWrapperLeft = parseFloat($(".tile-menu .tile-menu-wrapper").css('left'));
          if (this.$refs.tileMenu.scrollLeft === 0) {
            this.$refs.beforeAnimation.style.width = "60px";
            setTimeout(() => {
              this.$refs.beforeAnimation.style.width = "0px";
            }, 300);
          }
          if (parseInt(this.$refs.tileMenu.scrollLeft) === parseInt(tileMenuWrapperWidth + tileMenuWrapperLeft - tileMenuWidth) && this.numA == 0) {
            if (this.munB == 1) {
              this.$refs.afterAnimation.style.width = "60px";
              this.numA++;
              if (this.numA == 1) {
                setTimeout(() => {
                  this.$refs.afterAnimation.style.width = "0px";
                }, 300);
              }
            }
          }
        });
      }
      this.$refs.beforeAnimation.style.width = "0px";
      this.$refs.afterAnimation.style.width = "0px";
      this.bounceFlag = false;
      // let tileMenuWrapperElement = this.$refs.tileMenuWrapper;
      // tileMenuWrapperElement.style.left = this.tileMenuWrapperLeft + 'px';
      // tileMenuWrapperElement.style.paddingRight = this.tileMenuWrapperPaddingRight + 'px';
      // this.bounceFlag = false;
    },
    async onMenuItemClicked(params) {
      let tileColumnIndex = params[0];
      let tileGroupIndex = params[1];
      let item = params[2];
      // if (item.children) {
      //   switch (this.tileMenuConfig[0].secondLevelMenuType) {
      //     case "DIALOG":
      //       this.result = await Dialog.showAwait(TileDialog, {
      //         dialogBoxContentArgs: {
      //           children: item.children,
      //           timerType: "shared"
      //         },
      //         closeContentModalRestPart: true
      //       });
      //       if (this.result) {
      //         this.$emit("itemClicked", this.result);
      //       }
      //       break;
      //     case "TILE":
      //       this.$emit("itemClicked", item.children);
      //   }
      // } else {
        this.$emit("itemClicked", item);
      // }
    },
    moveIntoView(params) {
      let tileColumnIndex = params[0];
      let tileGroupIndex = params[1];
      let wrapperLeft = parseInt(
        window.getComputedStyle(this.$refs.tileMenuWrapper).left
      );
      // console.log(this.$refs.tileMenuWrapper.offsetLeft);
      // let columnLeft = this.$refs.tileColumns[tileColumnIndex].$el.offsetLeft + wrapperLeft;
      let columnLeft = this.$refs.tileColumns[
        tileColumnIndex
      ].$el.getBoundingClientRect().left;
      let columnWidth = parseInt(
        window.getComputedStyle(this.$refs.tileColumns[tileColumnIndex].$el)
          .width
      );

      if (params[2]) {
        this.currentColumnIndex = undefined;
        if (columnLeft < 0) {
          let sl = this.$refs.tileMenu.scrollLeft + columnLeft - wrapperLeft;
          $(".tile-menu").animate({ scrollLeft: sl }, 600);
        }
      } else {
        this.currentColumnIndex = params[0];
        if (!this.isOnlyShowOne) {
          if (columnLeft < 0 || columnLeft > wrapperLeft) {
            let sl =
              this.$refs.tileMenu.scrollLeft +
              columnLeft -
              columnWidth +
              (this.tileMenuData[tileColumnIndex][tileGroupIndex].layout[1] *
                184 -
                1) -
              wrapperLeft;
            $(".tile-menu").animate({ scrollLeft: sl }, 600);
            // if (tileColumnIndex === this.$refs.tileColumns.length - 1) {
            //   let sl = this.$refs.tileMenu.scrollLeft + columnLeft - columnWidth + (this.tileMenuData[tileColumnIndex][tileGroupIndex].layout[1] * 184 - 1) - wrapperLeft;
            //   $(".tile-menu").animate({ scrollLeft: sl }, 600);
            // } else {
            //   let sl = this.$refs.tileMenu.scrollLeft + columnLeft - columnWidth + (this.tileMenuData[tileColumnIndex][tileGroupIndex].layout[1] * 184 - 1) - wrapperLeft;
            //   $(".tile-menu").animate({ scrollLeft: sl }, 600);
            // }
          }
        } else {
          let columnWidthSum = 0;
          let newColumnWidthSum = 0;
          for (let i = 0; i <= tileColumnIndex; i++) {
            columnWidthSum =
              columnWidthSum +
              parseInt(
                window.getComputedStyle(this.$refs.tileColumns[i].$el).width
              );
            newColumnWidthSum =
              newColumnWidthSum + this.tileMenuData[i][0].layout[1] * 184 - 1;
          }
          let sl =
            this.$refs.tileMenu.scrollLeft +
            columnLeft -
            columnWidthSum +
            newColumnWidthSum -
            wrapperLeft;
          $(".tile-menu").animate({ scrollLeft: sl }, 600);
        }
      }
    }
  }
};
</script>
