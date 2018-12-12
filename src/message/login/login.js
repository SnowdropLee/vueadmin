import request from '@/utils/request'

export function Login() {
  // 上送报文字段定义
  this.data = {
    userNo: '',
    loginMethod: '1',
    loginPassword: ''
  }
  // 交易码，每次新建此文件，修改此处为对应的交易码即可
  this.TransServiceCode = 'aums.v001.v_user_login';
}

export function GetInfo() {
  this.data = {
    userId: ''
  }
  this.TransServiceCode = 'aums.v114.login_userinfo_query';
}

export function logout() {
  return request({
    url: '/user/logout'
  })
}
