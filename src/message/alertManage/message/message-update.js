// 添加预警列表
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      msgId: '',
      umID: '',
      umName: '',
      phoneNumber: '',
      phoneNumber1: '',
      phoneNumber2: '',
      email: '',
      email1: '',
      email2: '',
      isSend: '',
      startTime: '',
      endTime: '',
      brno: '',
      role: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v180.messagemaintainupdate';
  }
}
