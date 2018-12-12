const getters = {
  sidebar: state => state.app.sidebar,

  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,

  token: state => state.user.token,
  userId: state => state.user.userId,
  userName: state => state.user.userName,
  userNo: state => state.user.userNo,
  branchId: state => state.user.branchId,
  branchName: state => state.user.branchName,
  branchNo: state => state.user.branchNo,
  menu: state => state.user.menu,
  button: state => state.user.button,
  isFirstLoginFLag: state => state.user.isFirstLoginFLag
}
export default getters
