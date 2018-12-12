// 管理端操作记录查询
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      startdate: '',
      enddate: '',
      operatetype: '',
      zoneno: '',
      branchNo: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v123_query_operation_record';
    this.QueryRowNum = '';
    this.QueryPageNo = ''
  }
}
