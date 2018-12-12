// 修改预警
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      policyId: '',
      type: '',
      policyProperty: '',
      execute_Starttime: '',
      execute_Endtime: '',
      working_Interval: '',
      notifyMethod: '',
      umId: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v166.warningpolicyupdate';
  }
}
