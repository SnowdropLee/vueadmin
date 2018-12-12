// 单点登录
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    // 可根据需求将字段修改
    this.data = {
      userId: '',
      token: ''
    }
    this.TransServiceCode = 'aums.v001.v_user_login';
  }
}
