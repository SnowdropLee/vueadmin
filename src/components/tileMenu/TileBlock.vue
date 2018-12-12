<template>
  <div class="tile-block" :style="{ 'background-color': themeColor, 'filter': enabledColor }" @click="clickItem">
    <img class="tile-block-icon" :src="tileBlockData.icon" alt="">
    <span class="tile-block-title">{{ tileBlockData.tradeName }}</span>
  </div>
</template>

<script>
export default {
  name: "tile-block",
  props: {
    tileBlockData: Object,
    themeColor: String,
    tileColumnIndex: Number,
    tileGroupIndex: Number
  },
  data() {
    return {
      enabledColor: ""
    };
  },
  mounted() {
    if (!this.tileBlockData.isEnabled) {
      this.enabledColor = "grayscale(1)";
    } else {
      this.enabledColor = "";
    }
  },
  methods: {
    clickItem: function() {
      this.$emit("itemClicked", [
        this.tileColumnIndex,
        this.tileGroupIndex,
        this.tileBlockData
      ]);
    }
  }
};
</script>
