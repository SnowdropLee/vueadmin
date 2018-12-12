<template>
  <div class="tile-group-header" :style="{ 'background-color': themeColor}" v-if="title">
    <div class="tile-group-header-title">{{ title }}</div>
    <div v-if="overWidth">
      <div class="tile-group-header-expand" @click="changeShow">
        <span>{{ message }}</span>
        <img class="tile-group-header-expand-icon" :src="iconSrc">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tile-group-header",
  props: {
    themeColor: String,
    title: String,
    overWidth: Boolean,
    tileColumnIndex: Number,
    tileGroupIndex: Number,
    isShowMore: Boolean,
    message: String,
    iconSrc: String
  },
  data() {
    return {
      // isShowMore: true,
      // message: '更多',
      // iconSrc: '../../../static/resource/ico/more.png'
    };
  },
  methods: {
    changeShow: function() {
      if (this.isShowMore) {
        this.$emit("moreClicked", [this.tileColumnIndex, this.tileGroupIndex]);
        // this.message = '收起';
        // this.iconSrc = '../../../static/resource/ico/less.png';
        // this.isShowMore = false;
      } else {
        this.$emit("lessClicked", [
          this.tileColumnIndex,
          this.tileGroupIndex,
          "lessClicked"
        ]);
        // this.message = '更多';
        // this.iconSrc = '../../../static/resource/ico/more.png';
        // this.isShowMore = true;
      }
    }
  }
};
</script>
