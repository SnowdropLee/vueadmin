// 初始化设备分类下拉框
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      spinnerList: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.s001.spinner_data_query';
  }
}
