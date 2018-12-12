// 新增设备信息
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      devAssortmentId: undefined,
      branchId: undefined,
      serverStartTime: undefined,
      serverEndTime: undefined,
      devNum: undefined,
      virtualTeller: undefined,
      devIp: undefined,
      devId: undefined,
      devState: undefined
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v058.deviceinfo_update';
  }
}
