// 版本管理-版本设备发布关系查询
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      versionCode: '',
      devNum: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v037.version_to_dev_query';
  }
}
