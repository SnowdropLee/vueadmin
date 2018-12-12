import store from '../store'

function btnPermission(btnPermissionName) { // 这里传入按钮权限表对应的 按钮权限名称
  var ifUse = false; // 若不需要判断按钮权限这个功能，则将ifUse修改为false，打开功能改为true
  if (ifUse) {
    return !!store.getters.button[btnPermissionName];
  } else {
    return true
  }
}

export default btnPermission
