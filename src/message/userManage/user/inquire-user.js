// 查询用户列表
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      UserName: '',
      userNo: '',
      branchIdList: []
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v002.user_list_query';
    this.QueryRowNum = '';
    this.QueryPageNo = ''
  }
}
