export default class requestContent { // 添加交易
  constructor() {
    this.data = {
      tradeName: undefined,
      menuSize: undefined,
      icon: undefined,
      bg: undefined,
      isEnabled: undefined,
      activeClass: undefined,
      isHasChild: undefined,
      categoryName: undefined,
      navigationMode: undefined,
      tadPath: undefined,
      tradeCode: undefined,
      group_Id: '',
      themeColor: '',
      layoutRow: '',
      layoutCol: ''
    };
    this.TransServiceCode = 'aums.v088.menuiteminsert';
  }
}
