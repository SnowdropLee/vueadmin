<template>
  <div class="tile-column">
    <tile-group v-for="(item,index) in tileColumnData" :key="index" :tile-group-data="item" :is-only-show-one="isOnlyShowOne" :tile-width="tileWidth" :tile-height="tileHeight" :tile-space="tileSpace" :tile-column-index="tileColumnIndex" :tile-group-index="index" @itemClicked="onMenuItemClicked" @showMore="showMore" @showLess="showLess" :is-expanded="isExpanded && index === currentGroupIndex">
    </tile-group>
  </div>
</template>

<script>
import TileGroup from "./TileGroup";

export default {
  name: "tile-column",
  props: {
    tileColumnData: Array,
    isOnlyShowOne: Boolean,
    tileWidth: Number,
    tileHeight: Number,
    tileSpace: Number,
    tileColumnIndex: Number,
    isExpanded: Boolean
  },
  data() {
    return {
      currentGroupIndex: undefined
    };
  },
  components: {
    TileGroup
  },
  methods: {
    onMenuItemClicked: function(params) {
      this.$emit("itemClicked", params);
    },
    showMore: function(params) {
      // this.$emit("widthChanged", params);
      this.currentGroupIndex = params[1];
    },
    showLess: function(params) {
      // this.$emit("widthChanged", params);
      this.currentGroupIndex = undefined;
    }
  }
};
</script>
