// 查询设备信息列表
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      branchIdList: [],
      devAssortmentId: [],
      deviceRunState: [],
      devNum: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v055.deviceinfo_list_query';
  }
}
