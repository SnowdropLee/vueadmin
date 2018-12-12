// 查询设备型号列表
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      devBoxId: '',
      devModel: '',
      devType: '',
      brandId: '',
      devModuleId: [],
      devBoxCount: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v047.devmodel_info_update';
  }
}
