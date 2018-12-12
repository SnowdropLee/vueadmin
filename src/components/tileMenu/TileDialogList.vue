<template>
  <div class="tile-dialog-list" :style="{ width: width, height: height }">
    <tile-item
    v-for="(item,index) in tileListData"
    :key="index"
    @itemClicked="onMenuItemClicked(tileColumnIndex, tileGroupIndex, item)"
    :img-src="item.icon"
    :title="item.tradeName"
    :is-enabled="item.isEnabled">
    </tile-item>
  </div>
</template>

<script>
import TileItem from "./TileDialogItem";

export default {
  name: "tile-dialog-list",
  props: {
    tileListData: Array,
    width: String,
    height: String,
    tileColumnIndex: Number,
    tileGroupIndex: Number
  },
  data() {
    return {};
  },
  components: {
    TileItem
  },
  methods: {
    onMenuItemClicked: function(tileColumnIndex, tileGroupIndex, item) {
      this.$emit("itemClicked", [tileColumnIndex, tileGroupIndex, item]);
    }
  }
};
</script>
