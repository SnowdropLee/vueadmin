// 查询交易明细
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      branchNo: undefined,
      startdate: undefined,
      enddate: undefined,
      tradetype: undefined,
      devNum: undefined,
      agentserialno: undefined,
      tradestatus: undefined,
      assistno: undefined,
      idnum: undefined,
      customername: undefined,
      cardno: undefined,
      multimediano: undefined
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v118.query_tradedetails';
    this.QueryRowNum = '';
    this.QueryPageNo = '';
  }
}
