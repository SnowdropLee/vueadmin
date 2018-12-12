<template>
  <div class="tile-dialog">
    <div class="tile-dialog-header" :style="{ 'background-color': dialogBoxContentArgs.children[0][0].themeColor }">{{ dialogBoxContentArgs.children[0][0].categoryName }}</div>
    <dialog-list
    :tile-list-data="dialogBoxContentArgs.children[0][0].items"
    :width="184*col>552?(184*col+'px'):'552px'"
    :height="(170*row)+'px'"
    @itemClicked="onMenuItemClicked">
    </dialog-list>
  </div>
</template>

<script>
import DialogList from "./TileDialogList";
// import { Dialog } from "../dialog";

export default {
  name: "tile-dialog",
  props: {
    dialogBoxContentArgs: Object
  },
  data() {
    return {
      row: 2
    };
  },
  components: {
    DialogList
  },
  computed: {
    col: function() {
      if (this.dialogBoxContentArgs.children) {
        return Math.ceil(this.dialogBoxContentArgs.children[0][0].items.length / this.row);
      }
    }
  },
  methods: {
    onMenuItemClicked: function(params) {
      this.result = params[2];
      // Dialog.close(this);
    }
  }
};
</script>
