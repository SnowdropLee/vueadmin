import { Login, logout, GetInfo } from '@/message/login/login'
import {
  getToken, setToken, removeToken,
  getUserId, setUserId,
  getUserName, setUserName,
  getUserNo, setUserNo,
  getBranchId, setBranchId,
  getBranchName, setBranchName,
  getBranchNo, setBranchNo,
  setMenu,
  getButton, setButton,
  getIsFirstLoginFLag, setIsFirstLoginFLag
} from '@/utils/auth'
import md5 from 'js-md5';
import request from '@/utils/request'
// import loginUser from '@/message/login'
// , setIsFirstLoginFLag,
const user = {
  state: {
    token: getToken(),
    userId: getUserId(),
    userName: getUserName(),
    userNo: getUserNo(),
    branchId: getBranchId(),
    branchName: getBranchName(),
    branchNo: getBranchNo(),
    menu: [],
    button: getButton(),
    isFirstLoginFLag: getIsFirstLoginFLag()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_USERNO: (state, userNo) => {
      state.userNo = userNo
    },
    SET_BRANCHID: (state, branchId) => {
      state.branchId = branchId
    },
    SET_BRANCHNAME: (state, branchName) => {
      state.branchName = branchName
    },
    SET_BRANCHNO: (state, branchNo) => {
      state.branchNo = branchNo
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    },
    SET_BUTTON: (state, button) => {
      state.button = button
    },
    SET_ISFIRSTLOGINFLAG: (state, isFirstLoginFLag) => {
      state.isFirstLoginFLag = isFirstLoginFLag
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const userNo = userInfo.username.trim()
      const loginPassword = md5(userInfo.password).toUpperCase()
      return new Promise((resolve, reject) => {
        const resBody = new Login()
        resBody.data.userNo = userNo
        resBody.data.loginPassword = loginPassword
        request(resBody)
          .then(response => {
            
            if (response.SYS_HEAD.ReturnCode === '000000') {
              const data = response.SYS_HEAD
              setToken(data.aumsToken)
              setUserId(response.RSP_BODY.userId)
              commit('SET_TOKEN', data.aumsToken)
              commit('SET_USERID', response.RSP_BODY.userId)
              resolve(data)
            } else {
              resolve(response.SYS_HEAD)
            }
          })
          .catch(error => {
            reject(error)
            console.log(error)
          });
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const resBody = new GetInfo()
        resBody.data.userId = state.userId
        request(resBody).then(response => {
          
          if (response.SYS_HEAD.ReturnCode === '000000') {
            const data = response.RSP_BODY
            // if (data.menuElementKeyList && data.menuElementKeyList.length > 0) { // 验证返回的roles是否是一个非空数组
            //   commit('SET_ROLES', data.menuElementKeyList)
            // } else {
            //   reject('getInfo: roles must be a non-null array !')
            // }
            setBranchId(data.branchId)
            setBranchName(data.branchName)
            setBranchNo(data.branchNo)
            setUserName(data.userName)
            setMenu(data.menuElementKeyList)
            setButton(data.buttonElementKeyList)
            setUserNo(data.userNo)
            setIsFirstLoginFLag(data.isFirstLoginFLag)
            commit('SET_BRANCHID', data.branchId)
            commit('SET_BRANCHNAME', data.branchName)
            commit('SET_BRANCHNO', data.branchNo)
            commit('SET_USERNAME', data.userName)
            commit('SET_USERNO', data.userNo)
            commit('SET_MENU', data.menuElementKeyList)
            // 提前处理一下
            // var buttonTempArr=[];
            // data.buttonElementKeyList.map(function(item){buttonTempArr[item]=1});
            // commit('SET_BUTTON', buttonTempArr)
            commit('SET_BUTTON', data.buttonElementKeyList)
            commit('SET_ISFIRSTLOGINFLAG', data.isFirstLoginFLag)
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_MENU', [])
        commit('SET_BUTTON', [])
        removeToken()
        resolve()
      })
    },

    // sso
    SSOLogin({ commit }, view) {
      commit('SET_USERID', view.userId)
      commit('SET_TOKEN', view.aumsToken)
    }
  }
}

export default user
