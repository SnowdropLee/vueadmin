export default class requestContent {
  constructor() {
    this.data = {
      adtempname: '', // 广告名称
      adtempdesc: '', // 广告描述
      adidledefault: '', // 空闲默认广告
      adidletimelimit: '', // 交易默认广告
      adtransdefault: '', // 交易时间限制广告
      adtranstimelimit: '', // 交易时间限制广告
      adlastupdatetime: '', // 修改时间
      adtempId: '' // 广告Id
    };
    this.TransServiceCode = 'aums.v109.adtempupdate';
  }
}
