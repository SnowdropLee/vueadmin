// 清机记录查询
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      startDate: '',
      endDate: '',
      devNum: '',
      branchNo: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v117.query_cleanmachine_record';
    this.QueryRowNum = '';
    this.QueryPageNo = ''
  }
}
