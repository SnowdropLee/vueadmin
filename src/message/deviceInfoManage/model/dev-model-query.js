// 查询设备型号列表
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      devForm: '',
      devModel: '',
      devType: '',
      brandId: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v045.devmodel_info_query';
  }
}
