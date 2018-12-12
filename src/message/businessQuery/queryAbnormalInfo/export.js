// 异常信息导出
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      startdate: '',
      enddate: '',
      branchNo: '',
      tellerNo: '',
      expdealstatus: '',
      channeltype: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v135_query_exception_record';
    this.QueryRowNum = '';
    this.QueryPageNo = '';
  }
}
