// 新建C端
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      devForm: [],
      cProgramName: '',
      cProgramBasicId: []
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'aums.v039.c_program_info_insert';
  }
}
