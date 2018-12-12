// 版本管理-版本文件信息保存
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      versionCode: '',
      strategy_Id: '',
      uploadFileName: '',
      mainVersionCode: '',
      description: '',
      urlAddress: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v010.branch_version_file_upload';
  }
}
