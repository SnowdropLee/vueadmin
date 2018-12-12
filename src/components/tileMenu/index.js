import TileBlock from './TileBlock'
import TileColumn from './TileColumn'
import TileDialog from './TileDialog'
import TileDialogItem from './TileDialogItem'
import TileDialogList from './TileDialogList'
import TileGroup from './TileGroup'
import TileGroupHeader from './TileGroupHeader'
import TileItem from './TileItem'
import TileList from './TileList'
import TileMenu from './TileMenu'
const install = function (Vue, options) {
  Vue.component(TileBlock.name, TileBlock);
  Vue.component(TileColumn.name, TileColumn);
  Vue.component(TileDialog.name, TileDialog);
  Vue.component(TileDialogItem.name, TileDialogItem);
  Vue.component(TileDialogList.name, TileDialogList);
  Vue.component(TileGroup.name, TileGroup);
  Vue.component(TileGroupHeader.name, TileGroupHeader);
  Vue.component(TileItem.name, TileItem);
  Vue.component(TileList.name, TileList);
  Vue.component(TileMenu.name, TileMenu);
}
export default { install }
