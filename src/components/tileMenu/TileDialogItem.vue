<template>
  <div class="tile-dialog-item-wrapper">
    <div class="tile-dialog-item" :class="{ 'tile-item-disable': !isEnabled }">
      <div class="tile-dialog-item-content" :class="{ 'item-with-active': isEnabled }" @click="clickItem">
        <div class="tile-dialog-item-content-icon">
          <img :src="imgSrc">
        </div>
        <div>{{ title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tile-dialog-item",
  props: {
    imgSrc: String,
    title: String,
    isEnabled: Boolean
  },
  data() {
    return {};
  },
  methods: {
    clickItem: function() {
      if (this.isEnabled) {
        this.$emit("itemClicked");
      }
    }
  }
};
</script>
