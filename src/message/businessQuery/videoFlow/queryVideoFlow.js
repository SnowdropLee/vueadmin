// 查询交易明细
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      startdate: undefined,
      enddate: undefined,
      branchNo: undefined,
      multimediano: undefined,
      customerevaluate: undefined,
      assistno: undefined
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v121_query_vediodetails';
    this.QueryRowNum = '';
    this.QueryPageNo = '';
  }
}
