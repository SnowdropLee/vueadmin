// 版本管理-版本发布
export default class requestContent {
  constructor() {
  // 上送报文字段定义
    this.data = {
      versionCode: '',
      isEffective: '',
      verUpdatePrepareTime: '',
      verUpdateInterval: '',
      verUpdateDevNum: '',
      verUpdatePattern: '',
      verUpdateBrnoList: '',
      branchNo: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v140_releaseverbybrno';
  }
}
