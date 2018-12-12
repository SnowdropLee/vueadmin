import { MessageBox } from 'element-ui';
import store from '../store'

function isPermission() {
  if (store.getters.menu.length === 0 || store.getters.menu === null) {
    MessageBox.confirm('此用户没有关联权限，请联系管理员设置后重新登录', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      // showConfirmButton:false,
      showCancelButton: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: false
    }).then(() => {
      store.dispatch('FedLogOut').then(() => {
        location.reload();
      });
    }).catch((e) => {
      console.log(e)
    });
  }
}

export default isPermission
