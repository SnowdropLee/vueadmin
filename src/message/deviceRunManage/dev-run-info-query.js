// 查询设备运行列表
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      DevNum: '',
      BranchId: '',
      deviceType: '',
      DeviceRunState: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v009.devrunning_infolist_query';
    this.QueryRowNum = '';
    this.QueryPageNo = ''
  }
}
