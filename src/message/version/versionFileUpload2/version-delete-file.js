// 版本文件上传-版本文件删除
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      versionCode: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v016.branch_version_file_delete';
  }
}
