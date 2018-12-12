import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '@/store'
import getGlobalParams from './getGlobalParams'
import {
  getToken,
  setToken,
  getUserId,
  getBranchId
} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: getGlobalParams.get('communicationAddress'), // api的base_url
  timeout: getGlobalParams.get('communicationTimeout') // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  config.method = 'post';
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  config.data = {
    SYS_HEAD: {
      aumsToken: getToken(),
      TransServiceCode: config.TransServiceCode
    },
    APP_HEAD: {
      userId: getUserId(),
      branchId: getBranchId()
    },
    QUERY_INFO_HEAD: {
      QueryPageNo: config.QueryPageNo,
      QueryRowNum: config.QueryRowNum
    },
    REQ_BODY: config.data
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    /**
     * 状态码
     * 000000:成功状态码
     * CIC027:token校验失败
     * CIC028:token已过期
     */
    if (res && res.SYS_HEAD.ReturnCode === '000000') {
      if (res && res.SYS_HEAD.aumsToken === '') {
        MessageBox.confirm('非法的token，系统将立即退出', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
          return
        })
      }
      const headData = res.SYS_HEAD
      setToken(headData.aumsToken)
      return response.data
    } else if (res && res.SYS_HEAD.ReturnCode === 'CIC027' || res.SYS_HEAD.ReturnCode === 'CIC028') {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
        return
      })
      // 在出错后不能使用reject 会导致代码后面不执行
    } else {
      // 在这里报错一次 在程序中又报错一次
      // Message({
      //   message: res.SYS_HEAD.ReturnMessage,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // return Promise.reject(res.SYS_HEAD.ReturnMessage);
      return response.data;
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    // return Promise.reject(error)
  }
)

export default service
