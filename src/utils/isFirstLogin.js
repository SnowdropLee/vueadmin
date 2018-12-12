import store from '../store'
import { MessageBox } from 'element-ui';

function isFirstLogin() {
  // 首次登陆判断
  if (store.getters.isFirstLoginFLag === '0') {
    MessageBox.confirm('用户首次登陆,请修改密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showCancelButton: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: false
    }).then(() => {
      console.log()
    }).catch((e) => {
      console.log(e)
    });
  }
}

export default isFirstLogin
