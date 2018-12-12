// 新建品牌
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      BrandName: '',
      BrandShortName: '',
      BrandPhone: '',
      BrandAdress: '',
      BrandContactsName: '',
      BrandContactsTelephone: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v006.devicebrand_info_increased';
  }
}
